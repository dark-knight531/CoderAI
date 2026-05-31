import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Establishes a relationship with the User collection
      required: true,
    },
    language: {
      type: String,
      required: true,
      default: 'javascript', // Fallback default language
    },
    promptCode: {
      type: String,
      required: [true, 'Submitted code cannot be empty'],
    },
    aiResponse: {
      type: String,
      required: [true, 'AI response content is required'],
    },
  },
  {
    timestamps: true, // Allows you to sort history easily by 'createdAt' (newest first)
  }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;