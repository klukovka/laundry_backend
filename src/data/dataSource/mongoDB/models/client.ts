import { Schema, model } from 'mongoose';

const Client = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },
  bonuses: {
    type: Number,
    default: 0,
  },
  sale: {
    type: Number,
    default: 0,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
});

export default model('Client', Client);
