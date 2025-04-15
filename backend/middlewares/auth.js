import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', {
      error: error.message,
      tokenPresent: !!token,
      tokenValidFormat: token?.split('.').length === 3,
      env: process.env.NODE_ENV,
      jwtSecretSet: !!process.env.JWT_SECRET
    });
    return res.status(401).json({ 
      message: 'Authentication failed',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

const adminMiddleware = (req, res, next) => {
  authMiddleware(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  });
};

export { authMiddleware, adminMiddleware };
export default authMiddleware;
