// src/controllers/authController.js
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { generateToken } from '../utils/token.js';
// Import the central models hub instead of the specific model file
import { models } from '../models/index.js';

const SALT_ROUNDS = 12;

export async function register(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;
    // Use models.User to access the User model
    const existing = await models.User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    // Use models.User here as well
    const user = await models.User.create({
      name,
      email,
      password: hash,
      role: role || 'user',
    });

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

// export async function login(req, res) {
//   // Remember to update the login function to use models.User as well!
//   // ...
//   const user = await models.User.findOne({ where: { email } });
//   // ...
// }
export async function login(req, res) {
try {
  const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(422).json({ errors: errors.array() });
}

const { email, password } = req.body;

const user = await models.User.findOne({ where: { email } });
if (!user) {
  return res.status(401).json({ error: "Invalid credentials" });
}

const match = await bcrypt.compare(password, user.password);
if (!match) {
  return res.status(401).json({ error: "Invalid credentials" });
}

// In authController.js login function:
const token = generateToken({ id: user.id, role: user.role });
res.cookie('jwt', token, {
            httpOnly: true, // Prevents client-side JS from accessing the token
            secure: process.env.NODE_ENV === 'production', // Use HTTPS only in production
            sameSite: 'Lax', // Protects against some CSRF attacks
            maxAge: process.env.JWT_COOKIE_EXPIRES_MS // Ensure this matches your token expiration (1 day)
        });
// Remove 'token,' from the JSON response
return res.json({ 
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
});
} catch (err) {

    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
 }
}
/**
 * Clears the HttpOnly JWT cookie to log the user out.
 * @route POST /api/v1/auth/logout
 */
export function logout(req, res) {
    // Clear the 'jwt' cookie by setting an empty value and an immediate expiration
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0), // Sets expiration to the past
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
    });

    return res.status(200).json({ message: 'Logged out successfully' });
}