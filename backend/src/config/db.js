import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb+srv://tero:12345@cluster0.jdeubos.mongodb.net/?appName=Cluster0";
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB متصل: ${conn.connection.host}`);
  } catch (error) {
    console.error(`خطأ في الاتصال: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
