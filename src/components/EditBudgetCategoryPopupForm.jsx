import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserBudgetCategories, deleteCategory } from "../database/budgetDbMethods";
import { useDataRefresh, triggerRefresh } from "../contexts/DataRefreshContext";

const EditBudgetCategoryPopupForm = ({ selectedCategory, isVisible, onClose, onSubmit }) => {
    const { user } = useAuth();
    const { triggerRefresh } = useDataRefresh();

    const [name, setName] = useState(selectedCategory.name);
    const [amount, setAmount] = useState(selectedCategory.amount);

    if (!isVisible) return null;

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit({
            id: selectedCategory.id,
            name,
            amount
        });
        triggerRefresh();
        onClose();
    };

    const handleDelete = () => {
        deleteCategory(user, selectedCategory)
            .then(() => triggerRefresh());
        onClose();
    };

    return (
        <div className="popup">
            <div className="popup-content">
                <h3>Edit Category</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        Category Name:
                        <input
                            type="text"
                            name="categoryName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Budget Amount:
                        <input
                            type="number"
                            name="budgetAmount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                    <button type="button" className="deleteButton" onClick={handleDelete}>Delete Category</button>
                </form>
            </div>
        </div>
    );
};

export default EditBudgetCategoryPopupForm;
