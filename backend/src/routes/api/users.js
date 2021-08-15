const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");
const Results = require("../../models/Results");
// const { FontAwesomeLayers } = require("@fortawesome/vue-fontawesome");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    // Check password
    bcrypt.compare(password, user.password).then(async (isMatch) => {
      if (isMatch) {
        // User matched
        // get number of attempts
        let id = user.id;
        const ResultsAttempt = await Results.findOne({ user: id });
        console.log(ResultsAttempt)
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          currentAssignedTest: user.currentAssignedTest ? user.currentAssignedTest : null,
          attempt: ResultsAttempt ? ResultsAttempt : 0,
          isAdmin: user.isAdmin
        };
        // Sign token
        jwt.sign(
          payload,
          process.env.secretOrKey,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

// get one user
router.get("/user/:id", async (req, res) => {
  try {
    const _id = req.params.id;

    const user = await User.findOne({ _id });
    if (!user) {
      return res.status(404).json({});
    } else {
      return res.status(200).json(user);
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// update one question
router.put("/user/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const { name, email, password, isAdmin } = req.body;

    let user = await User.findOne({ _id });
    const { authorization } = req.headers;
    const token = authorization
      ? authorization.split("Bearer ").length
        ? authorization.split("Bearer ")[1]
        : null
      : null;
    console.log(token);
    if (token) {
      // verify token
      const userCred = jwt.verify(token, process.env.secretOrKey);
      if (userCred) {
        const createdBy = userCred.id;
        if (!user) {
          const { errors, isValid } = validateRegisterInput(req.body);
          // Check validation
          if (!isValid) {
            return res.status(400).json(errors);
          }
          User.findOne({ email: email }).then((user) => {
            if (user) {
              return res.status(400).json({ email: "Email already exists" });
            } else {
              const newUser = new User({
                name: name,
                email: email,
                password: password,
                isAdmin: isAdmin
              });
              // Hash password before saving in database
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;
                  newUser.password = hash;
                  newUser
                    .save()
                    .then((user) => res.json(user))
                    .catch((err) => console.log(err));
                });
              });
            }
          });
        } else {
          user.name = name;
          user.email = email;
          user.password = password;
          user.isAdmin = isAdmin
          // Hash password before saving in database
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
              // if (err) throw err;
              user.password = hash;
              user
                .save()
                .then((user) => res.json(user))
                .catch((err) => console.log(err));
            });
          });
        }
      } else {
        return res.status(500).json({ error: "Verification failed!" });
      }
    } else {
      return res.status(500).json({ error: "Token not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// @route POST api/users/assign-test
// @access private
router.put("/assign-test", async (req, res) => {
  try {
    // Form validation
    const { test, userId } = req.body;
    let user_exist = await User.findOne({ _id: userId });
    // Check validation
    const { authorization } = req.headers;
    const token = authorization
      ? authorization.split("Bearer ").length
        ? authorization.split("Bearer ")[1]
        : null
      : null;
    if (token) {
      //verify with token
      const user = jwt.verify(token, process.env.secretOrKey);
      if (user) {
        if (user_exist) {
          user_exist.currentAssignedTest = test;
          await user_exist.save();
        }
        return res.status(201).json(test);
      } else {
        return res.status(500).json({ error: "Verification failed!" });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// @route POST api/users/assign-test
// @access private
router.get("/get-participants", async (req, res) => {
  try {
    const participents = await User.find({}, '_id name currentAssignedTest');
    return res.status(200).json(participents);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});


module.exports = router;
