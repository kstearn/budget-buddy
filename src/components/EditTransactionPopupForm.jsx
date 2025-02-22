import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserBudgetCategories } from "../database/budgetDbMethods";
import { deleteTransaction } from '../database/transactionsDbMethods';
import { useDataRefresh, triggerRefresh } from "../contexts/DataRefreshContext";

const EditTransactionPopupForm = ({ transaction, isVisible, onClose, onSubmit }) => {
    const { user } = useAuth();
    const { refreshData } = useDataRefresh();
    const { triggerRefresh } = useDataRefresh();

    const [categories, setCategories] = useState([]);

    const [amount, setAmount] = useState(transaction.amount);
    const [category, setCategory] = useState(transaction.category);
    const [date, setDate] = useState(transaction.date);
    const [description, setDescription] = useState(transaction.description);

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
        onSubmit({
            ...transaction,
            category,
            amount,
            date,
            description
        });
        triggerRefresh();
        onClose();
    };

    const handleDelete = () => {
        deleteTransaction(user, transaction)
            .then(() => triggerRefresh());
        onClose();
    };

    return (
        <div className="popup">
            <div className="popup-content">
                <h3>Edit Transaction</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        Category:
                        <select
                            name="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Amount:
                        <input
                            type="number"
                            name="amount"
                            min="0.01"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Date:
                        <input
                            type="date"
                            name="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Description (optional):
                        <input
                            type="text"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </label>
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                    <button type="button" className="deleteButton" onClick={handleDelete}>Delete Transaction</button>
                </form>
            </div>
        </div>
    );
};

export default EditTransactionPopupForm;
