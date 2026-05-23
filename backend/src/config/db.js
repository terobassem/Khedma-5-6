import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://tero:12345@cluster0.jdeubos.mongodb.net/?appName=Cluster0");
    console.log(`MongoDB متصل: ${conn.connection.host}`);
  } catch (error) {
    console.error(`خطأ في الاتصال: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
