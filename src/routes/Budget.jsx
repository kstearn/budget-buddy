const Budget = () => {
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
            </div>
        </div>
    );
};

export default Budget;
