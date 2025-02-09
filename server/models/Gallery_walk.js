const knex = require('../db/knex');

class GalleryWalk {
  constructor({ id, user_id, imageUrl }) {
    this.id = id;
    this.user_id = user_id;
    this.imageUrl = imageUrl || []
  }

  static async publishGalleryWalk(userId, imageUrls) {
    // First, check if a gallery already exists for this user
    const existingGallery = await knex('gallery_walk')
      .where({ userId })
      .first();  // Get the first matching record

    if (existingGallery) {
      throw new Error('Gallery already published by this user.');
    }

    // If no existing gallery, proceed to publish
    const query = `
      INSERT INTO "gallery_walk" ("userId", "imageUrl")
      VALUES (?, ?)
      RETURNING *
    `;

    const formattedImageUrls = `{${imageUrls.map(url => `"${url}"`).join(',')}}`;

    const result = await knex.raw(query, [userId, formattedImageUrls]);

    return result.rows[0] ? result.rows[0] : null;
  }



  static async findAll() {
    const result = await knex('gallery_walk')
      .join('users', 'gallery_walk.userId', '=', 'users.id')  // Join with users table
      .select(
        'gallery_walk.id',
        'gallery_walk.imageUrl',
        'gallery_walk.userId',
        'users.username'  // Select the username from users table
      );

    return result.map(row => ({
      id: row.id,
      userId: row.userId,
      username: row.username,  // Include the username in the response
      imageUrl: row.imageUrl
    }));
  }




  static async deleteGalleryWalk(userId) {
    const query = `
    DELETE FROM "gallery_walk"
    WHERE "userId" = ?
    RETURNING *
  `;
    const result = await knex.raw(query, [userId]);
    return result.rows.length > 0 ? result.rows.map(row => new GalleryWalk(row)) : null;
  }
}

module.exports = GalleryWalk