import { model } from "mongoose";

import AnswerSchema from "./AnswerSchema";

const AnswerModel = model("Answer", AnswerSchema);

export default AnswerModel;
