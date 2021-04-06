const { User, validateUser } = require("../model/user");
const { Post, validatePost } = require("../model/post");

const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

// USER SIGN UP/ CREATE NEW  ACCOUNT
router.post("/", async (req, res) => {
  try {
    // CHECK IF REQ BODY MEETS REQUIREMENT
    const { error } = validateUser(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    // CHECK IF USER ALREADY EXISTS
    let user = await User.findOne({ username: req.body.username });
    if (user) return res.status(400).send(`User already exists`);

    // GENERATE SALT FOR PASSWORD HASH
    const salt = await bcrypt.genSalt(10);

    user = new User({
      username: req.body.username,
      isOnline: true,
      password: await bcrypt.hash(req.body.password, salt),
    });

    await user.save();

    const token = user.generateAuthToken();

    return res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send({ _id: user._id, username: user.username });
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error}`);
  }
});

// MAKE A NEW POST
router.post("/:user/createpost", async (req, res) => {
  try {
    // CHECK IF POST MEETS REQUIIREMENT
    const { error } = validatePost(req.body);

    if (error) return res.status(400).send(Error.details[0].message);

    // CHECK FOR CURRENT USER
    const user = await User.findOne({ username: req.params.user });

    // CREATE NEW POST SUB DOC
    const post = new Post({
      content: req.body.content,
    });

    // PUSH POST INTO USER OBJECT
    user.posts.push(post);
    user.save();

    return res.send(post);
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error}`);
  }
});

// LIKE POST
router.post("/:user/:postId/like", async (req, res) => {
  try {
    // CHECK FOR CURRENT USER
    const user = await User.findOne({ username: req.params.username });

    // SEARCH FOR THE POST WITHIN POSTS SUBDOC
    const post = user.posts.id(req.params.postId);

    // INCREASE LIKES
    post.likes++;

    user.save();

    return res.send(post);
  } catch (error) {
    res.status(500).send(`Internal Server Error: ${error}`);
  }
});

// SEND FRIEND REQUEST
router.post("/:user/send-request/:friendsUserName", async (req, res) => {
  try {
    // SELECT USERNAME, ONLINE STATUS & POSTS FROM CURRENT USER DOC
    const user = await User.findOne({ username: req.params.user }).select({
      username: 1,
      isOnline: 1,
      posts: 1,
    });

    // SEARCH FOR POTENTIAL FRIEND IN DB
    const potentialFriend = await User.findOne({
      username: req.params.friendsUserName,
    });

    // CHECK IF REQUEST HAS BEEN PREVIOUSLY SENT TO AVOID DUPLICIATE REQUEST
    const wasRequestPreviouslySent = potentialFriend.pendingRequest.filter(
      (request) => {
        if (request.username === user.username) return true;
      }
    );

    if (wasRequestPreviouslySent.length > 0)
      return res.status(404).send(`Request has been previously sent`);

    // STORE CURRENT USERS INFO IN  FRIENDS PENDING REQUEST
    potentialFriend.pendingRequest.unshift(user);
    potentialFriend.save();

    return res.send(potentialFriend.pendingRequest);
    // return res.send(wasRequestPreviouslySent);
  } catch (error) {
    return res.status(500).send(`Internal Server Error: ${error}`);
  }
});

module.exports = router;
