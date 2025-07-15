import { List, ListItem, ListItemText, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import type { Transaction } from "../types/transaction";

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

export default function TransactionList({ transactions, onDelete, onEdit }: TransactionListProps) {
  if (transactions.length === 0) {
    return <p>No transactions yet.</p>;
  }

  return (
    <List>
      {transactions.map((tx) => (
        <ListItem
          key={tx._id}
          secondaryAction={
            <>
              <IconButton edge="end" aria-label="edit" onClick={() => onEdit(tx)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => onDelete(tx._id)}>
                <DeleteIcon />
              </IconButton>
            </>
          }
        >
          <ListItemText
            primary={`${tx.title} — ${tx.amount} — ${tx.type}`}
            secondary={new Date(tx.date).toLocaleDateString()}
          />
        </ListItem>
      ))}
    </List>
  );
}
