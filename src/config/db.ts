import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://localhost:27017/kicks');
        console.log(`MongoDB connected`);
    } catch (error) {
        console.log(`MongoDb not connected`);
        process.exit(1);
    }
};

export default connectDB;
