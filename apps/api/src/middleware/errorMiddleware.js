export function errorMiddleware(error, req, res, next) {
  if (res.headersSent) return next(error);
  return res.status(400).json({ message: error.message || "Unexpected error" });
}
