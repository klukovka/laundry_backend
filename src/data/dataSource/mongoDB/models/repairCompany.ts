import { Schema, model } from 'mongoose';

const RepairCompany = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
});

export default model('RepairCompany', RepairCompany);
