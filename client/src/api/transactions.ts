import type { Transaction } from "../types/transaction";

export async function getTransactions(token: string): Promise<Transaction[]> {
  const res = await fetch('/transactions', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
}

export async function addTransaction(
  data: Omit<Transaction, 'id' | 'date'>,
  token: string
) {
  const res = await fetch('/transactions', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create transaction');
  return res.json();
}

export async function deleteTransaction(id: string, token: string) {
  const res = await fetch(`/transactions/${id}`, { 
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to delete transaction');
}
