export interface Transaction {
  _id: string;
  title: string;
  amount: number;
  date: string;
  type: "income" | "expense";
}
