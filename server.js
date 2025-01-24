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
                {name: "groceries",
                value: 100},
                {name: "restaurants",
                    value: 200},
                {name: "transportation",
                    value: 50},
                {name: "utilities",
                    value: 100},
                {name: "rent",
                    value: 500},
                {name: "entertainment",
                    value: 50},
                {name: "clothing",
                    value: 50},
                {name: "medical",
                    value: 50},
                {name: "savings",
                    value: 100}
            ],
            "transactions": {
                "groceries": [
                    {
                        "date": "2021-01-01",
                        "amount": 10,
                        "description": "Grocery Store"
                    },
                    {
                        "date": "2021-01-02",
                        "amount": 20,
                        "description": "Grocery Store"
                    },
                    {
                        "date": "2021-01-03",
                        "amount": 30,
                        "description": "Grocery Store"
                    }
                ],
                "restaurants": [
                    {
                        "date": "2021-01-01",
                        "amount": 10,
                        "description": "Restaurant"
                    },
                    {
                        "date": "2021-01-02",
                        "amount": 20,
                        "description": "Restaurant"
                    },
                    {
                        "date": "2021-01-03",
                        "amount": 30,
                        "description": "Restaurant"
                    }
                ],
                "transportation": [
                    {
                        "date": "2021-01-01",
                        "amount": 10,
                        "description": "Gas Station"
                    },
                    {
                        "date": "2021-01-02",
                        "amount": 20,
                        "description": "Gas Station"
                    },
                    {
                        "date": "2021-01-03",
                        "amount": 30,
                        "description": "Gas Station"
                    }
                ],
                "utilities": [
                    {
                        "date": "2021-01-01",
                        "amount": 10,
                        "description": "Utility Company"
                    },
                    {
                        "date": "2021-01-02",
                        "amount": 20,
                        "description": "Utility Company"
                    },
                    {
                        "date": "2021-01-03",
                        "amount": 30,
                        "description": "Utility Company"
                    }
                ],
                "rent": [
                    {
                        "date": "2021-01-01",
                        "amount": 10,
                        "description": "Landlord"
                    },
                    {
                        "date": "2021-01-02",
                        "amount": 20,
                        "description": "Landlord"
                    },
                    {
                        "date": "2021-01-03",
                        "amount": 30,
                        "description": "Landlord"
                    }
                ]
            }
        }
    );
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});