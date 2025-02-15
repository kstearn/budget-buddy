import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { colors } from '../colors';
import { useAuth } from '../contexts/AuthContext';
import { getMonthlySummary } from '../database/monthlySummariesDbMethods';
import { getRecentTransactions, updateTransaction } from '../database/transactionsDbMethods';
import EditTransactionPopupForm from '../components/EditTransactionPopupForm';
import { useDataRefresh } from '../contexts/DataRefreshContext';

const Spending = () => {
    const { user, loading } = useAuth();
    const { refreshData } = useDataRefresh();
    const { triggerRefresh } = useDataRefresh();

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        ArcElement,
        Title,
        Tooltip,
        Legend
    );

    const [spendingData, setSpendingData] = useState({});
    const [barChartData, setBarChartData] = useState({});
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);

    useEffect(() => {
        if (!user) return;

        // get monthly spending from monthly summary
        let currentYear = new Date().getFullYear().toString();
        let currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');

        getMonthlySummary(user, currentYear, currentMonth)
            .then(data => {
                if (data) {
                    setSpendingData(data);
                } else {
                    setSpendingData({});
                }
            });

        // get most recent transactions
        getRecentTransactions(user, 10)
            .then(transactions => setRecentTransactions(transactions));
    }, [user, refreshData]);

    //update the chart data when the dashboard data changes
    useEffect(() => {
        if (!spendingData.budgetCategories) return;

        const categories = Object.keys(spendingData.budgetCategories).sort((a, b) => a.localeCompare(b));
        const spentAmounts = categories.map(category => spendingData.budgetCategories[category].spentAmount);
        const budgetAmounts = categories.map(category => spendingData.budgetCategories[category].budgetAmount);

        setBarChartData({
            labels: categories,
            datasets: [
                {
                    label: 'Spent Amount',
                    data: spentAmounts,
                    backgroundColor: colors.slice(0, categories.length),
                    stack: 'Stack 0'
                },
                {
                    label: 'Remaining Budget',
                    data: budgetAmounts.map((budget, index) => budget - spentAmounts[index]),
                    backgroundColor: colors.slice(categories.length, categories.length * 2),
                    stack: 'Stack 0'
                }
            ]
        });
    }, [spendingData, refreshData]);

    const handleRowClick = (transaction) => {
        setSelectedTransaction(transaction);
        setIsEditPopupVisible(true);
    };

    const handleCloseEditPopup = () => {
        setIsEditPopupVisible(false);
        setSelectedTransaction(null);
    };

    const handleEditSubmit = async (updatedTransaction) => {
        await updateTransaction(user, updatedTransaction);
        triggerRefresh();
        handleCloseEditPopup();
    };

    return (
        <div className="spending">
            <h2>Spending</h2>
            <div className="spendingDataContainer">
                <div className="barChart">
                    {barChartData.labels &&
                    <Bar
                        data={barChartData}
                        options={{
                            response: true,
                            maintainAspectRatio: false,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'This Month'
                                },
                                legend: {
                                    display: false
                                }
                            },
                            scales: {
                                x: {
                                    stacked: true
                                },
                                y: {
                                    stacked: true,
                                    min: 0
                                }
                            }
                        }}
                    />}
                </div>
                <div className="spendingTableContainer">
                    <h3>Transactions</h3>
                    <p className="info">Click on a row to edit or delete it.</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTransactions && recentTransactions.map((transaction, index) => (
                                <tr key={index} onClick={() => handleRowClick(transaction)}>
                                    <td>{transaction.date}</td>
                                    <td>{transaction.category}</td>
                                    <td>{transaction.amount}</td>
                                    <td>{transaction.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isEditPopupVisible && (
                <EditTransactionPopupForm
                    transaction={selectedTransaction}
                    isVisible={isEditPopupVisible}
                    onClose={handleCloseEditPopup}
                    onSubmit={handleEditSubmit}
                />
            )}
        </div>
    );
};

export default Spending;
