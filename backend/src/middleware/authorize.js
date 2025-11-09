const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Normalize allowed roles to Prisma enum format (UPPER_SNAKE_CASE)
    const allowed = roles.map(r => String(r).toUpperCase());

    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: allowed,
        current: req.user.role
      });
    }

    next();
  };
};

module.exports = { authorize };
