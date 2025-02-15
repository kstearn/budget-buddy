import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserBudgetCategories } from "../database/budgetDbMethods";
import { useDataRefresh } from "../contexts/DataRefreshContext";

const NewIncomePopupForm = ({ isVisible, onClose, onSubmit }) => {
    const { user } = useAuth();
    const { refreshData } = useDataRefresh();

    if (!isVisible) return null;

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const category = "income";
        const amount = formData.get('amount');
        const date = formData.get('date');
        const description = formData.get('description');
        const type = 'income';
        onSubmit({ user, transaction: { category, amount, date, description, type } });
        onClose();
    };

    return (
        <div className="popup">
            <div className="popup-content">
                <h3>Add New Income</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        Amount:
                        <input type="number" name="amount" required />
                    </label>
                    <label>
                        Date:
                        <input type="date" name="date" required />
                    </label>
                    <label>
                        Description (optional):
                        <input type="text" name="description" />
                    </label>
                    <button type="submit">Add</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default NewIncomePopupForm;
