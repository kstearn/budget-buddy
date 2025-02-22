import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserBudgetCategories } from "../database/budgetDbMethods";
import { useDataRefresh } from "../contexts/DataRefreshContext";

const NewExpensePopupForm = ({ isVisible, onClose, onSubmit }) => {
    const { user } = useAuth();
    const { refreshData } = useDataRefresh();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (user) {
            getUserBudgetCategories(user)
            .then(data => {
                const categoryNames = Object.values(data).map(category => category.categoryName);
                setCategories(categoryNames);
            })
            .catch(console.error);
        }
    }, [user, refreshData]);

    if (!isVisible) return null;

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const category = formData.get('category');
        const amount = formData.get('amount');
        const date = formData.get('date');
        const description = formData.get('description');
        const type = 'expense';
        onSubmit({ user, transaction: { category, amount, date, description, type } });
        onClose();
    };

    return (
        <div className="popup">
            <div className="popup-content">
                <h3>Add New Expense</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        Category:
                        <select name="category" required>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Amount:
                        <input type="number" name="amount" min="0.01" required />
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

export default NewExpensePopupForm;
