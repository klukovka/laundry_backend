import { Schema, model } from 'mongoose';

const Laundry = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  maxAmount: {
    type: Number,
    required: true,
  },
});

export default model('Laundry', Laundry);
