const Order = require('../models/order.model');
const Cart = require('../models/cart.model'); 
const Product = require('../models/product.model');
const catchAsync = require('../utilities/catch-async.utility');
const mongoose = require('mongoose');




exports.createOrder = catchAsync(async (req, res, next) => {
    const { items, address } = req.body;
    const userId = req.user.id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const shippingFee = 25;
        let totalAmount = shippingFee;
        const processedItems = [];

        for (const item of items) {
            const productDoc = await Product.findById(item.productId).session(session);

            if (!productDoc) throw new Error(`Product not found: ${item.productId}`);

            if (productDoc.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${productDoc.name}`);
            }

            totalAmount += productDoc.price * item.quantity;
            processedItems.push({
                product: item.productId,
                quantity: item.quantity,
                price: productDoc.price
            });
        }

        const [newOrder] = await Order.create([{
            userId,
            items: processedItems,
            totalAmount,
            address,
            status: 'Pending'
        }], { session });

        await Cart.findOneAndDelete({ userId }, { session });

        await session.commitTransaction();
        res.status(201).json({ message: 'success', data: newOrder });
    } catch (err) {
        await session.abortTransaction();
        next(err);
    } finally {
        session.endSession();
    }
});

exports.getUserOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find({ userId: req.user.id })
        .populate('items.product', 'name price imgURL') 
        .sort('-createdAt'); 
    res.status(200).json({ message: `${orders.length} User Orders`, data: orders });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find()
        .populate('userId', 'name email') 
        .populate('items.product', 'name price imgURL')
        .sort('-createdAt');

    res.status(200).json({ message: `${orders.length} User Orders`, data: orders });
});

exports.cancelOrderByUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findOne({ _id: id, userId: req.user.id });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status !== 'Pending') {
        return res.status(400).json({ message: `Cannot cancel. Status: ${order.status}` });
    }

    order.status = 'Cancelled by User';
    await order.save();

    res.status(200).json({ message: 'Cancelled successfully', data: order });
});

exports.approveOrder = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = await Order.findById(id).session(session);
        if (!order || order.status !== 'Pending') {
            throw new Error('Order not found or already processed');
        }

        for (const item of order.items) {
            const updatedProduct = await Product.findOneAndUpdate(
                { _id: item.product, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } },
                { returnDocument: 'after', session }
            );
            if (!updatedProduct) throw new Error(`Stock ran out for: ${item.product}`);
        }

        order.status = 'Prepared'; 
        await order.save({ session });
        await session.commitTransaction();
        res.status(200).json({ message: 'Order approved and Prepared', data: order });
    } catch (err) {
        await session.abortTransaction();
        next(err);
    } finally {
        session.endSession();
    }
});

const refundOrderStock = async (items, session) => {
    const refundPromises = items.map(item => 
        Product.findByIdAndUpdate(
            item.product,
            { $inc: { stock: item.quantity } },
            { session, runValidators: true }
        )
    );
    await Promise.all(refundPromises);
};

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body; 

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = await Order.findById(id).session(session);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        const finalStatuses = ['Delivered', 'Rejected', 'Cancelled by Admin', 'Cancelled by User'];
        if (finalStatuses.includes(order.status)) {
            throw new Error(`Cannot update: Status is already ${order.status}`);
        }

        // Refund stock if moving to Rejected from a state where stock was taken
        const deductedStatuses = ['Prepared', 'Shipped'];
        if (status === 'Rejected' && deductedStatuses.includes(order.status)) {
            await refundOrderStock(order.items, session);
        }

        order.status = status;
        await order.save({ session });

        await session.commitTransaction();
        res.status(200).json({ message: `Updated to ${status}`, data: order });
    } catch (err) {
        await session.abortTransaction();
        next(err);
    } finally {
        session.endSession();
    }
});

exports.cancelOrderByAdmin = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = await Order.findById(id).session(session);
        if (!order) throw new Error('Order not found');

        const finalStatuses = ['Delivered', 'Rejected', 'Cancelled by Admin', 'Cancelled by User'];
        if (finalStatuses.includes(order.status)) {
            throw new Error(`Order is already finalized as ${order.status}`);
        }

        const deductedStatuses = ['Prepared', 'Shipped'];
        if (deductedStatuses.includes(order.status)) {
            await refundOrderStock(order.items, session);
        }

        order.status = 'Cancelled by Admin';
        await order.save({ session });

        await session.commitTransaction();
        res.status(200).json({ message: 'Order cancelled by admin', data: order });
    } catch (err) {
        await session.abortTransaction();
        next(err);
    } finally {
        session.endSession();
    }
});
