import React, { useState, useEffect } from "react";
import "../css/Income.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "https://localhost:7127/api/Income";

export default function Income() {
  const [incomes, setIncomes] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    amount: 0,
    description: "",
    date: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  const fetchIncome = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch incomes");
      const data = await res.json();
      setIncomes(data);
    } catch (error) {
      console.error("Error fetching income:", error.message);
    }
  };

  const addIncome = async () => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          amount: parseFloat(formData.amount),
          description: formData.description,
          date: formData.date,
        }),
      });

      if (!res.ok) throw new Error("Failed to add income");
      const newIncome = await res.json();
      setIncomes([...incomes, newIncome]);
      resetForm();
    } catch (error) {
      console.error("Error adding income:", error.message);
    }
  };

  const updateIncome = async () => {
    try {
      const res = await fetch(`${API_URL}/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          amount: parseFloat(formData.amount),
          description: formData.description,
          date: formData.date,
        }),
      });

      if (!res.ok) throw new Error("Failed to update income");
      const updatedIncome = await res.json();

      setIncomes(incomes.map((inc) => (inc.id === updatedIncome.id ? updatedIncome : inc)));
      resetForm();
    } catch (error) {
      console.error("Error updating income:", error.message);
    }
  };

  const deleteIncome = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete income");

      setIncomes(incomes.filter((income) => income.id !== id));
    } catch (error) {
      console.error("Error deleting income:", error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const editIncome = (income) => {
    setFormData({ ...income });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({ id: null, name: "", amount: 0, description: "", date: "" });
    setIsEditing(false);
  };

  return (
    <div className="income-container">
      <h2 className="income-title">Income Tracker</h2>

      <div className="income-list">
        {incomes.map((income) => (
          <div key={income.id} className="income-card">
            <div className="income-card-content">
              <div className="income-card-header">
                <strong>{income.name}</strong>
                <span className="income-amount">${income.amount.toFixed(2)}</span>
              </div>
              <p className="income-description">{income.description}</p>
              <p className="income-date">{formatDate(income.date)}</p>
            </div>
            <div className="income-card-actions">
              <FaEdit className="edit-icon" onClick={() => editIncome(income)} />
              <FaTrash className="delete-icon" onClick={() => deleteIncome(income.id)} />
            </div>
          </div>
        ))}
      </div>

      <h3 className="form-title">{isEditing ? "Edit Income" : "Add Income"}</h3>
      <div className="income-form">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="input-field" />
        <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} className="input-field" />
        <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="input-field" />
        <input type="date" name="date" value={formData.date.split("T")[0]} onChange={handleChange} className="input-field" />

        <div className="form-actions">
          {isEditing ? (
            <>
              <button className="update-btn" onClick={updateIncome}>Update</button>
              <button className="cancel-btn" onClick={resetForm}>Cancel</button>
            </>
          ) : (
            <button className="add-btn" onClick={addIncome}>Add</button>
          )}
        </div>
      </div>
    </div>
  );
}
