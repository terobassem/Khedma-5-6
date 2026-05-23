import mongoose from 'mongoose';

const podcastSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    thumbnail: { type: String, default: ' ' },
    videoUrl: { type: String, required: true },
    category: {
      type: String,
      enum: ['تسبيح', 'قصة كتابية', 'درس', 'ترانيم', 'عام'],
      default: 'عام',
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Podcast', podcastSchema);
