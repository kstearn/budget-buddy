import { useState, useEffect } from "react";
import NewCategoryPopupForm from "../components/NewCategoryPopupForm";
import { createNewBudgetCategory } from "../database/budgetDbMethods";
import { useAuth } from "../contexts/AuthContext";
import { getUserBudgetCategories, updateCategory } from "../database/budgetDbMethods";
import { useDataRefresh } from "../contexts/DataRefreshContext";
import EditBudgetCategoryPopupForm from "../components/EditBudgetCategoryPopupForm";

const Budget = () => {
    const { user } = useAuth();
    const { refreshData } = useDataRefresh();
    const { triggerRefresh } = useDataRefresh();
    const [budgetCategories, setBudgetCategories] = useState([]);

    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleButtonClick = () => {
        setIsPopupVisible(true);
    }

    const handleClosePopup = () => {
        setIsPopupVisible(false);
    }

    const handleSubmit = async (data) => {
        await createNewBudgetCategory(data.user, data.categoryName, data.budgetAmount);
        triggerRefresh(); 
        handleClosePopup();
        // Re-fetch budget categories after adding a new category
        const updatedCategories = await getUserBudgetCategories(data.user);
        setBudgetCategories(updatedCategories);
    }

    useEffect(() => {
        if (!user) return;
        getUserBudgetCategories(user)
            .then(data => setBudgetCategories(data));
    }, [user, refreshData]);

    const handleRowClick = (category) => {
        setSelectedCategory(category);
        setIsEditPopupVisible(true);
    };
    
    const handleCloseEditPopup = () => {
        setIsEditPopupVisible(false);
        setSelectedCategory(null);
    };
    
    const handleEditSubmit = (updatedCategory) => {
        updateCategory(user, updatedCategory);
        handleCloseEditPopup();
    };

    return (
        <div className="budget">
            <h2>Budget</h2>
            <div className="budgetTableContainer">
                <table>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Budget</th>
                        </tr>
                    </thead>
                    <tbody>
                        {budgetCategories && Object.keys(budgetCategories).map(id => {
                            const categoryObject = {
                                id: id,
                                name: budgetCategories[id].categoryName,
                                amount: budgetCategories[id].budgetAmount
                            };
                            return (
                                <tr key={id} onClick={() => handleRowClick(categoryObject)}>
                                    <td>{budgetCategories[id].categoryName}</td>
                                    <td>{budgetCategories[id].budgetAmount}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <button onClick={handleButtonClick}>Add Category</button>
                <NewCategoryPopupForm 
                    isVisible={isPopupVisible}
                    onClose={handleClosePopup}
                    onSubmit={handleSubmit} 
                />
            </div>
            {isEditPopupVisible && selectedCategory && (
                <EditBudgetCategoryPopupForm
                    selectedCategory={selectedCategory}
                    isVisible={isEditPopupVisible}
                    onClose={handleCloseEditPopup}
                    onSubmit={handleEditSubmit}
                />
            )}
        </div>
    );
};

export default Budget;
