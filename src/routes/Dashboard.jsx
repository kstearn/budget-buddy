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
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import { colors } from '../colors';

const Dashboard = () => {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        ArcElement,
        Title,
        Tooltip,
        Legend
    );

    const [dashboardData, setDashboardData] = useState({});
    const [budgetChartData, setBudgetChartData] = useState({});
    const [spendingChartData, setSpendingChartData] = useState({});
    const [barChartData, setBarChartData] = useState({});
    
    // fetch data from the server
    useEffect(() => {
        fetch('/api/hello')
            .then((res) => res.json())
            .then((data) => setDashboardData(data));
    }, [])

    // update the chart data when the dashboard data changes
    useEffect(() => {
        if (!dashboardData.name) return;
        console.log(dashboardData.budgetCategories);

        setBudgetChartData({
            labels: ['Spent', 'Remaining'],
            datasets: [
                {
                    data: [dashboardData.totalSpent, dashboardData.totalBudget - dashboardData.totalSpent],
                    backgroundColor: [colors[1], colors[0]]
                }
            ]
        });

        setSpendingChartData({
            labels: dashboardData.budgetCategories.map(category => category.name),
            datasets: [
                {
                    data: dashboardData.budgetCategories,
                    backgroundColor: dashboardData.budgetCategories.map((category, index) => colors[index % colors.length])
                }
            ]
        });

        setBarChartData({
            labels: dashboardData.budgetCategories.map(category => category.name),
            datasets: [
                {
                    data: dashboardData.budgetCategories.map(category => category.value),
                    backgroundColor: dashboardData.budgetCategories.map((category, index) => colors[index % colors.length])
                }
            ]
        });
    }, [dashboardData])

    return (
        <div className="dashboard">
            <h2>Dashboard</h2>
            <p>{dashboardData ? `Welcome to the dashboard, ${dashboardData.name}` : 'Loading...'}</p>
            <div className="chartsContainer">
                <div className="topChartsContainer">
                    <div className="chartCard">
                        {budgetChartData.labels &&
                        <Doughnut
                            data={budgetChartData}
                            options={{
                                rotation: -90,
                                circumference: 180,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'My Budget'
                                    }
                                }
                            }}
                            
                        />}
                    </div>
                    <div className="chartCard">
                        {spendingChartData.datasets &&
                        <Pie
                            data={spendingChartData}
                            options={{
                                parsing: {key: 'value'},
                                plugins: {
                                    legend: {
                                        display: false
                                    },
                                    title: {
                                        display: true,
                                        text: 'Spending by Category'
                                    }
                                }
                            }}
                        />}
                    </div>
                </div>
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
            </div>
        </div>
    );
};

export default Dashboard;
