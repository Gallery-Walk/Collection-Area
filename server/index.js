require("dotenv").config();
const express = require("express");
const path = require('path')

//middleware imports
const logRoutes = require('./middleware/logRoutes')
const authentication = require('./middleware/auth')
const handleCookies = require('./middleware/handleCookies');

//controller imports
const authControllers = require('./controllers/authControllers')
const userControllers = require('./controllers/userControllers');
const app = express()

//middleware
app.use(handleCookies);
app.use(logRoutes)
app.use(express.json())
app.use(express.static(path.join(__dirname, '../GALLERY_WALK/dist')))

//auth routes
app.get('/api/me', authControllers.showMe)
app.post('/api/login', authControllers.loginUser)
app.delete('/api/logout', authControllers.logoutUser)


//user routes
app.post('/api/users', authentication, userControllers.listUsers);
app.get('/api/users/:id', authentication, userControllers.showUser)
app.patch('/api/user/:id/edit', authentication, userControllers.updateUser)

//fallback fallback (route)
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) return next()
  res.sendFile(path.join(__dirname, '../GALLERY_WALK/dist/index.html'));
});

//LISTENING

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`)
})

