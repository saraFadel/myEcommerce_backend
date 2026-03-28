const Cart = require('../models/cart.model');
const catchAsync = require('../utilities/catch-async.utility');
const Product = require('../models/product.model');



exports.addToCart = catchAsync(async (req, res) => {
    const { userId, productDetails, quantity } = req.body;

    const product = await Product.findById(productDetails);
    if (!product) {
        return res.status(400).json({
            message: 'No Product Found'
        })
    }
    if (quantity > product.stock) {
        return res.status(400).json({
            message: `Only ${product.stock} items left in stock.`,
        });
    }
    const price = product.price;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
        cart = await Cart.create({
            userId,
            products: [{ productDetails: productDetails, quantity, price }],
            totalPrice: quantity * price
        });
    }
    else {
        const productIndex = cart.products.findIndex(p => p.productDetails.toString() === productDetails);

        if (productIndex > -1) {
            const totalNewQuantity = cart.products[productIndex].quantity + quantity;

            if (totalNewQuantity > product.stock) {
                return res.status(400).json({
                    message: `Cannot add more. You already have ${cart.products[productIndex].quantity} in cart and only ${product.stock} are available.`
                });
            }

            cart.products[productIndex].quantity = totalNewQuantity;
        } else {
            cart.products.push({ productDetails, quantity, price })
        }
        cart.totalPrice = cart.products.reduce((acc, item) => acc + (item.quantity * item.price), 0);
        await cart.save();

    }
    await cart.populate('products.productDetails');

    return res.status(201).json({
        message: 'Added to cart',
        data: cart
    })
});


exports.allCarts = catchAsync(async (req, res) => {
    const carts = await Cart.find().populate('products.productDetails');

    if (carts) {
        res.status(200).json({
            message: "All Carts",
            data: carts
        })
    }
});

exports.userCart = catchAsync(async (req, res) => {
    const userId = req.params.userId;
    const cart = await Cart.findOne({ userId }).populate('products.productDetails');

    if (!cart) {
        return res.status(200).json({
            message: 'Cart is empty',
            data: {
                items: [],
                totalPrice: 0
            }
        });
    }
    res.status(200).json({
        message: "User Cart",
        data: cart
    })
});

exports.removeItem = catchAsync(async (req, res) => {
    const { userId, productId } = req.body; 
    let cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter(p => p.productDetails.toString() !== productId);

    cart.totalPrice = cart.products.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    await cart.save();
    
    await cart.populate('products.productDetails');

    res.status(200).json({ message: "Item removed", data: cart });
});

exports.updateQuantity = catchAsync(async (req, res) => {
    const { userId, productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productIndex = cart.products.findIndex(p => p.productDetails.toString() === productId);

    if (productIndex > -1) {
        cart.products[productIndex].quantity = quantity;
        cart.totalPrice = cart.products.reduce((acc, item) => acc + (item.quantity * item.price), 0);

        await cart.save();
        await cart.populate('products.productDetails');
        
        return res.status(200).json({ message: "Quantity updated", data: cart });
    } else {
        return res.status(404).json({ message: "Product not in cart" });
    }
});


// exports.addGuestCart = catchAsync(async (req, res) => {
//     const { userId, guestProducts } = req.body;
//     let cart = await Cart.findOne({ userId });


//     const securedProducts = [];
//     for (const item of guestProducts) {
//         const product = await Product.findById(item.productId);
        
//         if (product && product.stock > 0) {
//             securedProducts.push({
//                 productId: item.productId,
//                 quantity: Math.min(item.quantity, product.stock),
//                 price: product.price 
//             });
//         }
//     }

//     if (!cart) {
//         cart = await Cart.create({ userId, products: securedProducts });
//     } else {
//         securedProducts.forEach(securedItem => {
//             const index = cart.products.findIndex(p => p.productId.toString() === securedItem.productId);
//             if (index > -1) {
//                 cart.products[index].quantity += securedItem.quantity;
//             } else {
//                 cart.products.push(securedItem);
//             }
//         });
//     }

//     cart.totalPrice = cart.products.reduce((acc, item) => acc + (item.quantity * item.price), 0);
//     await cart.save();

//     res.status(200).json({ message: "Guest cart merged successfully", data: cart });
// });


exports.mergeCart = catchAsync(async (req, res) => {
    const { userId, items } = req.body; // items is the guestCart array
    let cart = await Cart.findOne({ userId });

    if (!cart) {
        cart = await Cart.create({ userId, products: items });
    } else {
        items.forEach(guestItem => {
            const index = cart.products.findIndex(p => 
                p.productDetails.toString() === guestItem.productDetails._id);
            if (index > -1) {
                cart.products[index].quantity += guestItem.quantity;
            } else {
                cart.products.push(guestItem);
            }
        });
        await cart.save();
    }
    res.status(200).json({ message: 'success', data: cart });
});



exports.clearCart = catchAsync(async (req, res) => {
    const  userId = req.user.id;
    await Cart.findOneAndDelete({ userId });
    res.status(200).json({ message: "Cart cleared successfully" });
});
