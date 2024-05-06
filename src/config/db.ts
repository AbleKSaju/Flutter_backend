import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGOURL ?? "");
        console.log(`MongoDB connected`);
    } catch (error) {
        console.log(`MongoDb not connected`);
        process.exit(1);
    }
};

export default connectDB;
