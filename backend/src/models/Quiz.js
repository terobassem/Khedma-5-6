import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: { type: String, enum: ['multiple', 'truefalse'], required: true },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true },
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    grade: { type: String, default: 'الكل' },
    questions: [questionSchema],
    timeLimit: { type: Number, default: 15 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Quiz', quizSchema);
