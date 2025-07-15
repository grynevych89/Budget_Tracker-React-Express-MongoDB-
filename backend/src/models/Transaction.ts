import mongoose, { Document } from 'mongoose';

export interface ITransaction extends Document {
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: Date;
  userId: mongoose.Types.ObjectId;
}

const transactionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
