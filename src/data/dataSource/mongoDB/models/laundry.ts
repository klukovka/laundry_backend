import { Schema, model } from 'mongoose';

const Laundry = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  house: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

export default model('Laundry', Laundry);
