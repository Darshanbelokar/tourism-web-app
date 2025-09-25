import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";

const router = express.Router();

// Secret key (⚠️ in real projects, store this in .env)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Email validation function
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Simulate sending verification email (replace with real email service)
const sendVerificationEmail = async (email, token, fullName) => {
  // In production, use services like SendGrid, Nodemailer, etc.
  console.log(`
📧 Email Verification Required
To: ${email}
Subject: Verify Your Email - Jharkhand Tourism

Dear ${fullName},

Thank you for signing up for Jharkhand Tourism! Please verify your email address by using this verification code:

🔑 Verification Token: ${token}

This token will expire in 24 hours.

If you didn't create this account, please ignore this email.

Best regards,
Jharkhand Tourism Team
`);
  
  // For development, we'll just log the token
  // In production, you'd send an actual email
  return true;
};

// ----------------- SIGNUP -----------------
router.post("/signup", async (req, res) => {
  try {
    console.log('� Signup attempt:', { 
      email: req.body.email, 
      hasPassword: !!req.body.password,
      fullName: req.body.fullName 
    });

    const { fullName, email, password } = req.body;

    // Input validation
    if (!fullName || !email || !password) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        message: "All fields are required (fullName, email, password)" 
      });
    }

    // Email format validation
    if (!isValidEmail(email)) {
      console.log('❌ Invalid email format:', email);
      return res.status(400).json({ 
        message: "Please enter a valid email address (e.g., user@example.com)" 
      });
    }

    // Password strength validation
    if (password.length < 6) {
      console.log('❌ Password too short');
      return res.status(400).json({ 
        message: "Password must be at least 6 characters long" 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('❌ Email already registered:', email);
      return res.status(400).json({ 
        message: "An account with this email address already exists" 
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate email verification token
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user with verification token
    const user = new User({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires
    });

    await user.save();
    console.log('✅ User created successfully:', { 
      id: user._id, 
      email: user.email, 
      verified: user.isEmailVerified 
    });

    // Send verification email
    await sendVerificationEmail(email, verificationToken, fullName);

    res.status(201).json({
      message: "Account created successfully! Please check your email for verification instructions.",
      userId: user._id,
      email: user.email,
      requiresVerification: true,
      verificationSent: true
    });

  } catch (error) {
    console.error("❌ Signup error:", error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "An account with this email address already exists" 
      });
    }
    
    res.status(500).json({ 
      message: "Server error during signup. Please try again." 
    });
  }
});

// ----------------- EMAIL VERIFICATION -----------------
router.post("/verify-email", async (req, res) => {
  try {
    console.log('📧 Email verification attempt:', req.body);

    const { email, token } = req.body;

    if (!email || !token) {
      console.log('❌ Missing email or token');
      return res.status(400).json({ 
        message: "Email and verification token are required" 
      });
    }

    // Find user by email and token
    const user = await User.findOne({
      email: email.toLowerCase(),
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }
    });

    if (!user) {
      console.log('❌ Invalid or expired verification token');
      return res.status(400).json({ 
        message: "Invalid or expired verification token. Please request a new verification email." 
      });
    }

    // Verify the email
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    user.updatedAt = new Date();
    
    await user.save();

    console.log('✅ Email verified successfully:', user.email);

    res.status(200).json({
      message: "Email verified successfully! You can now log in to your account.",
      verified: true,
      email: user.email
    });

  } catch (error) {
    console.error("❌ Email verification error:", error);
    res.status(500).json({ 
      message: "Server error during email verification. Please try again." 
    });
  }
});

// ----------------- RESEND VERIFICATION EMAIL -----------------
router.post("/resend-verification", async (req, res) => {
  try {
    console.log('📧 Resend verification request:', req.body);

    const { email } = req.body;

    if (!email || !isValidEmail(email)) {
      console.log('❌ Invalid email for resend verification');
      return res.status(400).json({ 
        message: "Please provide a valid email address" 
      });
    }

    // Find unverified user
    const user = await User.findOne({
      email: email.toLowerCase(),
      isEmailVerified: false
    });

    if (!user) {
      console.log('❌ No unverified account found for email:', email);
      return res.status(404).json({ 
        message: "No unverified account found with this email address" 
      });
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpires;
    user.updatedAt = new Date();

    await user.save();

    // Send new verification email
    await sendVerificationEmail(user.email, verificationToken, user.fullName);

    console.log('✅ Verification email resent:', user.email);

    res.status(200).json({
      message: "Verification email sent successfully! Please check your inbox.",
      email: user.email,
      verificationSent: true
    });

  } catch (error) {
    console.error("❌ Resend verification error:", error);
    res.status(500).json({ 
      message: "Server error while sending verification email. Please try again." 
    });
  }
});

// ----------------- LOGIN -----------------
router.post("/login", async (req, res) => {
  try {
    console.log("📩 Login attempt for:", req.body.email);
    
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ 
        message: "Email and password are required" 
      });
    }

    // Email format validation
    if (!isValidEmail(email)) {
      console.log('❌ Invalid email format for login:', email);
      return res.status(400).json({ 
        message: "Please enter a valid email address" 
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    // Check email verification status
    if (!user.isEmailVerified) {
      console.log('❌ Email not verified:', email);
      return res.status(403).json({ 
        message: "Please verify your email address before logging in. Check your inbox for verification instructions.",
        requiresVerification: true,
        email: user.email
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        verified: user.isEmailVerified
      },
      JWT_SECRET,
      { expiresIn: "24h" } // Extended to 24 hours for better UX
    );

    console.log("✅ User logged in successfully:", user.email);
    
    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      },
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ 
      message: "Server error during login. Please try again." 
    });
  }
});

export default router;
