import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, default: 'كنيسة القديسين' },
    image: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
