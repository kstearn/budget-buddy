import React from 'react';

const NewCategoryPopupForm = ({ isVisible, onClose, onSubmit }) => {
    if (!isVisible) return null;

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const categoryName = formData.get('categoryName');
        const budgetAmount = formData.get('budgetAmount');
        onSubmit({ categoryName, budgetAmount });
        onClose();
    };

    return (
        <div className="popup">
            <div className="popup-content">
                <h3>Add New Category</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        Category Name:
                        <input type="text" name="categoryName" required />
                    </label>
                    <label>
                        Budget Amount:
                        <input type="number" name="budgetAmount" required />
                    </label>
                    <button type="submit">Add</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default NewCategoryPopupForm;
