const mongoose =  require('mongoose');

const dbConnect = async () => {
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database connected: ${connect.connection.host}:${connect.connection.port}`);
        
    }catch(err){
        console.log(`Database Connection Failed: ${err.message}`);
        process.exit(1);
    }
}

module.exports = dbConnect;