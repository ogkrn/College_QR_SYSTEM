# OTP Email Verification System

## Overview
The system now includes email verification using OTP (One-Time Password) for all user registrations except Super Admin.

## Features
- ✅ 6-digit OTP sent via email using Resend API
- ✅ OTP expires after 3 minutes
- ✅ Resend OTP functionality
- ✅ Email uniqueness check
- ✅ Roll number/username uniqueness check
- ✅ Super Admin bypasses OTP verification
- ✅ Database cleaned of all users except Super Admin

## Setup Instructions

### 1. Get Resend API Key
1. Go to https://resend.com and sign up for a free account
2. Create an API key from your dashboard
3. Copy the API key

### 2. Configure Environment Variables
Add your Resend API key to `.env` file:
```env
RESEND_API_KEY=re_your_actual_api_key_here
```

### 3. Database Schema Changes
The User model now includes:
- `isVerified`: Boolean (default: false) - Email verification status
- `otp`: String (nullable) - Stores the current OTP
- `otpExpiry`: DateTime (nullable) - OTP expiration timestamp

## Registration Flow

### For Students/Guards:
1. User fills registration form with name, email, password, and roll number
2. Backend creates user with `isVerified: false`
3. Generates 6-digit OTP valid for 3 minutes
4. Sends OTP to user's email
5. User enters OTP on verification page
6. Backend validates:
   - OTP matches
   - OTP not expired
   - Email not already verified
7. Sets `isVerified: true` and clears OTP
8. User can now login

### For Admins:
1. Same as above, but additionally requires Super Admin approval
2. After email verification, shows message: "Email verified! Please wait for Super Admin approval"
3. Cannot login until Super Admin approves

### For Super Admin:
- Already exists in database
- Pre-verified (`isVerified: true`)
- No OTP required

## API Endpoints

### POST /auth/register
Initiates registration and sends OTP email.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@college.edu",
  "password": "password123",
  "role": "STUDENT",
  "rollNumber": "2025BCS001"
}
```

**Response:**
```json
{
  "message": "Registration initiated. Please check your email for the verification code.",
  "userId": "xxx",
  "email": "john@college.edu",
  "expiresIn": "3 minutes"
}
```

### POST /auth/verify-otp
Verifies the OTP and completes registration.

**Request:**
```json
{
  "email": "john@college.edu",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "Email verified successfully! You can now login.",
  "user": {...},
  "token": "jwt_token"
}
```

### POST /auth/resend-otp
Resends a new OTP if previous one expired.

**Request:**
```json
{
  "email": "john@college.edu"
}
```

**Response:**
```json
{
  "message": "New verification code sent to your email",
  "expiresIn": "3 minutes"
}
```

### POST /auth/login
Login with verified credentials.

**Additional Check:**
- Returns 403 if email not verified: "Please verify your email first"

## Backend Validation

### Registration Checks:
1. ✅ Email already exists in database?
2. ✅ Roll number already exists (for students/guards)?
3. ✅ Username already exists (for admins)?

### OTP Verification Checks:
1. ✅ User exists with this email?
2. ✅ Email already verified?
3. ✅ OTP exists for this user?
4. ✅ OTP matches the submitted code?
5. ✅ OTP not expired (< 3 minutes old)?

### Login Checks:
1. ✅ User exists?
2. ✅ Email verified?
3. ✅ Password correct?
4. ✅ Admin approved (for admin role)?

## Email Template
The OTP email includes:
- Professional styling with gradient header
- Large, bold OTP code
- Expiration warning (3 minutes)
- Security notice

## Testing

### Super Admin (No OTP Required):
- Username: `Admin@1`
- Email: `Admin@gmail.com`
- Password: `Admin@123`

### New User Registration:
1. Go to `/register`
2. Fill in details
3. Submit form
4. Check email for OTP
5. Enter OTP on `/verify-otp` page
6. Login at `/login`

## Security Features
- OTP is 6 digits (100,000 to 999,999)
- OTP expires after 3 minutes
- OTP is cleared after successful verification
- Only verified users can login
- Admins require both email verification AND super admin approval

## Database Cleanup
Run the seed script to clean the database:
```bash
npm run seed
```
This will:
- Delete all users except Super Admin
- Keep Super Admin with verified status

## Notes
- Free Resend account allows 100 emails/day
- For production, use a custom verified domain in Resend
- Default sender is: `onboarding@resend.dev`
