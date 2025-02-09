const { isAuthorized } = require('../utils/auth-utils')
const User = require('../models/User')

exports.createUser = async (req, res) => {
  const { username, bio, password, liked_pictures } = req.body

  const user = await User.create(username, password)
  req.session.userId = user.id

  res.send(user);
}

exports.listUsers = async (req, res) => {
  const users = await User.list()
  res.send(users);
}

exports.showUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.find(id);
  if (!user) return res.sendStatus(404);

  res.send(user);
}

exports.updateUser = async (req, res) => {
  const { username, bio, liked_pictures, password } = req.body;
  const { id } = req.params;
  console.log('Request Body:', req.body)

  if (!isAuthorized(id, req.session)) return res.sendStatus(403);

  const updateUser = await User.update(id, { username, bio, liked_pictures })
  if (!updateUser) return res.sendStatus(404)
  res.send(updateUser)
}

exports.userLikePic = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: "Image URL is required" });
    }

    const updatedUser = await User.likePicture(id, imageUrl);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Picture liked successfully", liked_pictures: updatedUser.liked_pictures });
  } catch (error) {
    console.error('Error in userLikePic controller:', error);  // Log the full error
    res.status(500).json({ message: error.message });
  }
};

exports.userGetPic = async (req, res) => {
  try {
    const { id } = req.params;
    const likedPictures = await User.getLikedPictures(id);
    res.json({ liked_pictures: likedPictures });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.deleteLikedPicture = async (req, res) => {
  const { id } = req.params;
  const { imageUrl } = req.body;

  // console.log('Received delete request for user ID:', id);
  // console.log('Received image URL:', imageUrl);

  if (!imageUrl) {
    console.error('No image URL provided in the request body.');
    return res.status(400).json({ message: 'Image URL is required.' });
  }

  try {
    const updatedUser = await User.deleteLikedPicture(id, imageUrl);
    // console.log('Updated user after deletion:', updatedUser);

    if (updatedUser) {
      // Return only the fields needed for the frontend
      const { id, username, liked_pictures } = updatedUser;

      res.status(200).json({
        message: 'Picture removed from likes successfully!',
        user: { id, username, liked_pictures }
      });
    } else {
      res.status(404).json({ message: 'Liked picture not found.' });
    }
  } catch (error) {
    console.error('Error removing liked picture:', error.message);
    console.error('Stack Trace:', error.stack);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

// exports.moveBackToLikedPictures = async (req, res) => {
//   const { id } = req.params
//   const { imageUrl } = req.body

//   const updatedUser = await User.moveBackToLikedPictures(id, imageUrl);
//   if (updatedUser) {
//     res.status(200).json({
//       message: 'Image moved back to liked pictures',
//       liked_Pictures: updatedUser.liked_pictures,
//       moved_Pictures: updatedUser.moved_pictures
//     })
//   } else {
//     res.status(404).json({ message: 'Image not found in moved pictures' })
//   }
// }

// exports.getMovedPictures = async (req, res) => {
//   const { id } = req.params;

//   const movedPictures = await User.getMovedPictures(id)
//   res.status(200).json({ moved_pictures: movedPictures })
// }

// exports.moveAllLikedPictures = async (req, res) => {
//   const { id } = req.params

//   const updateUser = await User.moveAllLikedPictures(id)
//   if (updateUser) {
//     res.status(200).json({
//       message: "All liked pictures moved",
//       moved_pictures: updateUser.moved_pictures
//     })
//   } else {
//     res.status(404).json({ message: 'User not found.' })
//   }
// }
