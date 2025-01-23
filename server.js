const express = require('express');
const app = express();
const port = 3000;

app.get('/api/hello', (req, res) => {
    res.send(
        {
            "name": "Test User",
            "budgetCategories": {
                "groceries": 100,
                "restaurants": 200,
                "transportation": 50,
                "utilities": 100,
                "rent": 500,
                "entertainment": 50,
                "clothing": 50,
                "medical": 50,
                "savings": 100
            },
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