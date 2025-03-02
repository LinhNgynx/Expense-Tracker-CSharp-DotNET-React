import React, { useEffect, useState } from "react";
import "../css/Expense.css";

export default function Expense() {
  const API_URL = process.env.REACT_APP_EXPENSE_API;
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    amount: 0,
    description: "",
    date: "",
  });
  const [expenses, setExpenses] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editID, setEditID] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const fetchExpense = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Cannot find data");
      }
      const responseData = await response.json();
      setExpenses(responseData);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpense();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ id: null, name: "", amount: 0, description: "", date: "" });
    setEdit(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.amount < 0) {
      alert("Amount cannot be negative!");
      return;
    }
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to add expense");
      const newExpense = await response.json();
      setExpenses((prev) => [...prev, newExpense]);
      resetForm();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete expense");
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/${editID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Error updating data");
      await fetchExpense();
      resetForm();
      setEdit(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (id) => {
    setEditID(id);
    setEdit(true);
    const expenseEdit = expenses.find((expense) => expense.id === id);
    if (expenseEdit) setFormData(expenseEdit);
  };

  return (
    <div className="expense-container">
      <h2 className="expense-title">Expense List</h2>
      <div className="expense-list">
        {expenses.length === 0 ? (
          <p>No expenses found.</p>
        ) : (
          expenses.map((expense) => (
            <div key={expense.id} className="expense-item">
              <p className="expense-text">
                <strong>{expense.name}</strong> - ${expense.amount} - {expense.description} - {formatDate(expense.date)}
              </p>
              <div className="expense-actions">
                <button className="edit-btn" onClick={() => handleEdit(expense.id)}>✏️ Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(expense.id)}>🗑️ Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="expense-form">
        <form onSubmit={edit ? handleUpdate : handleSubmit}>
          <input className="input-field" type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} required />
          <input className="input-field" type="text" name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} required />
          <input className="input-field" type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleInputChange} required />
          <input className="input-field" type="date" name="date" value={formatDate(formData.date)} onChange={handleInputChange} required />
          <div className="form-actions">
            {edit ? (
              <>
                <button className="update-btn" type="submit">Update</button>
                <button className="cancel-btn" onClick={resetForm}>Cancel</button>
              </>
            ) : (
              <button className="add-btn" type="submit">Add Expense</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}