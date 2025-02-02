import React from 'react';
import { useAuth } from '../auth/AuthContext';

const NewExpensePopupForm = ({ isVisible, onClose, onSubmit }) => {
    const { user } = useAuth();
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
                        <input type="text" name="category" required />
                    </label>
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

export default NewExpensePopupForm;
