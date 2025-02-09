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
const galleryWalkControllers = require('./controllers/galleryWalkControllers')
const authenticate = require("./middleware/auth");
const app = express()

//middleware


app.use(express.json())
app.use(handleCookies);
app.use(logRoutes)


app.use((req, res, next) => {
  console.log("Session Data:", req.session);
  next();
});

//auth routes
app.get('/api/me', authControllers.showMe)
app.post('/api/login', authControllers.loginUser)
app.delete('/api/logout', authControllers.logoutUser)


//user routes
app.post('/api/users', userControllers.createUser);
app.post('/api/users/:id/like-picture', authentication, userControllers.userLikePic)
app.get('/api/users/:id/liked-pictures', authentication, userControllers.userGetPic)
app.get('/api/users', authentication, userControllers.listUsers);
app.get('/api/users/:id', authentication, userControllers.showUser)
app.patch('/api/user/:id/edit', authentication, userControllers.updateUser)
app.delete('/api/users/:id/liked-pictures', authentication, userControllers.deleteLikedPicture)

//getting all pictures from user to go to "walk" 
app.post('/api/publish', galleryWalkControllers.publishGalleryWalk)
app.get('/api/images', galleryWalkControllers.getAllImages)
app.delete('/api/delete/:id', galleryWalkControllers.deleteGalleryWalk)

// app.post('/api/users/:id/move-liked-pictures', authentication, userControllers.moveAllLikedPictures)
// app.get('/api/users/:id/moved-pictures', authentication, userControllers.getMovedPictures)
// app.post('/api/users/:id/move-back-picture', authentication, userControllers.moveBackToLikedPictures)

// console.log(userControllers)

app.use(express.static(path.join(__dirname, '../GALLERY_WALK/dist')))

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

