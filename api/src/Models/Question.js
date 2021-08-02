import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  content: String,
  author: {
    email: String,
  },
});

const QuestionModel = mongoose.model("Question", QuestionSchema);

export default QuestionModel;
