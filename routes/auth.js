const Joi = require("joi");
const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../model/user");
const config = require("config");
const jwt = require("jsonwebtoken");
const router = express.Router();

// USER SIGN IN
router.post("/", async (req, res) => {
  try {
    const { error } = validateSignIn(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ username: req.body.username });

    if (!user) return res.status(400).send(`Invalid username or password`);

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword)
      return res.status(400).send(`Invalid username or password`);

    const token = jwt.sign(
      { _id: user._id, username: user.username },
      config.get("jwtSecret")
    );

    return res.send(token);
  } catch (error) {
    return res.status(500).send(`Internal Server Error: ${error}`);
  }
});

function validateSignIn(req) {
  const schema = Joi.object({
    username: Joi.string().min(2).max(10).required(),
    password: Joi.string().min(8).max(15).required(),
  });
  return schema.validate(req);
}

module.exports = router;
