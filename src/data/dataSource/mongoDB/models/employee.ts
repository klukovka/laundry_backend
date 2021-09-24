import { Schema, model } from 'mongoose';

const Employee = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  laundry: {
    type: Schema.Types.ObjectId,
    ref: 'Laundry',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
});

export default model('Employee', Employee);
