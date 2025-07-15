import { PieChart, Pie, Cell, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import type { Transaction } from "../types/transaction";
import { Box, Typography } from "@mui/material";

interface AnalyticsProps {
  transactions: Transaction[];
  balanceData: { date: string; balance: number }[];
  t: {
    incomeLabel: string;
    expenseLabel: string;
    incomeExpenseChartTitle: string;
    balanceOverTimeTitle: string;
  };
}

const COLORS = ["#FF8042", "#0088FE"]; // Expense - orange, Income - blue

export default function Analytics({ transactions, balanceData, t }: AnalyticsProps) {
  const income = transactions
    .filter((tx) => tx.type === "income")
    .reduce((acc, tx) => acc + tx.amount, 0);
  const expense = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((acc, tx) => acc + tx.amount, 0);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString();
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
      <Box>
        <Typography variant="h6" align="center" gutterBottom>
          {t.incomeExpenseChartTitle}
        </Typography>
        <PieChart width={300} height={250}>
          <Pie
            data={[
              { name: t.expenseLabel, value: expense },
              { name: t.incomeLabel, value: income },
            ]}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label
            labelLine={false}
          >
            <Cell key="cell-expense" fill={COLORS[0]} />
            <Cell key="cell-income" fill={COLORS[1]} />
          </Pie>
          <Legend verticalAlign="bottom" height={36} />
          <Tooltip />
        </PieChart>
      </Box>

      <Box>
        <Typography variant="h6" align="center" gutterBottom>
          {t.balanceOverTimeTitle}
        </Typography>
        <LineChart width={500} height={250} data={balanceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            interval="preserveStartEnd"
          />
          <YAxis />
          <Tooltip labelFormatter={formatDate} />
          <Line type="monotone" dataKey="balance" stroke="#8884d8" dot />
        </LineChart>
      </Box>
    </Box>
  );
}
