const User = require('../models/user');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')
const cloudinary = require('cloudinary')

exports.registerUser = async (req, res, next) => {
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
            });

            const { name, email, password, role } = req.body;
            const user = await User.create({
                name,
                email,
                password,
                avatar: {
                    public_id: result.public_id,
                    url: result.secure_url
                },
                // role,
            });

            sendToken(user, 200, res);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'UNSUCCESFUL REGISTRATION' });
        }
    }
    console.log('Email value before creating user:', email);

};


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
    console.log(User)
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url
        }
    };

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
            });
            } 
        catch (error) {
                console.log(error)
            }
    }

    req.body.avatar = avatarLinks

        const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
                new: true,
                runValidators: true,
         });

         if (!user)
         return res.status(400).json({
                success: false,
                message: 'FAILED TO UPDATE INFORMATION'
            })
        
        return res.status(200).json({
            success: true,
            user
        })
}

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


