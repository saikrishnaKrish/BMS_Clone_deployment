const router = require("express").Router();
const bcrypt = require("bcrypt");
const authMiddleware = require("../middlewares/authmiddleware");
const userModel = require("../models/userModel");

const jwt = require("jsonwebtoken");

router.post("/register",async (req, res) => {
  try {
    const userDetails = req.body;
    const checkExists = await userModel.findOne({ email: userDetails.email });

    if (checkExists) {
      return res
        .status(400)
        .json({ success: false, message: "user already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userDetails.password, salt);

    const newUser = new userModel({ ...userDetails, password: hashedPassword });

    newUser.save();

    return res.status(200).json({
      success: true,
      message: "User successfully registered",
    });
  } catch (err) {
    console.log("Internal server error", err.message);
    return res
      .status(500)
      .json({ success: true, message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
 console.log("from login",req.headers);
  
  try {
    const userDetails = await userModel.findOne({ email: req.body.email });
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }
    console.log(userDetails.password);
    console.log(req.body.password);

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      userDetails.password
    );

    if (!isValidPassword) {
      return res
        .status(400)
        .json({ success: false, message: "password is incorrect" });
    }

    const token = jwt.sign(
      { userId: userDetails._id },
      process.env.jwt_secret,
      { expiresIn: "1d" }
    );

    return res
      .status(200)
      .json({ success: true, message: "successfully logged in!", data: token });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ success: true, message: "Internal server error" });
  }
});

router.get("/", authMiddleware, (req, res) => {
  return res.status(200).send("Hello from server");
});

// Protected route
router.get("/currentUser", authMiddleware, async (req, res) => {
  try {
      const userId = req.body.userId
      const user = await userModel.findOne({_id: userId})

      if(!user) {
          return res.send({
              success: false,
              message: "User not found"
          })
      }
      return res.send({
          success: true,
          message: "User fetched successfully",
          data: user
      })
  } catch (error) {
      res.send({
          success: false,
          message: "Something went wrong",
          error: error
      })
  }
  
})


exports.router = router;
