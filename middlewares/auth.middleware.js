const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader?.startsWith('Bearer')){
        return res.status(401).json({ message: 'No Token Provided' });
    }
    const token = authHeader.split(' ')[1];

    try {
        const decoaded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoaded._id);

        if(!user || user.isDeleted) {
            return res.status(401).json({
                message: 'This account has been deactivated or no longer exists.'
            });
        }

        req.user = user;
        next();
    } catch(err) {
        return res.status(401).json({ message: 'Invalid or Expired Token' });
    }
}
