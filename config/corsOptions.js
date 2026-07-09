const allowedOrigins = require("../config/allowedOrigin");

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, server-to-server)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // For testing, allow all origins
      // Remove this in production
      console.log('Origin not in allowed list, but allowing:', origin);
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  maxAge: 86400
};

module.exports = corsOptions;