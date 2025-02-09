import { useState, useEffect } from "react";
import NewCategoryPopupForm from "../components/NewCategoryPopupForm";
import { createNewBudgetCategory } from "../database/budgetDbMethods";
import { useAuth } from "../contexts/AuthContext";
import { getUserBudgetCategories } from "../database/budgetDbMethods";
import { useDataRefresh } from "../contexts/DataRefreshContext";

const Budget = () => {
    const { user } = useAuth();
    const { triggerRefresh } = useDataRefresh();
    const [budgetCategories, setBudgetCategories] = useState([]);

    const [isPopupVisible, setIsPopupVisible] = useState(false);

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
    }, [user]);

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
                        {budgetCategories && Object.keys(budgetCategories).map(category => (
                            <tr key={category}>
                                <td>{category}</td>
                                <td>{budgetCategories[category]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={handleButtonClick}>Add Category</button>
                <NewCategoryPopupForm 
                    isVisible={isPopupVisible}
                    onClose={handleClosePopup}
                    onSubmit={handleSubmit} 
                />
            </div>
        </div>
    );
};

export default Budget;
