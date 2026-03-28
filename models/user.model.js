const mongoose =  require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 10,
        match: /^[a-zA-Z0-9 ]+$/        
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: (value) => {
                // Custom validator function
                return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
            },
            message: 'Invalid email format', // Custom error message
        }
    },
    password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters long'],
    //Minimum eight characters, at least one uppercase letter, one lowercase letter and one number:
    //match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'Password must contain uppercase, lowercase, and a number']
  },
  address:{
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now, // Default value
  },
   role: {
    type: String,
    enum: ['admin', 'user', 'guest'], 
    default: 'guest'
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
},{
    timestamps: true
});


const bcrypt = require('bcrypt');

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next;
    this.password = await bcrypt.hash(this.password, 12);
    next;
    });

userSchema.methods.isCorrectPassword = async function(inputPassword){
    return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);