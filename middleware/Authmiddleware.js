const jwt = require('jsonwebtoken');
const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};
const dokterMiddleware = (req, res, next) => {
  if (req.user.role !== 'dokter') {
    return res.status(403).json({ message: 'Access denied. Dokter only.' });
  }
  next();
};
const ApotekerMiddleware = (req, res, next) => {
  if (req.user.role !== 'apoteker') {
    return res.status(403).json({ message: 'Access denied. Dokter only.' });
  }
  next();
};
const AdminOrApotekerDokterMiddleware = (req, res, next) => {
  const role = req.user.role;
  if (role !== 'admin' && role !== 'apoteker' && role !== 'dokter') {
    return res.status(403).json({ message: 'Access denied. Admin or Apoteker , dokter only.' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware, dokterMiddleware, ApotekerMiddleware, AdminOrApotekerDokterMiddleware };
