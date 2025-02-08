import { useState } from "react";
import { Link } from "react-router";
import NewIncomePopupForm from "./NewIncomePopupForm";
import NewExpensePopupForm from "./NewExpensePopupForm";
import { addNewTransaction } from "../database/transactionsDbMethods";
import { useDataRefresh } from "../context/DataRefreshContext";

const Nav = () => {
    const [isIncomePopupVisible, setIsIncomePopupVisible] = useState(false);
    const [isExpensePopupVisible, setIsExpensePopupVisible] = useState(false);
    const { triggerRefresh } = useDataRefresh();

    const handleIncomeButtonClick = () => {
        setIsIncomePopupVisible(true);
    }

    const handleExpenseButtonClick = () => {
        setIsExpensePopupVisible(true);
    }

    const handleCloseIncomePopup = () => {
        setIsIncomePopupVisible(false);
    }

    const handleCloseExpensePopup = () => {
        setIsExpensePopupVisible(false);
    }

    const handleSubmit = (data) => {
        addNewTransaction(data.user, data.transaction)
            .then(() => triggerRefresh());
        handleCloseIncomePopup();
        handleCloseExpensePopup();
    }

    return (
        <nav>
            <header>
                <h1>Budget Buddy</h1>
            </header>
            <ul>
                <li><Link to="/">Overview</Link></li>
                <li><Link to="/budget">Budget</Link></li>
                <li><Link to="/spending">Spending</Link></li>
            </ul>
            <div className="addButtons">
                <button onClick={handleIncomeButtonClick}><Link>➕ Add Income</Link></button>
                <NewIncomePopupForm 
                    isVisible={isIncomePopupVisible}
                    onClose={handleCloseIncomePopup}
                    onSubmit={handleSubmit} 
                />
                <button onClick={handleExpenseButtonClick}><Link>➕ Add Expense</Link></button>
                <NewExpensePopupForm 
                    isVisible={isExpensePopupVisible}
                    onClose={handleCloseExpensePopup}
                    onSubmit={handleSubmit} 
                />
            </div>
        </nav>
    );
}

export default Nav;
