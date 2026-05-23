import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  selectedAnswer: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
});

const resultSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    answers: [answerSchema],
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    percentage: { type: Number, required: true },
  },
  { timestamps: true }
);

resultSchema.index({ student: 1, quiz: 1 }, { unique: true });

export default mongoose.model('Result', resultSchema);
