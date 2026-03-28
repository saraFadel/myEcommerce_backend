const Category = require('../models/category.model');
const catchAsync = require('../utilities/catch-async.utility');


exports.createCategory = catchAsync(async(req, res) => {
    const {name, slug, parentId, ancestors} = req.body;
    const newCategory = await Category.create({name, slug, parentId, ancestors});

    if(newCategory){
        res.status(201).json({
            message: "Category Created",
            data: newCategory
        });
    }else {
    return next(new Error('Category could not be created'));
}
});

exports.getSubCategories
 = catchAsync(async(req, res) => {
    const parentId = req.query.parentId;
    let allCategories;
    if(parentId){
       allCategories  = await Category.find({parentId: parentId}).populate('parentId', 'name');
    }else{
        allCategories = await Category.find({parentId: {$ne: null}}).populate('parentId', 'name');

    }
    
    res.status(200).json({
        message: "All Categories",
        data: allCategories
    });
});


exports.getMainCategories = catchAsync(async(req, res) => {
    const allCategories = await Category.find({parentId: null});
    if(allCategories){
        res.status(200).json({
            message: "All Categories",
            data: allCategories
        });
    }
});

exports.deleteCategorybyId = catchAsync(async(req, res) => {
    const id = req.params.id;
    const deletedCategory = await Category.findByIdAndUpdate(id, {isDeleted: true}, {returnDocument: 'after'});
    if(deletedCategory){
        res.status(200).json({
            message: "Category Deleted Successfully",
            data: deletedCategory
        });
    }
});


exports.editCategoryById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { name, slug, parentId } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { name, slug, parentId },
        { new: true, runValidators: true }
    );

    if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
        message: "Category updated successfully",
        data: updatedCategory
    });
});

exports.deleteCategorybyId = catchAsync(async (req, res) => {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndUpdate(
        id, 
        { isDeleted: true }, 
        { new: true }
    );

    if (!deletedCategory) {
        return res.status(404).json({ message: "Category not found" });
    }


    await Category.updateMany({ parentId: id }, { isDeleted: true });

    res.status(200).json({
        message: "Category and its subcategories deleted successfully",
        data: deletedCategory
    });
});

exports.getAllCategories = catchAsync(async (req, res) => {
    const allCategories = await Category.find({ isDeleted: { $ne: true } })
    .populate('parentId', 'name'); 
    res.status(200).json({
        message: "All Categories",
        data: allCategories
    });
});
