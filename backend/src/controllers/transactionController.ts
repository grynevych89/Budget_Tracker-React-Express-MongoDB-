import { Response } from 'express';
import { Transaction } from '../models/Transaction';
import { AuthRequest } from '../middleware/authMiddleware';

// Получить все транзакции текущего пользователя
export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

// Добавить транзакцию текущему пользователю
export const addTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { title, amount, type } = req.body;

    if (!title || !amount || !type) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const transaction = new Transaction({
      title,
      amount,
      type,
      userId: req.userId,
    });

    const saved = await transaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add transaction' });
  }
};

// Удалить транзакцию текущего пользователя
export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Transaction.findOneAndDelete({ _id: id, userId: req.userId });

    if (!deleted) return res.status(404).json({ error: 'Transaction not found' });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};

// Обновить транзакцию текущего пользователя
export const updateTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, amount, type } = req.body;

    const updated = await Transaction.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { title, amount, type },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update transaction' });
  }
};
