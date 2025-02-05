const cookieSession = require('cookie-session');
const handleCookieSessions = cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET],
  // By default, the cookie's lifetime is "session"
  // which means until we close the browser. We like this for now!
  // But in real life you'd set the cookie to expire,
  // and implement an auto re-auth flow, but that's too much at this point.

  // maxAge: 1000 * 60 * 60 * 24  // 24 hours
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
  secure: process.env.NODE_ENV === 'production', // Only secure in production
  httpOnly: true, // Protect from client-side JS access
  sameSite: 'lax' // Helps with cross-site cookie issues
});

module.exports = handleCookieSessions;