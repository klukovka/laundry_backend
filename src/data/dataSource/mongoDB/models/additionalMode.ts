import { Schema, model } from 'mongoose';

const AdditionalMode = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  costs: {
    type: Number,
    required: true,
  },
});

export default model('AdditionalMode', AdditionalMode);
