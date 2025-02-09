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
import { getRecentTransactions } from '../database/transactionsDbMethods';

const Spending = () => {
    const { user, loading } = useAuth();

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

    // fetch data from the server
    useEffect(() => {
        if (!user) return;

        // get monthly spending from monthly summary
        let currentYear = new Date().getFullYear().toString();
        let currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');

        getMonthlySummary(user, currentYear, currentMonth)
            .then(data => setSpendingData(data));

        // get most recent transactions
        getRecentTransactions(user, 10)
            .then(transactions => setRecentTransactions(transactions));
    }, [])

    //update the chart data when the dashboard data changes
    useEffect(() => {
        if (!spendingData.budgetCategories) return;

        const categories = Object.keys(spendingData.budgetCategories);
        const spentAmounts = categories.map(category => spendingData.budgetCategories[category].spentAmount);
        const budgetAmounts = categories.map(category => spendingData.budgetCategories[category].budgetAmount);

        setBarChartData({
            labels: categories,
            datasets: [
                {
                    label: 'Spent Amount',
                    data: spentAmounts,
                    backgroundColor: colors.slice(0, categories.length)
                },
                {
                    label: 'Budget Amount',
                    data: budgetAmounts,
                    backgroundColor: colors.slice(categories.length, categories.length * 2)
                }
            ]
        });
    }, [spendingData])

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
                            }
                        }}
                    />}
                </div>
                <div className="spendingTableContainer">
                    <h3>Transactions</h3>
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
                                <tr key={index}>
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
        </div>
    );
};

export default Spending;
