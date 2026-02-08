const errorHandler = (err, req, res, next) => {
  console.log("func called 1");
  console.error(err.stack);

  if(err.name === 'ValidationError'){
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: Object.values(err.errors).map(e => e.message)
    });
  }

  if(err.name === 'CastError'){
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format'
    });
  }

  if(err.code === 11000){
    return res.status(409).json({
      success: false,
      error: 'Duplicate key error'
    });
  }

  res.status(500).json({
    success: false,
    error: 'Server Error',
    message: err.message || 'Something went wrong'
  });
};

const notFound = (req, res, next) => {
  console.log("func called 1");
  
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
};

module.exports = { errorHandler, notFound };