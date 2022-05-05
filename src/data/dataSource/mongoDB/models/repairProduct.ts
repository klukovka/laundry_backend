import { Schema, model } from 'mongoose';

const RepairProduct = new Schema({
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
  repairCompany: {
    type: Schema.Types.ObjectId,
    ref: 'RepairCompany',
    required: true,
  },
});

export default model('RepairProduct', RepairProduct);
