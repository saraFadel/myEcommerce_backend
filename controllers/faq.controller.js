const FAQ = require('../models/faq.model');
const catchAsync = require('../utilities/catch-async.utility');

exports.getAllFAQs = catchAsync(async (req, res, next) => {
  const faqs = await FAQ.find();
  
  res.status(200).json({ 
    message: 'FAQs retrieved successfully', 
    data: faqs 
  });
});

exports.createFAQ = catchAsync(async (req, res, next) => {
  const newFaq = await FAQ.create(req.body);
  
  res.status(201).json({ 
    message: 'FAQ created successfully', 
    data: newFaq 
  });
});


exports.updateFAQ = catchAsync(async (req, res, next) => {
  const updatedFaq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { 
    returnDocument: 'after',
    runValidators: true 
  });

  if (!updatedFaq) {
    return res.status(404).json({ message: 'No FAQ found with that ID' });
  }

  res.status(200).json({ 
    message: 'FAQ updated successfully', 
    data: updatedFaq 
  });
});


exports.deleteFAQ = catchAsync(async (req, res, next) => {
  const faq = await FAQ.findByIdAndDelete(req.params.id);

  if (!faq) {
    return res.status(404).json({ message: 'No FAQ found with that ID' });
  }

   res.status(200).json({ 
    message: 'FAQ deleted successfully', 
    data: null 
  });
});
