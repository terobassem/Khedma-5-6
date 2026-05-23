export const notFound = (req, res, next) => {
  res.status(404).json({ success: false, message: `المسار غير موجود: ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'خطأ في الخادم',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
