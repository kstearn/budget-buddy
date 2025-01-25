const express = require('express');
const app = express();
const port = 4000;

app.get('/api/hello', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(
        {
            "name": "Test User",
            "totalBudget": 1000,
            "totalSpent": 300,
            "budgetCategories": [
                {name: "groceries", value: 100},
                {name: "restaurants", value: 200},
                {name: "transportation", value: 50},
                {name: "utilities", value: 100},
                {name: "rent", value: 500},
                {name: "entertainment", value: 50},
                {name: "clothing", value: 50},
                {name: "medical", value: 50},
                {name: "savings", value: 100}
            ],
            "transactions": [
                {category: "clothing", amount: 30, date: "2023-10-01"},
                {category: "medical", amount: 20, date: "2023-10-02"},
                {category: "savings", amount: 50, date: "2023-10-03"},
                {category: "clothing", amount: 10, date: "2023-10-04"},
                {category: "medical", amount: 30, date: "2023-10-05"},
                {category: "savings", amount: 50, date: "2023-10-06"}
            ]
        }
    );
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});