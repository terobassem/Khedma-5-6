import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Announcement from '../models/Announcement.js';
import Event from '../models/Event.js';
import Podcast from '../models/Podcast.js';
import Quiz from '../models/Quiz.js';
import BibleVerse from '../models/BibleVerse.js';
import Post from '../models/Post.js';
import Result from '../models/Result.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/church_primary');
    console.log('جاري مسح البيانات وإعادة التعبئة...');

    await Promise.all([
      User.deleteMany(), Announcement.deleteMany(), Event.deleteMany(),
      Podcast.deleteMany(), Quiz.deleteMany(), BibleVerse.deleteMany(),
      Post.deleteMany(), Result.deleteMany(),
    ]);

    const admin = await User.create({
      name: 'Admin',
      age: 10,
      grade: 'إدارة',
      phone: '01000000001',
      email: 'admin@church.com',
      password: 'admin123',
      role: 'admin',
    });

    const students = await User.create([
      { name: 'ماريان جورج', age: 10, grade: 'الصف الرابع', phone: '01011111111', email: 'marian@church.com', password: 'student123', role: 'student', totalScore: 18 },
      { name: 'بولس عادل', age: 11, grade: 'الصف الخامس', phone: '01022222222', email: 'paul@church.com', password: 'student123', role: 'student', totalScore: 15 },
      { name: 'سارة ميخائيل', age: 9, grade: 'الصف الثالث', phone: '01033333333', email: 'sara@church.com', password: 'student123', role: 'student', totalScore: 12 },
      { name: 'يوسف إبراهيم', age: 12, grade: 'الصف السادس', phone: '01044444444', email: 'youssef@church.com', password: 'student123', role: 'student', totalScore: 10 },
    ]);

    await Announcement.create([
      { title: 'ترحيب بالفصل الجديد', content: 'مرحباً بأبنائنا في خدمة المدرسة الابتدائية! نبدأ يوم الجمعة الساعة 10 صباحاً.', createdBy: admin._id },
      { title: 'مسابقة حفظ آية', content: 'سجّلوا في مسابقة حفظ آية الأسبوع القادم واربحوا جوائز روحية!', createdBy: admin._id },
    ]);

    await Event.create([
      { title: 'اجتماع أطفال الجمعة', description: 'ترانيم وقصة ونشاط جماعي', date: new Date(Date.now() + 3 * 86400000), location: 'قاعة الخدمة الرئيسية' },
      { title: 'رحلة كنيسة الربيع', description: 'رحلة ترفيهية للأطفال مع إشراف الخدام', date: new Date(Date.now() + 14 * 86400000), location: 'حديقة الأسر المقدسة' },
    ]);

    await Podcast.create([
      { title: 'قصة داود والجالوت', description: 'قصة ملهمة عن الشجاعة والإيمان', thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', category: 'قصة كتابية', createdBy: admin._id },
      { title: 'ترنيم فرح الرب', description: 'ترنيم جماعي للأطفال', thumbnail: '', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', category: 'ترانيم', createdBy: admin._id },
    ]);

    await BibleVerse.create({
      verse: 'لأَنَّ اللهَ أَحَبَّ الْعَالَمَ حَتَّى بَذَلَ ابْنَهُ الْوَحِيدَ',
      reference: 'يوحنا 3:16',
      isActive: true,
    });

    const quiz = await Quiz.create({
      title: 'اختبار قصة الخلق',
      description: 'اختبر معلوماتك عن أيام الخلق السبعة',
      grade: 'الكل',
      createdBy: admin._id,
      questions: [
        { text: 'كم يوماً استغرق الخلق؟', type: 'multiple', options: ['5', '6', '7', '8'], correctAnswer: '7' },
        { text: 'خلق الله النور في اليوم الأول', type: 'truefalse', options: ['صح', 'خطأ'], correctAnswer: 'صح' },
        { text: 'من أول إنسان خلقه الله؟', type: 'multiple', options: ['نوح', 'آدم', 'إبراهيم', 'موسى'], correctAnswer: 'آدم' },
      ],
    });

    await Result.create({
      student: students[0]._id,
      quiz: quiz._id,
      answers: [],
      score: 3,
      totalQuestions: 3,
      percentage: 100,
    });

    console.log('تمت التعبئة بنجاح!');
    console.log('Admin: admin@church.com / admin123');
    console.log('Student: marian@church.com / student123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
