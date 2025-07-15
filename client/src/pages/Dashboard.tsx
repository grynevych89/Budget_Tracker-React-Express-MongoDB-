import { useState, useEffect, useMemo, useContext } from 'react';
import type { Transaction } from '../types/transaction';
import AddTransaction from '../components/AddTransaction';
import TransactionList from '../components/TransactionList';
import Analytics from '../components/Analytics';
import { useLanguage } from '../context/useLanguage';
import { translations } from '../context/translations';
import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { language } = useLanguage();
  const t = translations[language];
  const { token } = useContext(AuthContext);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const [filter, setFilter] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Загрузка транзакций при монтировании и изменении токена
  useEffect(() => {
    if (!token) return;

    axios
      .get<Transaction[]>('/transactions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => setTransactions(res.data))
      .catch(err => console.error('Failed to load transactions:', err));
  }, [token]);

const handleAddTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
  if (!token) return;

  if (editingTransaction) {
    axios
      .put<Transaction>(`/transactions/${editingTransaction._id}`, transaction, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        setTransactions(prev =>
          prev.map(tx => (tx._id === editingTransaction._id ? res.data : tx))
        );
        setEditingTransaction(null);
      })
      .catch(err => console.error('Failed to update transaction:', err));
  } else {
    axios
      .post<Transaction>('/transactions', transaction, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => setTransactions(prev => [...prev, res.data]))
      .catch(err => console.error('Failed to add transaction:', err));
  }
};


  const handleDeleteTransaction = (id: string) => {
    if (!token) return;

    const confirmed = window.confirm(t.deleteConfirmationText || 'Are you sure to delete?');
    if (!confirmed) return;

    axios
      .delete(`/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setTransactions(prev => prev.filter(tx => tx._id !== id));
        if (editingTransaction?._id === id) setEditingTransaction(null);
      })
      .catch(err => console.error('Failed to delete transaction:', err));
  };

  const filteredTransactions = useMemo(() => {
    if (filter === 'all') return transactions;
    return transactions.filter(tx => tx.type === filter);
  }, [transactions, filter]);

  const sortedTransactions = useMemo(() => {
    const sorted = [...filteredTransactions];
    sorted.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'date') {
        cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === 'amount') {
        cmp = a.amount - b.amount;
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [filteredTransactions, sortField, sortOrder]);

  const income = transactions
    .filter(tx => tx.type === 'income')
    .reduce((acc, tx) => acc + tx.amount, 0);
  const expense = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((acc, tx) => acc + tx.amount, 0);
  const balance = income - expense;

  const balanceData = useMemo(() => {
    const dataMap = new Map<string, number>();
    let runningBalance = 0;

    const sortedByDate = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    sortedByDate.forEach(tx => {
      const dateISO = new Date(tx.date).toISOString().split('T')[0];
      runningBalance += tx.type === 'income' ? tx.amount : -tx.amount;
      dataMap.set(dateISO, runningBalance);
    });

    return Array.from(dataMap.entries()).map(([date, balance]) => ({
      date,
      balance,
    }));
  }, [transactions]);

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {t.balance}
          </Typography>
          <Typography>
            {t.incomeLabel}: <b>{income}</b>
          </Typography>
          <Typography>
            {t.expenseLabel}: <b>{expense}</b>
          </Typography>
          <Typography sx={{ mt: 1, fontWeight: 'bold', color: 'primary.main' }}>
            {t.balance}: {balance}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: { xs: 2, sm: 0 } }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>{t.filter}</InputLabel>
            <Select value={filter} onChange={e => setFilter(e.target.value)}>
              <MenuItem value="all">{t.all}</MenuItem>
              <MenuItem value="income">{t.incomeLabel}</MenuItem>
              <MenuItem value="expense">{t.expenseLabel}</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 140 }}>
            <InputLabel>{t.sortBy}</InputLabel>
            <Select value={sortField} onChange={e => setSortField(e.target.value)}>
              <MenuItem value="date">{t.date}</MenuItem>
              <MenuItem value="amount">{t.amount}</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 140 }}>
            <InputLabel>{t.order}</InputLabel>
            <Select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}
            >
              <MenuItem value="asc">{t.ascending}</MenuItem>
              <MenuItem value="desc">{t.descending}</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '0 1 40%', minWidth: 280 }}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <AddTransaction onAdd={handleAddTransaction} editingTransaction={editingTransaction} />
          </Paper>
        </Box>

        <Box sx={{ flex: '1 1 50%', minWidth: 300 }}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3, maxHeight: 500, overflowY: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              {t.noTransactions }
            </Typography>
            <TransactionList
              transactions={sortedTransactions}
              onEdit={setEditingTransaction}
              onDelete={handleDeleteTransaction}
            />
          </Paper>
        </Box>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Analytics transactions={transactions} balanceData={balanceData} t={t} />
      </Paper>
    </Box>
  );
}
