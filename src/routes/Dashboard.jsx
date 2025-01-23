import { useState, useEffect } from 'react';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState({});
    
    useEffect(() => {
        fetch('/api/hello')
            .then((res) => res.json())
            .then((data) => setDashboardData(data));
    }, [])

    useEffect(() => {
        console.log(dashboardData);
    }, [dashboardData])

    return (
        <div>
            <h2>Dashboard</h2>
            <p>{dashboardData ? `Welcome to the dashboard, ${dashboardData.name}` : 'Loading...'}</p>
        </div>
    );
};

export default Dashboard;
