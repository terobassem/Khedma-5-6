import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const email = process.env.ADMIN_EMAIL || 'admin@church.com';
const password = process.env.ADMIN_PASSWORD || 'admin123';
const name = process.env.ADMIN_NAME || 'القس مينا';
const phone = process.env.ADMIN_PHONE || '01000000001';

const createAdmin = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://tero:12345@cluster0.jdeubos.mongodb.net/?appName=Cluster0';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    let user = await User.findOne({ email }).select('+password');

    if (user) {
      user.role = 'admin';
      user.name = name;
      user.phone = phone;
      user.grade = 'إدارة';
      user.password = password;
      await user.save();
      console.log(`Updated existing user to admin: ${email}`);
    } else {
      user = await User.create({
        name,
        age: 18,
        grade: 'إدارة',
        phone,
        email,
        password,
        role: 'admin',
      });
      console.log(`Created admin user: ${email}`);
    }

    console.log(`Login with: ${email} / ${password}`);
    process.exit(0);
  } catch (err) {
    console.error('Failed to create admin:', err.message);
    process.exit(1);
  }
};

createAdmin();
