import { Router } from 'express';
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
} from '../controllers/transactionController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware); // Защита всех маршрутов

router.get('/', getTransactions);
router.post('/', addTransaction);
router.delete('/:id', deleteTransaction);
router.put('/:id', updateTransaction);

export default router;
