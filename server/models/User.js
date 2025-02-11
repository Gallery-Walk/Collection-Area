const knex = require('../db/knex');
const authUtils = require('../utils/auth-utils');

class User {
  #passwordHash = null; // a private property

  // This constructor is NOT how a controller creates a new user in the database.
  // Think of it more like a formatter function. It is used by each of the User 
  // static methods to hide the hashed password of users before sending user data 
  // to the client. Since we want to keep the #passwordHash property private, we 
  // provide the isValidPassword instance method as a way to indirectly access it.
  constructor({ id, username, password_hash, bio, profile_pic, liked_pictures }) {
    this.id = id;
    this.username = username;
    this.#passwordHash = password_hash;
    this.bio = bio;
    this.profile_pic = profile_pic;
    this.liked_pictures = liked_pictures || [];
  }

  // This instance method takes in a plain-text password and returns true if it matches
  // the User instance's hashed password. Can be used by controllers.
  isValidPassword = async (password) => (
    authUtils.isValidPassword(password, this.#passwordHash)
  );



  // Fetches ALL users from the users table, uses the constructor
  // to format each user (and hide their password hash), and returns.
  static async list() {
    const query = `SELECT * FROM users`;
    const result = await knex.raw(query);
    return result.rows.map((rawUserData) => new User(rawUserData));
  }

  // Fetches A single user from the users table that matches
  // the given user id. If it finds a user, uses the constructor
  // to format the user and returns or returns null if not.
  static async find(id) {
    const query = `SELECT * FROM users WHERE id = ?`;
    const result = await knex.raw(query, [id]);
    const rawUserData = result.rows[0];
    return rawUserData ? new User(rawUserData) : null;
  }


  // Same as above but uses the username to find the user
  static async findByUsername(username) {
    const query = `SELECT * FROM users WHERE username = ?`;
    const result = await knex.raw(query, [username]);
    const rawUserData = result.rows[0];
    return rawUserData ? new User(rawUserData) : null;
  }

  // Hashes the given password and then creates a new user
  // in the users table. Returns the newly created user, using
  // the constructor to hide the passwordHash. 
  static async create(username, password) {
    // hash the plain-text password using bcrypt before storing it in the database
    const passwordHash = await authUtils.hashPassword(password);

    const query = `INSERT INTO users (username, password_hash)
      VALUES (?, ?) RETURNING *`;
    const result = await knex.raw(query, [username, passwordHash]);
    const rawUserData = result.rows[0];
    return new User(rawUserData);
  }

  // Updates the user that matches the given id with a new username.
  // Returns the modified user, using the constructor to hide the passwordHash. 
  static async update(id, updates) {
    const { username, bio, profile_pic } = updates;
    console.log('Updating user with ID:', id, 'Username:', username, 'profile_pic:', profile_pic);
    const query = `
      UPDATE users
      SET 
      username = COALESCE (?, username),
      bio = COALESCE (?, bio),
      profile_pic = COALESCE (?, profile_pic)
      WHERE id=?
      RETURNING *
    `
    const result = await knex.raw(query, [username || null, bio || null, profile_pic || null, id])
    const rawUpdatedUser = result.rows[0];
    return rawUpdatedUser ? new User(rawUpdatedUser) : null;
  };

  static async deleteAll() {
    return knex('users').del()
  }

  static async likePicture(id, imageUrl) {
    const query = `
      UPDATE users
      SET liked_pictures = ARRAY_APPEND(COALESCE(liked_pictures, '{}'), ?)
      WHERE id = ?
      RETURNING *
    `;

    try {
      const result = await knex.raw(query, [imageUrl, id]);

      // console.log('Raw Result from DB:', result);  // Log the raw result to inspect the structure

      if (result.rows && result.rows[0]) {
        return result.rows[0];  // Return the updated user object
      } else {
        return null;
      }
    } catch (error) {
      console.error('Database error in likePicture:', error);
      throw error;  // Pass the error to the controller
    }
  }


  static async getLikedPictures(id) {
    const query = `SELECT liked_pictures FROM users WHERE id = ?`;
    const result = await knex.raw(query, [id]);
    return result.rows[0] ? result.rows[0].liked_pictures : [];
  }

  static async deleteLikedPicture(id, imageUrl) {
    console.log('Attempting to remove image URL:', imageUrl, 'for user ID:', id);

    const query = `
      UPDATE users
      SET liked_pictures = ARRAY_REMOVE(liked_pictures, ?)
      WHERE id = ?
      RETURNING *
    `

    try {
      const result = await knex.raw(query, [imageUrl, id]);
      // console.log('Database raw result:', result);  // Log the full result object

      // Check if result.rows exists or if the structure is different
      if (result.rows && result.rows[0]) {
        return new User(result.rows[0]);
      } else {
        console.warn('No rows returned or result structure is different:', result);
        return null;
      }
    } catch (error) {
      console.error('Database query failed:', error.message);
      throw error;
    }
  }

  // static async moveAllLikedPictures(id) {
  //   const query = `
  //     UPDATE users
  //     SET moved_pictures = COALESCE(moved_pictures, '{}') || liked_pictures,
  //       liked_pictures = '{}'
  //     WHERE id = ?
  //     RETURNING *;
  //   `;

  //   const result = await knex.raw(query, [id])
  //   const updateUser = result.rows[0];
  //   return updateUser ? new User(UpdatedUser) : null
  // }

  // static async getMovedPictures(id) {
  //   const query = `SELECT moved_pictures FROM users WHERE id = ?`;

  //   const result = await knex.raw(query, [id])
  //   return result.rows[0]?.moved_pictures || []
  // }

  // static async moveBackToLikedPictures(id, imageUrl) {
  //   const query = `
  //   UPDATE users
  //   SET moved_pictures = ARRAY_REMOVE(moved_pictures, ?),
  //       liked_pictures = ARRAY_APPEND(liked_pictures, ?)
  //   WHERE id = ?
  //   RETURNING *;
  // `;

  //   const result = await knex.raw(query, [imageUrl, imageUrl, id])
  //   const updateUser = result.rows[0];
  //   return updateUser ? new User(updateUser) : null
  // }
}

module.exports = User;
