const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { 
    type: String, 
    required: true, 
    trim: true 
    },
    slug: { 
        type: String, 
        required: true, 
    },
    parentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        default: null 
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
    },
    {
     timestamps: true   
    }
);

categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ parentId: 1 });

module.exports = mongoose.model('Category', categorySchema);