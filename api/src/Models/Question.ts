import { Schema, model } from "mongoose";

import AnswerSchema from "./AnswerSchema";

const QuestionSchema = new Schema({
  content: String,
  author: {
    email: String,
  },
  answers: [AnswerSchema],
});

const QuestionModel = model("Question", QuestionSchema);

export default QuestionModel;
