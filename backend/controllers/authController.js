const User = require('../models/user');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')
const cloudinary = require('cloudinary')


const axios = require('axios'); // Add this line at the top of your file

exports.registerUser = async (req, res, next) => {

    let avatar = [];
    if (typeof req.body.avatar === 'string') {
        avatar.push(req.body.avatar);
    } else {
        avatar = req.body.avatar;
    }

    let avatarLinks = [];

    if (avatar && avatar.length) {
        
     
      
    for (let i = 0; i < avatar.length; i++) {
        let avatarDataUri = avatar[i];

        try {
            const result = await cloudinary.v2.uploader.upload(`${avatarDataUri}`, {
                folder: 'user',
                width: 150,
                crop: "scale",
            });

            avatarLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
            
        } catch (error) {
			console.log(error)
		}

    }
}
    req.body.avatar = avatarLinks;

    const user = await User.create(req.body);
    if (!user)
        return res.status(400).json({
            success: false,
            message: 'UNSUCCESFUL REGISTRATION'
        })
    res.status(201).json({
        success: true,
        user
    })

    // sendToken(user, 200, res);
}

exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    // Checks if email and password is entered by user
    if (!email || !password) {
        return res.status(400).json({ error: 'PLEASE PROVIDE YOUR EMAIL AND PASSWORD TO PROCEED.' })
    }
    // Finding user in database
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return res.status(401).json({ message: 'INVALID EMAIL OR PASSWORD.' })
    }
    // Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return res.status(401).json({ message: 'ENSURE BOTH YOUR EMAIL AND PASSWORD ARE ENTERED CORRECTLY.' })
    }
   
    sendToken(user, 200, res)
}

exports.logout = async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'LOGOUT SUCCESSFUL'
    })
}

exports.forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).json({ error: 'NO USER FOUND WITH THE PROVIDED EMAIL.' })
        // return next(new ErrorHandler('User not found with this email', 404));
    }
    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    // Create reset password url
    const resetUrl = `${req.protocol}://localhost:3000/password/reset/${resetToken}`;
    const message = `PASSWORD RESET TOKEN:\n\n${resetUrl}\n\nIF YOU DIDN'T REQUEST THIS, PLEASE DISREGARD THIS EMAIL.`
    try {
        await sendEmail({
            email: user.email,
            subject: 'PHOTOCARDSHOP PASSWORD RECOVERY',
            message
        })

        res.status(200).json({
            success: true,
            message: `EMAIL HAS BEEN DISPATCHED TO: ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return res.status(500).json({ error: error.message })
        // return next(new ErrorHandler(error.message, 500))
    }
}

exports.resetPassword = async (req, res, next) => {
    // Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return res.status(400).json({ message: 'IT LOOKS LIKE THE PASSWORD RESET TOKEN IS NO LONGER VALID OR HAS EXPIRED.' })
        // return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json({ message: 'PASSWORD ENTERED DOES NOT MATCH' })
        // return next(new ErrorHandler('Password does not match', 400))
    }

    // Setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);
}

exports.getUserProfile = async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })

    
}

exports.updatePassword = async (req, res, next) => {
    const user = await User.findById(req.user.id).select('password');
    // Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if (!isMatched) {
        return res.status(400).json({ message: 'THE PROVIDED OLD PASSWORD IS INCORRECT.' })
    }
    user.password = req.body.password;
    await user.save();
    sendToken(user, 200, res)

}

exports.updateProfile = async (req, res, next) => {
        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'NO USER FOUND'
            });
        }

        let avatar = [];
        if (typeof req.body.avatar === 'string') {
            avatar.push(req.body.avatar);
        } else {
            avatar = req.body.avatar;
        }
    
        let avatarLinks = [];
    
        for (let i = 0; i < avatar.length; i++) {
            let avatarDataUri = avatar[i];
    
            try {
                const result = await cloudinary.v2.uploader.upload(`${avatarDataUri}`, {
                    folder: 'user',
                    width: 150,
                    crop: "scale",
                });
    
                avatarLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url
                })
                
            } catch (error) {
                console.log(error)
            }
    
        }
        
        req.body.avatar = avatarLinks;

        user = await User.findByIdAndUpdate(req.user.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'FAILED TO UPDATE PHOTO'
            })

            return res.status(200).json({
                success: true,
                photo
            })

}   
};


exports.allUsers = async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    })
}

exports.getUserDetails = async (req, res, next) => {
    const user = await User.findById(req.params.id);
    console.log(User)

    if (!user) {
        return res.status(400).json({ message: `THE USER WITH THE SPECIFIED ID WAS NOT FOUND: ${req.params.id}` })
        // return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })
}

exports.deleteUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(401).json({ message: `THE USER WITH THE SPECIFIED ID WAS NOT FOUND: ${req.params.id}` })
        // return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }

    // Remove avatar from cloudinary
    const image_id = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(image_id);
    await User.findByIdAndRemove(req.params.id);
    return res.status(200).json({
        success: true,
    })
}

exports.updateUser = async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        // useFindAndModify: false
    })

    return res.status(200).json({
        success: true
    })
};



//
 
// Facebook registration
exports.registerFacebookUser = async (req, res, next) => {
    const { accessToken, userID } = req.body;
  
    try {
      // Get user profile information from Facebook
      const response = await axios.get(`https://graph.facebook.com/v12.0/${userID}?fields=id,name,email,picture&access_token=${accessToken}`);
      const { id, name, email, picture } = response.data;
  
      // Check if the user with the same email already exists in the database
      let user = await User.findOne({ email });
  
      // If the user doesn't exist, create a new user
      if (!user) {
        user = await User.create({
          name,
          email,
          password: `${id}${process.env.JWT_SECRET}`,
          avatar: [{ public_id: id, url: picture.data.url }],
        });
      }
  
      // Send JWT token to the client
      sendToken(user, 200, res);
    } catch (error) {
      console.error('Error in registerFacebookUser:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  // Google registration
  exports.registerGoogleUser = async (req, res, next) => {
    const { tokenId } = req.body;
  
    try {
      // Get user profile information from Google
      const response = await axios.post('https://www.googleapis.com/oauth2/v3/tokeninfo', { id_token: tokenId });
      const { sub, name, email, picture } = response.data;
  
      // Check if the user with the same email already exists in the database
      let user = await User.findOne({ email });
  
      // If the user doesn't exist, create a new user
      if (!user) {
        user = await User.create({
          name,
          email,
          password: `${sub}${process.env.JWT_SECRET}`,
          avatar: [{ public_id: sub, url: picture }],
        });
      }
  
      // Send JWT token to the client
      sendToken(user, 200, res);
    } catch (error) {
      console.error('Error in registerGoogleUser:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
