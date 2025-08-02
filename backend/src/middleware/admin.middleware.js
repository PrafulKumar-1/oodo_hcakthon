/**
 * Middleware to verify if the authenticated user has an 'ADMIN' role.
 * This should be used after the 'protect' middleware.
 * @param {object} req - The Express request object. Expects req.user to be populated by the protect middleware.
 * @param {object} res - The Express response object.
 * @param {function} next - The next middleware function.
 */
const isAdmin = (req, res, next) => {
  // Check if the user object exists and has the role of 'ADMIN'
  if (req.user && req.user.role === 'ADMIN') {
    next(); // User is an admin, proceed to the next handler
  } else {
    // If not an admin, send a 403 Forbidden status
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

module.exports = { isAdmin };
