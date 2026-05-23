import mongoose from 'mongoose';

const bibleVerseSchema = new mongoose.Schema(
  {
    verse: { type: String, required: true },
    reference: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('BibleVerse', bibleVerseSchema);
