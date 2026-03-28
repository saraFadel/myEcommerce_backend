const Testimonial = require('../models/testimonial.model');
const catchAsync = require('../utilities/catch-async.utility');

exports.getApprovedTestimonials = catchAsync(async (req, res) => {
    const testimonials = await Testimonial.find({ status: 'approved' })
        .populate('user', 'name imgURL');
    res.status(200).json({ data: testimonials });
});

exports.addTestimonial = catchAsync(async (req, res) => {
    const { content, rating } = req.body;
    const newTestimonial = await Testimonial.create({
        user: req.user._id, 
        content,
        rating
    });
    res.status(201).json({ message: 'Submitted for approval', data: newTestimonial });
});

exports.getMyTestimonial = catchAsync(async (req, res) => {
    const testimonial = await Testimonial.findOne({ user: req.user._id });
    res.status(200).json({ data: testimonial });
});

exports.deleteMyTestimonial = catchAsync(async (req, res) => {
    await Testimonial.findOneAndDelete({ user: req.user._id });
    res.status(200).json({ message: 'Testimonial deleted' });
});

exports.updateStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await Testimonial.findByIdAndUpdate(id, { status }, { returnDocument: 'after' });
    res.status(200).json({ message: `Status updated to ${status}`, data: updated });
});

exports.getAllTestimonials = catchAsync(async (req, res) => {
    const all = await Testimonial.find().populate('user', 'name');
    res.status(200).json({ data: all });
});
