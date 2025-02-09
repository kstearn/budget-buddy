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
import { getData, getUserBudgetCategories } from '../database/budgetDbMethods';

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

    // fetch data from the server
    useEffect(() => {
        // fetch('/api/hello')
        if (!user) return;
        //     .then((res) => res.json())
        //     .then((data) => setSpendingData(data));
        // getData().then(data => setSpendingData(data[0]));
        getUserBudgetCategories(user).then(data => console.log(data));
    }, [])

    // update the chart data when the dashboard data changes
    // useEffect(() => {
    //     if (!spendingData.name) return;
    //     console.log(spendingData.transactions);

    //     setBarChartData({
    //         labels: spendingData.budgetCategories.map(category => category.name),
    //         datasets: [
    //             {
    //                 label: 'Spending by Category',
    //                 data: spendingData.budgetCategories.map(category => category.value),
    //                 backgroundColor: spendingData.budgetCategories.map((category, index) => colors[index % colors.length])
    //             }
    //         ]
    //     });
    // }, [spendingData])

    return (
        <div className="spending">
            <h2>Spending</h2>
            <p>Welcome to the spending</p>
            <div className="spendingDataContainer">
                <div className="barChart">
                    {/* {barChartData.labels &&
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
                    />} */}
                </div>
                <div className="spendingTableContainer">
                    <h3>Transactions</h3>
                    {/* <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {spendingData.transactions && spendingData.transactions.map((transaction, index) => (
                                <tr key={index}>
                                    <td>{transaction.date}</td>
                                    <td>{transaction.category}</td>
                                    <td>{transaction.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table> */}
                </div>
            </div>
        </div>
    );
};

export default Spending;
