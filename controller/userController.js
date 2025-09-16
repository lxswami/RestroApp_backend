const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
// const cloudinary = require("../utils/cloudinary")
const fs = require("fs");

module.exports.Register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log(">>>", req.body);

        if (!name || !email || !password) {
            return res.json({
                status: 400,
                success: false,
                message: "All fields are required"
            });
        }

        const userExist = await userModel.findOne({ email });
        if (userExist) {
            return res.json({
                status: 400,
                success: false,
                message: "User already exists"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            name,
            email,
            password: hashPassword,
        });

        await newUser.save();

        res.json({
            status: 200,
            success: true,
            message: "User created successfully",
            data: newUser
        });

    } catch (error) {
        res.json({
            status: 400,
            success: false,
            message: error.message,
        });
    }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Email not found" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ success: false, message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id }, 
      process.env.SECRET_KEY, 
      { expiresIn: "2h" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      data: user,
      token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};


// module.exports.AllUser = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;  // default 1
//         const limit = parseInt(req.query.limit) || 10; // default 5
//         const skip = (page - 1) * limit;

//         // Count total documents
//         const totalUsers = await userModel.countDocuments();

//         // Fetch users
//         const users = await userModel.find()
//             .skip(skip)
//             .limit(limit)
//             .select("-password") // don't send password
//             .sort({ createdAt: -1 }); // latest first

//         const totalPages = Math.ceil(totalUsers / limit);

//         res.status(200).json({
//             status: 200,
//             success: true,
//             page: page,
//             totalPages: totalPages,
//             totalUsers: totalUsers,
//             nextPage: page < totalPages ? page + 1 : null,
//             prevPage: page > 1 ? page - 1 : null,
//             data: users,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             status: 500,
//             success: false,
//             message: error.message,
//         });
//     }
// }

// module.exports.UpdateUser = async (req, res) => {
//     try {
//         const { _id } = req.body;
//         const updateData = req.body;

//         // If password change ho raha ho, hash karo
//         if (updateData.password) {
//             updateData.password = await bcrypt.hash(updateData.password, 10);
//         }

//         const updatedUser = await userModel.findByIdAndUpdate(
//             _id,
//             updateData,
//             { new: true } // updated document return karo
//         ).select("-password");

//         if (!updatedUser) {
//             return res.status(404).json({
//                 status: 404,
//                 success: false,
//                 message: "User not found",
//             });
//         }

//         res.status(200).json({
//             status: 200,
//             success: true,
//             message: "User updated successfully",
//             data: updatedUser,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             status: 500,
//             success: false,
//             message: error.message,
//         });
//     }
// }

// module.exports.profileUpdate = async (req, res) => {
//     try {

//         const { _id, name } = req.body;


//         const updateData = { name }
//         // const { _id } = req.body

//         console.log(">>>>>>>>>", req.body);


//         if (req.file) {
//             const upload = await cloudinary.uploader.upload(req.file.path, {
//                 folder: "profiles",
//             });
//             updateData.image = upload.secure_url;
//             fs.unlinkSync(req.file.path);
//         }

//         const updateProfile = await userModel.findByIdAndUpdate(
//             _id,
//             updateData,
//             { new: true }
//         )

//         res.status(200).json({
//             status: 200,
//             success: true,
//             message: "Profile updated successfully",
//             data: updateProfile,
//         });

//     } catch (error) {
//         res.status(500).json({
//             status: 500,
//             success: false,
//             message: error.message

//         });
//     }
// }

// exports.deleteUser = async (req, res) => {
//     try {
//         const { _id } = req.body;

//         const deletedUser = await userModel.findByIdAndDelete(_id);

//         if (!deletedUser) {
//             return res.status(404).json({
//                 status: 404,
//                 success: false,
//                 message: "User not found",
//             });
//         }

//         res.status(200).json({
//             status: 200,
//             success: true,
//             message: "User deleted successfully",
//             data: deletedUser
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             status: 500,
//             success: false,
//             message: error.message,
//         });
//     }
// };

// module.exports.searchUser = async (req, res) => {
//     try {
//         const name = req.body.name;

//         if (!name) {
//             return res.status(400).json({
//                 status: 400,
//                 success: false,
//                 message: "Name query parameter is required"
//             });
//         }

//         const currentUserId = req.user?._id;

//         // Partial match, case-insensitive
//         const nameRegex = new RegExp(name, "i");

//         // Get matching users, excluding self
//         const users = await userModel.find({
//             name: { $regex: nameRegex },
//             _id: { $ne: currentUserId }      //auth me bhi h
//         }).select("-password");

//         console.log("👉 Matching users:", users.length);

//         const filteredUsers = [];

//         for (const u of users) {
//             const existingChatRoom = await chatModel.findOne({
//                 $or: [
//                     { users: { $all: [currentUserId, u._id] } }, // Already in chat
//                     { pendingUsers: u._id },                     // Already invited
//                     { rejectedUsers: u._id }                     // Already rejected (optional)
//                 ]
//             });

//             if (!existingChatRoom) {
//                 filteredUsers.push(u);
//             } else {
//                 console.log(`🔒 Already linked/invited/rejected with: ${u.name}`);
//             }
//         }

//         console.log("👉 Final eligible users:", filteredUsers.length);

//         if (filteredUsers.length === 0) {
//             return res.status(404).json({
//                 status: 404,
//                 success: false,
//                 message: "No user found (matching + not already invited/connected)"
//             });
//         }

//         res.status(200).json({
//             status: 200,
//             success: true,
//             totalUsers: filteredUsers.length,
//             data: filteredUsers
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             status: 500,
//             success: false,
//             message: error.message
//         });
//     }
// };

