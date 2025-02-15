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
import { useAuth } from '../contexts/AuthContext';
import { getMonthlySummary } from '../database/monthlySummariesDbMethods';
import { useDataRefresh } from '../contexts/DataRefreshContext';

const Dashboard = () => {
    const { user, loading } = useAuth();
    const { refreshData } = useDataRefresh();

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
    
    // fetch data
    useEffect(() => {
        // get budget and spent from monthly summary
        // get spending per category from monthly summary
        let currentYear = new Date().getFullYear().toString();
        let currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');

        getMonthlySummary(user, currentYear, currentMonth)
            .then(data => {
                if (data) {
                    setDashboardData(data);
                } else {
                    setDashboardData({});
                }
            });
    }, [user, refreshData]);

    // update the chart data when the dashboard data changes
    useEffect(() => {
        if (!dashboardData.totalSpent) return;

        setBudgetChartData({
            labels: ['Spent', 'Remaining'],
            datasets: [
                {
                    data: [dashboardData.totalSpent, dashboardData.totalBudget - dashboardData.totalSpent],
                    backgroundColor: [colors[1], colors[0]]
                }
            ]
        });

        const categories = Object.keys(dashboardData.budgetCategories);
        const spentAmounts = categories.map(category => dashboardData.budgetCategories[category].spentAmount);
        const budgetAmounts = categories.map(category => dashboardData.budgetCategories[category].budgetAmount);

        setSpendingChartData({
            labels: categories,
            datasets: [
                {
                    data: spentAmounts,
                    backgroundColor: categories.map((category, index) => colors[index % colors.length])
                }
            ]
        });

        setBarChartData({
            labels: categories,
            datasets: [
                {
                    data: spentAmounts,
                    backgroundColor: categories.map((category, index) => colors[index % colors.length])
                }
            ]
        });
    }, [dashboardData])

    return (
        <div className="dashboard">
            <h2>Dashboard</h2>
            <p>{loading ? 'Loading...' : `Welcome to the dashboard, ${user.displayName}`}</p>
            {dashboardData.totalSpent ? 
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
                                    }} />}
                        </div>
                        <div className="chartCard">
                            {spendingChartData.datasets &&
                                <Pie
                                    data={spendingChartData}
                                    options={{
                                        parsing: { key: 'value' },
                                        plugins: {
                                            legend: {
                                                display: false
                                            },
                                            title: {
                                                display: true,
                                                text: 'Spending by Category'
                                            }
                                        }
                                    }} />}
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
                                    }} />}
                    </div>
                </div>
            :
                <p>No data to display. Try adding some budget categories and transactions!</p>
            }
        </div>
    );
};

export default Dashboard;
