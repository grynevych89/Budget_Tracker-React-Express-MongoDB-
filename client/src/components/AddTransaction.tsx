import { useState, useEffect } from "react";
import { Box, TextField, Button, RadioGroup, FormControlLabel, Radio, Typography } from "@mui/material";
import type { Transaction } from "../types/transaction";
import { v4 as uuidv4 } from "uuid";
import { useLanguage } from "../context/useLanguage";
import { translations } from "../context/translations";

interface AddTransactionProps {
  onAdd: (transaction: Transaction) => void;
  editingTransaction: Transaction | null;
}

export default function AddTransaction({ onAdd, editingTransaction }: AddTransactionProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");

  useEffect(() => {
    if (editingTransaction) {
      setTitle(editingTransaction.title);
      setAmount(editingTransaction.amount.toString());
      setType(editingTransaction.type);
    } else {
      setTitle("");
      setAmount("");
      setType("income");
    }
  }, [editingTransaction]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // предотвратить перезагрузку страницы

    if (!title || !amount) return;

    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    onAdd({
      id: editingTransaction ? editingTransaction.id : uuidv4(),
      title,
      amount: amountNum,
      type,
      date: new Date().toISOString(),
    });

    setTitle("");
    setAmount("");
    setType("income");
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h6" gutterBottom>
        {editingTransaction ? t.editTransaction : t.addTransaction}
      </Typography>

      <TextField
        label={t.title}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        label={t.amount}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        fullWidth
        margin="normal"
      />

      <RadioGroup
        row
        value={type}
        onChange={(e) => setType(e.target.value as "income" | "expense")}
      >
        <FormControlLabel value="income" control={<Radio />} label={t.incomeLabel} />
        <FormControlLabel value="expense" control={<Radio />} label={t.expenseLabel} />
      </RadioGroup>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        {editingTransaction ? t.save : t.addTransaction}
      </Button>
    </Box>
  );
}
