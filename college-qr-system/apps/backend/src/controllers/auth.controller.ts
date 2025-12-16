import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../prismaclient';
import { generateToken } from '../utils/jwt';
import { z } from 'zod';
import { generateOTP, getOTPExpiry, isOTPExpired } from '../utils/otp';

// Validation schemas
const registerInitSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['STUDENT', 'ADMIN', 'GUARD']),
  rollNumber: z.string().optional(),
  idNumber: z.string().optional(),
  username: z.string().optional(),
}).refine((data) => {
  // Students must have rollNumber
  if (data.role === 'STUDENT' && !data.rollNumber) return false;
  // Guards must have idNumber
  if (data.role === 'GUARD' && !data.idNumber) return false;
  // Admins must have username
  if (data.role === 'ADMIN' && !data.username) return false;
  return true;
}, {
  message: 'Students require rollNumber, Guards require idNumber, Admins require username',
});

const verifyOTPSchema = z.object({
  email: z.string().email('Invalid email format'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['STUDENT', 'ADMIN', 'GUARD', 'SUPER_ADMIN']),
  rollNumber: z.string().optional(),
  idNumber: z.string().optional(),
  username: z.string().optional(),
});

const getZodMessage = (e: any) => (e && e.errors && e.errors[0] && e.errors[0].message) ? e.errors[0].message : 'Invalid input';

// Step 1: Register user and send OTP
export const registerInit = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = registerInitSchema.parse(req.body);
    const { name, email, password, role, rollNumber, idNumber, username } = validatedData;
    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      res.status(400).json({ 
        error: 'User already exists with this email' 
      });
      return;
    }

    // Check if rollNumber or username already exists
    // For students use rollNumber; for guards use idNumber (stored in rollNumber column)
    const numberToCheck = role === 'GUARD' ? idNumber : rollNumber;
    if (numberToCheck) {
      const existingRollNumber = await prisma.user.findUnique({
        where: { rollNumber: numberToCheck },
      });
      if (existingRollNumber) {
        res.status(400).json({ error: 'Roll/ID number already exists' });
        return;
      }
    }

    if (username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username },
      });
      if (existingUsername) {
        res.status(400).json({ error: 'Username already exists' });
        return;
      }
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user with unverified status
    const storedRollNumber: string | null = role === 'ADMIN' ? null : (role === 'GUARD' ? (idNumber ?? null) : (rollNumber ?? null));
    const storedUsername: string | null = role === 'ADMIN' ? (username ?? null) : null;

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        role,
        // store guard idNumber in rollNumber column to avoid schema changes
        rollNumber: storedRollNumber,
        username: storedUsername,
        isApproved: role !== 'ADMIN', // Admins need approval, others are auto-approved
        isVerified: false, // Not verified until OTP is confirmed
        otp,
        otpExpiry,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // TODO: Integrate email provider (Supabase, SendGrid, etc.) to send OTP
    // For now, log OTP to console for testing
    console.log(`[DEV] OTP for ${normalizedEmail}: ${otp}`);
    const emailSent = true; // Stub: assume success until email provider is integrated

    if (!emailSent) {
      // Rollback - delete the created user
      await prisma.user.delete({ where: { id: user.id } });
      res.status(500).json({ error: 'Failed to send verification email. Please try again.' });
      return;
    }

    res.status(201).json({
      message: 'Registration initiated. Please check your email for the verification code.',
      userId: user.id,
      email: user.email,
      expiresIn: '3 minutes',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: getZodMessage(error) });
      return;
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Step 2: Verify OTP
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = verifyOTPSchema.parse(req.body);
    const { email, otp } = validatedData;
    const normalizedEmail = email.toLowerCase();

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ error: 'Email already verified' });
      return;
    }

    if (!user.otp || !user.otpExpiry) {
      res.status(400).json({ error: 'No OTP found. Please request a new one.' });
      return;
    }

    // Check if OTP is expired
    if (isOTPExpired(user.otpExpiry)) {
      res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
      return;
    }

    // Verify OTP
    if (user.otp !== otp) {
      res.status(400).json({ error: 'Invalid OTP' });
      return;
    }

    // Update user as verified and clear OTP
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otp: null,
        otpExpiry: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        rollNumber: true,
        username: true,
        isApproved: true,
        isVerified: true,
      },
    });

    // Generate token only for non-admin users
    const token = updatedUser.role !== 'ADMIN' ? generateToken(updatedUser.id, updatedUser.role) : null;

    res.status(200).json({
      message: updatedUser.role === 'ADMIN'
        ? 'Email verified! Please wait for Super Admin approval to login.'
        : 'Email verified successfully! You can now login.',
      user: updatedUser,
      token,
      needsApproval: updatedUser.role === 'ADMIN',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: getZodMessage(error) });
      return;
    }
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Resend OTP
export const resendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    const normalizedEmail = String(email).toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ error: 'Email already verified' });
      return;
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    // Update user with new OTP
    await prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpiry },
    });

    // TODO: Integrate email provider (Supabase, SendGrid, etc.) to send OTP
    // For now, log OTP to console for testing
    console.log(`[DEV] OTP for ${normalizedEmail}: ${otp}`);
    const emailSent = true; // Stub: assume success until email provider is integrated

    if (!emailSent) {
      res.status(500).json({ error: 'Failed to send verification email. Please try again.' });
      return;
    }

    res.status(200).json({
      message: 'New verification code sent to your email',
      expiresIn: '3 minutes',
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password, role, rollNumber, username, idNumber } = validatedData;
    const normalizedEmail = email.toLowerCase();

    // Build where clause based on role
    let whereClause: any = { email: normalizedEmail, role };

    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      // Admin/Super Admin login with username
      if (!username) {
        res.status(400).json({ error: 'Username is required for admin login' });
        return;
      }
      whereClause.username = username;
    } else if (role === 'GUARD') {
      // Guard login with idNumber (stored in rollNumber column)
      if (!idNumber) {
        res.status(400).json({ error: 'ID number is required for guard login' });
        return;
      }
      whereClause.rollNumber = idNumber;
    } else {
      // Student login with roll number
      if (!rollNumber) {
        res.status(400).json({ error: 'Roll number is required for student login' });
        return;
      }
      whereClause.rollNumber = rollNumber;
    }

    // Find user
    const user = await prisma.user.findFirst({
      where: whereClause,
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Check if email is verified (skip for super admin)
    if (user.role !== 'SUPER_ADMIN' && !user.isVerified) {
      res.status(403).json({ error: 'Please verify your email first' });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Check if admin is approved
    if (user.role === 'ADMIN' && !user.isApproved) {
      res.status(403).json({ error: 'Your admin account is pending approval from Super Admin' });
      return;
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber,
        username: user.username,
      },
      token,
      isSuperAdmin: user.role === 'SUPER_ADMIN',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: getZodMessage(error) });
      return;
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        rollNumber: true,
        username: true,
        isVerified: true,
        isApproved: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
