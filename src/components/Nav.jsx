import { useState } from "react";
import { Link } from "react-router";
import NewIncomePopupForm from "./NewIncomePopupForm";
import NewExpensePopupForm from "./NewExpensePopupForm";
import { addNewTransaction } from "../database/transactionsDbMethods";

const Nav = () => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const handleButtonClick = () => {
        setIsPopupVisible(true);
    }

    const handleClosePopup = () => {
        setIsPopupVisible(false);
    }

    const handleSubmit = (data) => {
        addNewTransaction(data.user, data.transaction);
        handleClosePopup();
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
                <button onClick={handleButtonClick}><Link>➕ Add Income</Link></button>
                <NewIncomePopupForm 
                    isVisible={isPopupVisible}
                    onClose={handleClosePopup}
                    onSubmit={handleSubmit} 
                />
                <button onClick={handleButtonClick}><Link>➕ Add Expense</Link></button>
                <NewExpensePopupForm 
                    isVisible={isPopupVisible}
                    onClose={handleClosePopup}
                    onSubmit={handleSubmit} 
                />
            </div>
        </nav>
    );
}

export default Nav;
