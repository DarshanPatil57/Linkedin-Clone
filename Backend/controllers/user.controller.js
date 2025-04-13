import cloudinary from "../lib/cloudinary.js";
import User from "../models/User.model.js";

export const getSuggestedConnection = async (req, res) => {
  try {
    const cuurentUser = await User.findById(req.user._id).select("connections");
    // console.log("Current user connections:", cuurentUser);

    // find user who are not already connected , and also excluding our profile

    const suggestedUser = await User.find({
      _id: {
        $ne: req.user._id,
        $nin: cuurentUser.connections,
      },
    }).select("name username profilePicture headline").limit(3);

      // console.log("Suggested users:", suggestedUser);

    res.json(suggestedUser);
  } catch (error) {
    console.log("Error in getting suggested connection", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password"
    );

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }
    res.json(user);
  } catch (error) {
    console.log("Error in getting public profile", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// todo : check for code 
export const updateProfile = async (req, res) => {
  // console.log("Received update body:", req.body);

  try {
    const allowedFileds = [
      "name",
      "username",
      "email",
      "headline",
      "about",
      "location",
      "profilePicture",
      "banner",
      "skills",
      "experiences",
      "education",
    ];

    const updatedData = {};

    // loop through allowedfileds
    for (const field of allowedFileds) {
      if (req.body[field]) {
        updatedData[field] = req.body[field];
      }
    }

    // TODO: UPLOAD IMAGE TO CLOUDINARY
    if(req.body.profilePicture){
        const result = await cloudinary.uploader.upload(req.body.profilePicture)
        updatedData.profilePicture = result.secure_url
    }

    if(req.body.banner){
        const result = await cloudinary.uploader.upload(req.body.banner)
        updatedData.banner = result.secure_url
    }

    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $set: updatedData,
      },
      { new: true }
    ).select("-password")
    res.status(201).json({ user,
        message:"User Updated"
    })
  } catch (error) {
    console.log("Error in updating the profile", error);
    res.status(500).json({
        message:"Internal server error"
    })
    
  }
};
