import type { Transaction } from "../types/transaction";
import { ListItem, ListItemText, Chip } from "@mui/material";

interface Props {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: Props) {
  const color = transaction.type === "income" ? "success" : "error";

  return (
    <ListItem divider>
      <ListItemText
        primary={transaction.title}
        secondary={transaction.date}
      />
      <Chip
        label={`${transaction.amount} NOK`}
        color={color}
        variant="outlined"
      />
    </ListItem>
  );
}
