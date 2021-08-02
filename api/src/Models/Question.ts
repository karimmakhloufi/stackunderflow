import { Schema, model } from "mongoose";

const AnswerSchema = new Schema({
  content: String,
  author: {
    email: String,
  },
});

const QuestionSchema = new Schema({
  content: String,
  author: {
    email: String,
  },
  answers: [AnswerSchema],
});

const QuestionModel = model("Question", QuestionSchema);

export default QuestionModel;
