const jwt = require("jsonwebtoken");
const secretKey = "your_secret_key";

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('[authMiddleware] Authorization header:', authHeader);
  
  if (!authHeader) {
    console.log('[authMiddleware] No authorization header');
    return res.status(403).json({ message: "доступ запрещен" });
  }

  const token = authHeader.split(" ")[1];
  console.log('[authMiddleware] Extracted token:', token ? `${token.substring(0, 20)}...` : 'null');

  if (!token) {
    console.log('[authMiddleware] No token in header');
    return res.status(403).json({ message: "доступ запрещен" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    console.log('[authMiddleware] Token verified successfully:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('[authMiddleware] Token verification failed:', error.message);
    console.error('[authMiddleware] Error details:', {
      name: error.name,
      message: error.message,
      tokenPreview: token.substring(0, 30) + '...'
    });
    return res.status(400).json({ message: "токен некорректный" });
  }
};

module.exports = authenticate;
