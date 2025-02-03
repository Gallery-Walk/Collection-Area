const User = require('../models/User')

exports.loginUser = async (req, res) => {
  const { username, password } = req.body

  const user = await User.findByUsername(username);
  if (!user) return res.sendStatus(404)

  const isValidPassword = await user.isValidPassword(password)
  if (!isValidPassword) return res.sendStatus(401);

  req.session.userId = user.id
  res.send(user)
}

exports.logoutUser = (req, res) => {
  req.session = null
  res.sendStatus(204);
}

exports.showMe = async (req, res) => {
  if (!req.session.userId) return res.sendStatus(401);

  const user = await User.find(req.session.userId);
  res.send(user)
}