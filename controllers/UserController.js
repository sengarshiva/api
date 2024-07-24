const UserModel = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
var cloudinary = require("cloudinary");


cloudinary.config({
    cloud_name: 'dvcyo6wwv',
    api_key: '575927895447323',
    api_secret: 'wAEktf0XCTGOeUFFVCC9E3kRgYQ'
});

class UserController {



    static registerUser = async (req, res) => {
        // console.log(req.body)
        // console.log(req.files.image)

        const file = req.files.image
        const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'userImage'
        })
        const { name, email, password, conPassword } = req.body
        const user = await UserModel.findOne({ email: email })
        if (user) {
            res.status(404).json({ status: "failed", message: "THIS EMAIL IS ALREAD EXIT" });
        } else {
            if (name && email && password && conPassword) {
                if (password === conPassword) {
                    try {
                        const hashPassword = await bcrypt.hash
                            (password, 10)
                        const data = new UserModel({
                            name: name,
                            email: email,
                            password: hashPassword,
                            image: {
                                public_id: myCloud.public_id,
                                url: myCloud.secure_url,
                            },

                        })
                        await data.save()
                        res
                            .status(201)
                            .json({
                                status: "success", message:
                                    "User Registration Successfully"
                            });
                    } catch (error) {
                        console.log(error)
                    }
                } else {
                    res.status(404).json({
                        status: "failed",
                        message: "Password and Confirm Password does not match"
                    });
                }
            } else {
                res.status(404).json({
                    status: "failed",
                    message: "All Fields are required"
                });
            }

        }
    }

    //admin only
    static getAllUser = async (req, res) => {
        try {
            const data = await UserModel.find()
            res.status(200).json({
                data
            })
        } catch (error) {
            res.send(error)

        }
    }

    static loginUser = async (req, res) => {
        try {
            console.log(req.body)
            const { email, password } = req.body;
            const user = await UserModel.findOne({ email: email });
            if (user != null) {
                const ismatch = await bcrypt.compare(password, user.password);
                // console.log(ismatch)
                if (ismatch) {
                    const token = jwt.sign({ ID: user._id }, process.env.JWT_SECRET_KEY);
                    res.cookie("token", token);
                    res.status(201).json({
                        status: "success",
                        message: "Login Successfully 😃🍻",
                        token,
                        user,
                    });
                } else {
                    res.status(404).json({
                        status: "failed",
                        message: "'Email and Password is not valid😓",
                    });
                }
            } else {
                res
                    .status(404)
                    .json({ status: "failed", message: "YOU ARE NOT REGISTERED USER😓" });
            }
        } catch (e) {
            console.log(e);
        }
    };
   
    static logout = async (req, res) => {
        
        try {
            res.cookie("token", null, {
                expires: new Date(Date.now()),
                httpOnly: true,
            });

            res.status(200).json({
                success: true,
                message: "Logged Out",
            });
        } catch (error) {
            console.log(error)
        }
    }
   
    static updatePassword = async (req, res) => {
        // console.log(req.user)
        try {
            const { oldPassword, newPassword, confirmPassword } = req.body

            if (oldPassword && newPassword && confirmPassword) {
                const user = await UserModel.findById(req.user.id);
                // console.log(user)
                const isMatch = await bcrypt.compare(oldPassword, user.password)
                //const isPasswordMatched = await userModel.comparePassword(req.body.oldPassword);
                if (!isMatch) {
                    res.status(201).json({ "status": 400, "message": "Old password is incorrect" })
                } else {
                    if (newPassword !== confirmPassword) {
                        res.status(201)
                            .json({ "status": "failed", "message": "password does not match" })
                    } else {
                        //const salt = await bcrypt.genSalt(10)
                        const newHashPassword = await bcrypt.hash(newPassword,10 )
                        //console.log(req.user)
                        await UserModel.findByIdAndUpdate(req.user.id, { $set: { password: newHashPassword } })
                        res.status(201)
                            .json({ "status": "success", "message": "Password changed succesfully" })
                    }
                }
            } else {
                res.status(201)
                    .json({ "status": "failed", "message": "All Fields are Required" })
            }
        } catch (err) {
            res.status(201)
                .json(err)
        }
    }

    static updateProfile = async (req, res) => {
        try {
            //console.log(req.body)
            if (req.file) {
                const user = await UserModel.findById(req.user.id);
                const image_id = user.image.public_id;
                await cloudinary.uploader.destroy(image_id);

                const file = req.files.image;
                const myimage = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: "userImage",
                    width: 150,
                });
                var data = {
                    name: req.body.name,
                    email: req.body.email,
                    avatar: {
                        public_id: myimage.public_id,
                        url: myimage.secure_url,
                    },
                };
            } else {
                var data = {
                    name: req.body.name,
                    email: req.body.email,
                };
            }

            const updateuserprofile = await UserModel.findByIdAndUpdate(
                req.user.id,
                data
            );
            res.status(200).json({
                success: true,
                updateuserprofile,
            });
        } catch (error) {
            console.log(error);
        }
    };

    static getSingleUser = async (req, res) => {
        try {
            const data = await UserModel.findById(req.params.id)
            res.status(200).json({
                success: true,
                data
            })
        } catch (err) {
            console.log(err)
        }
    };

    static getUserDetail = async (req, res) => {
        try {
          //   console.log(req.user);
          const user = await UserModel.findById(req.user.id);
    
          res.status(200).json({
            success: true,
            user,
          });
        } catch (error) {
          console.log(error);
        }
      };
    
      static deleteUser = async (req, res) => {
        try {
          const data = await UserModel.findByIdAndDelete(req.params.id);
          res
            .status(200)
            .json({ status: "success", message: "User deleted successfully 😃🍻" });
        } catch (err) {
          console.log(err);
        }
      };
  

}

module.exports = UserController
