import { Schema, model } from 'mongoose';

const RepairEvent = new Schema({
  _id: Schema.Types.ObjectId,
  costs: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
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
  repairCompany: {
    type: Schema.Types.ObjectId,
    ref: 'RepairCompany',
    required: true,
  },
});

export default model('RepairEvent', RepairEvent);
