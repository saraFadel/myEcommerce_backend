const User =  require('../models/user.model');
const {logger} = require('../utilities/logger.utility');
const catchAsync = require('../utilities/catch-async.utility');

exports.createUser =  (role) => {
    return catchAsync(async (req, res) => {
        const {name, email, password, address, createdAt} = req.body;

        const user = await User.create({name, email, password, address, createdAt, role});
        res.status(201).json({
            message: "User Created",
            data: user
        });
    });
};

exports.getUserById = catchAsync(async(req, res) => {
    const id = req.params.id;
    const user = await User.findById({_id: id});
    if(!user){
        res.status(404).json({
            message: `Can't find user by id : ${id}`
        });
    }
    res.status(200).json({
        message: `User with id: ${id}`,
        data: user
    });
});

exports.editUserById = catchAsync(async(req, res) => {
    const id = req.params.id;
    // 1. Add 'role' to the destructured variables
    const { name, email, password, address, isDeleted, role } = req.body;

    // 2. Add 'role' to the update object
    const user = await User.findByIdAndUpdate(
        { _id: id }, 
        { 
            name, 
            email, 
            password, 
            address, 
            isDeleted, 
            role // <--- Add this line
        }, 
        { returnDocument: 'after', runValidators: true }
    );

    if(!user){
        logger.warn(`Can't find user by id : ${id}`)
        return res.status(404).json({ // Added return to prevent double headers
            message: `Can't find user by id : ${id}`
        });
    }

    res.status(200).json({ // Changed 201 (Created) to 200 (OK)
        message: `User with id: ${id} is updated successfully`,
        data: user
    });
});


exports.getAllUsers = catchAsync(async(req, res) => {
    const users = await User.find();
    if(!users){
        res.status(404).json({
            message: "Can't find any user"
        })
    }
    res.status(200).json({
        message: "All Users List",
        data: users
    });
});

exports.getActiveUsers = catchAsync(async(req, res) => {
    const users = await User.find({isDeleted: false});
    if(!users){
        res.status(404).json({
            message: "Can't find any user"
        })
    }
    res.status(200).json({
        message: "Active Users List",
        data: users
    });
});

exports.deleteUserById = catchAsync(async(req, res) => {
    const id = req.params.id;
    const user = await User.findByIdAndUpdate({_id: id}, {isDeleted: true});
    if(!user){
        res.status(404).json({
            message: `Can't find user by id : ${id}`
        });
    }
    res.status(200).json({
        message: `User with id: ${id} is deleted successfully`,
        data: user
    });
});