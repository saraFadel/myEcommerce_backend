const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const signInToken = (user) => {
    const {_id, name, role} = user;
    return jwt.sign(
        {_id, name, role},
        process.env.SECRET_KEY,
        {expiresIn: process.env.JWT_EXPIRES_IN});
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, isDeleted: false });

        if (!user || !(await user.isCorrectPassword(password))) {
            return res.status(401).json({
                message: "Wrong email or password or account has been deleted"
            });
        }

        const token = signInToken(user);
        
        return res.status(200).json({
            message: "User loggedIn",
            data: token
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};


