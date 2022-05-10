import { Schema, model } from 'mongoose';

const Event = new Schema({
  _id: Schema.Types.ObjectId,
  washMachine: {
    type: Schema.Types.ObjectId,
    ref: 'WashMachine',
    required: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
  spinning: {
    type: Number,
    required: true,
  },
  mode: {
    type: Schema.Types.ObjectId,
    ref: 'Mode',
    required: true,
  },
  additionalMode: {
    type: Schema.Types.ObjectId,
    ref: 'AdditionalMode',
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
  },
  timeBegin: {
    type: Date,
  },
  timeEnd: {
    type: Date,
  },
  paidStatus: {
    type: Boolean,
    default: false,
  },
  paidBonuses: {
    type: Number,
    default: 0,
  },
  paidMoney: {
    type: Number,
    default: 0,
  },
  taken: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 5,
  },
});

export default model('Event', Event);
