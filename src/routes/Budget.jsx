import { useState } from "react";
import NewCategoryPopupForm from "../components/NewCategoryPopupForm";
import { createNewBudgetCategory } from "../database/budgetDbMethods";
import { useAuth } from "../auth/AuthContext";

const Budget = () => {
    const { user } = useAuth();

    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const handleButtonClick = () => {
        setIsPopupVisible(true);
    }

    const handleClosePopup = () => {
        setIsPopupVisible(false);
    }

    const handleSubmit = (data) => {
        createNewBudgetCategory(data.user, data.categoryName, data.budgetAmount);
        handleClosePopup();
    }

    return (
        <div className="budget">
            <h2>Budget</h2>
            <p>Welcome to the budget</p>
            <div className="budgetTableContainer">
                <table>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Budget</th>
                            <th>Spent</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Food</td>
                            <td>$300</td>
                            <td>$250</td>
                        </tr>
                        <tr>
                            <td>Transportation</td>
                            <td>$100</td>
                            <td>$50</td>
                        </tr>
                        <tr>
                            <td>Entertainment</td>
                            <td>$200</td>
                            <td>$150</td>
                        </tr>
                        <tr>
                            <td>Health</td>
                            <td>$150</td>
                            <td>$100</td>
                        </tr>
                        <tr>
                            <td>Other</td>
                            <td>$200</td>
                            <td>$100</td>
                        </tr>
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
