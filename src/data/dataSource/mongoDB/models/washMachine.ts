import { Schema, model } from 'mongoose';

const WashMachine = new Schema({
  _id: Schema.Types.ObjectId,
  model: {
    type: String,
    required: true,
  },
  manufacturer: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  powerUsage: {
    type: Number,
    required: true,
  },
  spinningSpeed: {
    type: Number,
    required: true,
  },
  laundry: {
    type: Schema.Types.ObjectId,
    ref: 'Laundry',
    required: true,
  },
});

export default model('WashMachine', WashMachine);
