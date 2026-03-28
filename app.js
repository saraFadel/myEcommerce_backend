const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const corsMiddleware =  require('./middlewares/cors.middleware')

const dbConnect =  require('./config/db.config');

const init = async() => {

    await dbConnect();
    const app = express();

    // General Middlewares
    app.use(corsMiddleware);
    app.use(express.json());
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    //Routes
    app.use('/api/v1/user', require('./routes/user.route'));
    app.use('/api/v1/auth', require('./routes/auth.route'));
    app.use('/api/v1/category', require('./routes/category.route'));
    app.use('/api/v1/product', require('./routes/product.route'));
    app.use('/api/v1/cart', require('./routes/cart.route'));
    app.use('/api/v1/order', require('./routes/order.route'));
    app.use('/api/v1/faq', require('./routes/faq.route'));
    app.use('/api/v1/testimonial', require('./routes/testimonial.route'));




    //404 Error Handling
    const AppError = require('./utilities/err.utility');
    app.use((req, res, next) => {
        next(new AppError(`Can't Find ${req.originalUrl} on this server`, 404));
    });

    //Global Error Handler - Interrupt when there is next(err) from catchAsync
    const globalErrorHandler =  require('./middlewares/errorHandler.middleware');
    app.use(globalErrorHandler);



    const PORT = process.env.PORT
    app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`); 
});
}


init();



