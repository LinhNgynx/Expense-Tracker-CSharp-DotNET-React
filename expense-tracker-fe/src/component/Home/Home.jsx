import React, { useEffect, useState } from "react";
import "../css/Home.css"
const INCOME_API = process.env.REACT_APP_INCOME_API;
const EXPENSE_API = process.env.REACT_APP_EXPENSE_API;

export default function Home() {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchIncome();
    fetchExpenses();
  }, []);

  const fetchIncome = async () => {
    try {
      const res = await fetch(INCOME_API);
      if (!res.ok) throw new Error("Failed to fetch income");
      const data = await res.json();
      setIncome(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await fetch(EXPENSE_API);
      if (!res.ok) throw new Error("Failed to fetch expenses");
      const data = await res.json();
      setExpenses(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Calculate totals
  const totalIncome = income.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div className="home-container">
      <h2 className="title">Financial Overview</h2>

      <div className="overview">
        <div className="card income">
          <h3>Total Income</h3>
          <p>${totalIncome.toFixed(2)}</p>
        </div>
        <div className="card expenses">
          <h3>Total Expenses</h3>
          <p>${totalExpenses.toFixed(2)}</p>
        </div>
        <div className={`card balance ${balance >= 0 ? "positive" : "negative"}`}>
          <h3>Balance</h3>
          <p>${balance.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
