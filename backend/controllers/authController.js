import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const verify = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.status(200).json({ user });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login request received:', {
      email: email,
      password: password ? '*****' : 'undefined',
      headers: req.headers,
      body: req.body
    });
    const user = await User.findOne({ email: email?.toString()?.trim()?.toLowerCase() }).select('+password');
    if (!user) {
      console.log('No user found with email:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password',
        errorType: 'email',
        shouldRedirect: false
      });
    }
    console.log('User found:', user.email);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password', 
        errorType: 'password',
        shouldRedirect: false
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT secret is not configured - please set JWT_SECRET in your .env file');
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.setHeader('Authorization', `Bearer ${token}`).json({ 
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token 
    });
  } catch (error) {
    console.error('Login error:', error);
    let status = 500;
    let message = 'Authentication failed';
    
    if (error.message.includes('credentials')) {
      status = 401;
      message = error.message;
    } else if (error.message.includes('try again')) {
      status = 503;
      message = error.message;
    }
    
    res.status(status).json({
      message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, role: 'admin' }).select('+password');

    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    // Return both user and token in response
    res.setHeader('Authorization', `Bearer ${token}`).json({ 
      success: true,
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      },
      token 
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email exists (any role)
    const existingUser = await User.findOne({ email: email?.toString()?.trim()?.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Email already registered',
        field: 'email'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user' // Default role
    });

    await newUser.save();
    
    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT secret not configured');
    }
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET);
    
    // Return success response
    res.setHeader('Authorization', `Bearer ${token}`)
       .status(201)
       .json({ 
         success: true,
         user: {
           _id: newUser._id,
           name: newUser.name,
           email: newUser.email,
           role: newUser.role,
           password: newUser.password // Including hashed password for debugging
         },
         token
       });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const adminRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const existingAdmin = await User.findOne({ email, role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    await newAdmin.save();
    const token = jwt.sign({ id: newAdmin._id, role: newAdmin.role }, process.env.JWT_SECRET);
    res.setHeader('Authorization', `Bearer ${token}`).status(201).json({ user: newAdmin });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
