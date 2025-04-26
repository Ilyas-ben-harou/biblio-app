const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Attempting MongoDB connection...');
        console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        // Don't exit in production, let the app keep trying to reconnect
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
    
};

module.exports = connectDB;