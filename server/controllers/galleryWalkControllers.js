const GalleryWalk = require('../models/Gallery_walk')

exports.getAllImages = async (req, res) => {
  try {
    const images = await GalleryWalk.findAll();
    console.log('Images from DB:', images)

    res.status(200).send(images);  // Now includes userId in each object
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.publishGalleryWalk = async (req, res) => {
  const { userId, imageUrls } = req.body;

  try {
    const publishedGallery = await GalleryWalk.publishGalleryWalk(userId, imageUrls);
    if (publishedGallery) {
      res.json(publishedGallery);
    } else {
      res.status(400).json({ error: 'Failed to publish gallery walk' });
    }
  } catch (error) {
    if (error.message === 'Gallery already published by this user.') {
      res.status(409).json({ error: error.message });  // 409 Conflict for duplicate
    } else {
      console.error('Error publishing gallery walk:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};






exports.deleteGalleryWalk = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedGallery = await GalleryWalk.deleteGalleryWalk(id);

    if (deletedGallery) {
      res.status(200).json({
        message: 'Gallery walk deleted successfully',
        deletedGallery: {
          id: deletedGallery.id,
          userId: deletedGallery.userId,
          imageUrl: deletedGallery.imageUrl
        }
      });
    } else {
      res.status(404).json({ error: 'Gallery walk not found' });
    }
  } catch (error) {
    console.error('Error deleting gallery walk:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
