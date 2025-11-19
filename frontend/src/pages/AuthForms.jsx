import React, { useState } from 'react';
import * as taskService from '../services/taskService.js'; 
import { toast } from 'react-toastify'; // <-- Added toast import

// Reusable input style
const inputClass = "w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all";
const buttonClass = "w-full py-2.5 bg-teal-500 hover:bg-teal-600 rounded-lg text-white font-medium shadow-lg transition-all duration-300 transform hover:scale-[1.01]";


// --- 1. Login Component ---
export const LoginComponent = ({ onLoginSuccess, onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const user = await taskService.loginUser({ email, password });
            
            if (user && user.email) {
                onLoginSuccess(user);
            } else {
                setError('Login failed: Invalid user data received.');
                toast.error('Invalid credentials or user not found.'); // Notification for failed login
            }
        } catch (err) {
            console.error('Login Failed:', err.response?.data || err);
            const errorMessage = err.response?.data?.error || 'Login failed. Check your credentials.';
            setError(errorMessage);
            
            // Check for specific error message to prompt registration
            if (errorMessage.includes('Invalid credentials')) {
                toast.error('Invalid username or password.'); // Specific error for invalid credentials
            } else if (errorMessage.includes('User not found') || errorMessage.includes('Email already registered')) {
                 toast.error('User not found. Please register.'); // Specific error for user not found
            } else {
                 toast.error(errorMessage);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-sm border border-slate-700">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Sign In</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
                </div>
                <div>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} />
                </div>
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                <button type="submit" disabled={isSubmitting} className={`${buttonClass} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {isSubmitting ? 'Logging In...' : 'Login'}
                </button>
            </form>
            <p className="text-sm text-slate-400 mt-4 text-center">
                Need an account? <button onClick={onSwitchToRegister} className="text-teal-400 hover:text-teal-300 font-semibold">Register</button>
            </p>
        </div>
    );
};


// --- 2. Register Component ---
export const RegisterComponent = ({ onRegisterSuccess, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setIsSubmitting(true);

        try {
            await taskService.registerUser(formData);
            
            setSuccess(true);
            toast.success('Registration successful! Please log in.'); // Registration Success Notification
            setTimeout(() => {
                onRegisterSuccess(); 
            }, 1500); 

        } catch (err) {
            console.error('Registration Failed:', err.response?.data || err);
            const errorMessage = err.response?.data?.error || 'Registration failed. Try again.';
            setError(errorMessage);
            toast.error(`Registration failed: ${errorMessage}`); // Registration Failure Notification
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-sm border border-slate-700">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Sign Up</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                    <input type="password" name="password" placeholder="Password (min 6 chars)" value={formData.password} onChange={handleChange} required className={inputClass} />
                </div>
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                {success && <p className="text-green-400 text-sm text-center">Registration successful! Redirecting to login...</p>}
                <button type="submit" disabled={isSubmitting || success} className={`${buttonClass} ${isSubmitting || success ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {isSubmitting ? 'Registering...' : 'Register'}
                </button>
            </form>
            <p className="text-sm text-slate-400 mt-4 text-center">
                Already have an account? <button onClick={onSwitchToLogin} className="text-teal-400 hover:text-teal-300 font-semibold">Login</button>
            </p>
        </div>
    );
};