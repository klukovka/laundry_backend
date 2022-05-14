import { Schema, model } from 'mongoose';

const RepairEvent = new Schema({
  _id: Schema.Types.ObjectId,
  costs: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  washMachine: {
    type: Schema.Types.ObjectId,
    ref: 'WashMachine',
    required: true,
  },
  repairProduct: {
    type: Schema.Types.ObjectId,
    ref: 'RepairProduct',
    required: true,
  },
    done: {
    type: Boolean,
    default: false,
  },
});

export default model('RepairEvent', RepairEvent);
