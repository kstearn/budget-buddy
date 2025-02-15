import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getUserBudgetCategories } from "./budgetDbMethods";

export async function getMonthlySummary(user, year, month) {
    const monthlySummaryDoc = doc(db, 'users', user.uid, 'monthlySummaries', `${year}-${month}`);
    const monthlySummaryDocSnap = await getDoc(monthlySummaryDoc);

    if (monthlySummaryDocSnap.exists()) {
        return monthlySummaryDocSnap.data();
    } else {
        console.error("No such document!");
        return null;
    }
}

export async function addNewTransactionToMonthlySummary(user, transaction) {
    // get transaction year/month
    const year = transaction.date.split('-')[0];
    const month = transaction.date.split('-')[1];

    const monthlySummaryDoc = doc(db, 'users', user.uid, 'monthlySummaries', `${year}-${month}`);
    const monthlySummaryDocSnap = await getDoc(monthlySummaryDoc);

    if (monthlySummaryDocSnap.exists()) {
        const monthlySummaryData = monthlySummaryDocSnap.data();
        const updatedData = {
            totalSpent: Number(monthlySummaryData.totalSpent),
            totalIncome: Number(monthlySummaryData.totalIncome),
            totalBudget: Number(monthlySummaryData.totalBudget),
            budgetCategories: { ...monthlySummaryData.budgetCategories }
        };

        if (transaction.type === 'expense') {
            updatedData.totalSpent += Number(transaction.amount);
            if (!updatedData.budgetCategories[transaction.category]) {
                updatedData.budgetCategories[transaction.category] = {
                    budgetAmount: 0,
                    spentAmount: 0
                };
            }
            updatedData.budgetCategories[transaction.category].spentAmount += Number(transaction.amount);
        } else if (transaction.type === 'income') {
            updatedData.totalIncome += Number(transaction.amount);
        }

        await setDoc(monthlySummaryDoc, updatedData);
    } else {
        const budgetCategories = await getUserBudgetCategories(user);
        const initialBudgetCategories = {};
        for (const category in budgetCategories) {
            initialBudgetCategories[category] = {
                budgetAmount: Number(budgetCategories[category]),
                spentAmount: 0
            };
        }

        if (transaction.type === 'expense') {
            if (!initialBudgetCategories[transaction.category]) {
                initialBudgetCategories[transaction.category] = {
                    budgetAmount: 0,
                    spentAmount: 0
                };
            }
            initialBudgetCategories[transaction.category].spentAmount = Number(transaction.amount);
        }

        await setDoc(monthlySummaryDoc, {
            totalSpent: transaction.type === 'expense' ? Number(transaction.amount) : 0,
            totalIncome: transaction.type === 'income' ? Number(transaction.amount) : 0,
            totalBudget: Object.values(budgetCategories).reduce((acc, curr) => acc + Number(curr), 0),
            budgetCategories: initialBudgetCategories
        });
    }
}

export async function addNewCategoryToMonthlySummary(user, newCategoryName, newCategoryAmount) {
    console.log(newCategoryName, newCategoryAmount);
    // get current year/month
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');

    const monthlySummaryDoc = doc(db, 'users', user.uid, 'monthlySummaries', `${year}-${month}`);
    const monthlySummaryDocSnap = await getDoc(monthlySummaryDoc);

    if (monthlySummaryDocSnap.exists()) {
        const monthlySummaryData = monthlySummaryDocSnap.data();
        const updatedData = {
            totalSpent: Number(monthlySummaryData.totalSpent),
            totalIncome: Number(monthlySummaryData.totalIncome),
            totalBudget: Number(monthlySummaryData.totalBudget),
            budgetCategories: { ...monthlySummaryData.budgetCategories }
        };

        updatedData.budgetCategories[newCategoryName] = {
            budgetAmount: Number(newCategoryAmount),
            spentAmount: 0
        };

        await setDoc(monthlySummaryDoc, updatedData);
    } else {
        // create new monthly summary
        const budgetCategories = await getUserBudgetCategories(user);
        console.log(budgetCategories);

        const initialBudgetCategories = {};

        for (const categoryId in budgetCategories) {
            const category = budgetCategories[categoryId];
            console.log(category);

            initialBudgetCategories[category.categoryName] = {
                budgetAmount: Number(category.budgetAmount),
                spentAmount: 0
            };
        }

        initialBudgetCategories[newCategoryName] = {
            budgetAmount: Number(newCategoryAmount),
            spentAmount: 0
        };

        await setDoc(monthlySummaryDoc, {
            totalSpent: 0,
            totalIncome: 0,
            totalBudget: Object.values(budgetCategories).reduce((acc, curr) => acc + Number(curr.budgetAmount), 0),
            budgetCategories: initialBudgetCategories
        });
    }
}

export async function removeTransactionFromMonthlySummary(user, transaction) {
    // get transaction year/month
    const year = transaction.date.split('-')[0];
    const month = transaction.date.split('-')[1];

    const monthlySummaryDoc = doc(db, 'users', user.uid, 'monthlySummaries', `${year}-${month}`);
    const monthlySummaryDocSnap = await getDoc(monthlySummaryDoc);

    if (monthlySummaryDocSnap.exists()) {
        const monthlySummaryData = monthlySummaryDocSnap.data();
        const updatedData = {
            totalSpent: Number(monthlySummaryData.totalSpent),
            totalIncome: Number(monthlySummaryData.totalIncome),
            totalBudget: Number(monthlySummaryData.totalBudget),
            budgetCategories: { ...monthlySummaryData.budgetCategories }
        };

        if (transaction.type === 'expense') {
            updatedData.totalSpent -= Number(transaction.amount);
            updatedData.budgetCategories[transaction.category].spentAmount -= Number(transaction.amount);
        } else if (transaction.type === 'income') {
            updatedData.totalIncome -= Number(transaction.amount);
        }

        await setDoc(monthlySummaryDoc, updatedData);
    } else {
        console.error("No such document!");
    }
}

export async function updateTransactionAmountInMonthlySummary(user, transaction, prevAmount) {
    // get transaction year/month
    const year = transaction.date.split('-')[0];
    const month = transaction.date.split('-')[1];

    const monthlySummaryDoc = doc(db, 'users', user.uid, 'monthlySummaries', `${year}-${month}`);
    const monthlySummaryDocSnap = await getDoc(monthlySummaryDoc);

    if (monthlySummaryDocSnap.exists()) {
        const monthlySummaryData = monthlySummaryDocSnap.data();
        const updatedData = {
            totalSpent: Number(monthlySummaryData.totalSpent),
            totalIncome: Number(monthlySummaryData.totalIncome),
            totalBudget: Number(monthlySummaryData.totalBudget),
            budgetCategories: { ...monthlySummaryData.budgetCategories }
        };

        if (transaction.type === 'expense') {
            // subtract previous transaction amount and add new transaction amount
            updatedData.totalSpent += Number(transaction.amount) - Number(prevAmount);
            updatedData.budgetCategories[transaction.category].spentAmount += Number(transaction.amount) - Number(prevAmount);
        } else if (transaction.type === 'income') {
            updatedData.totalIncome += Number(transaction.amount) - Number(prevAmount);
        }

        await setDoc(monthlySummaryDoc, updatedData);
    } else {
        console.error("No such document!");
    }
}

export async function updateCategoryInMonthlySummary(user, updatedCategory, prevName, prevAmount) {
    // get current year/month
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');

    const monthlySummaryDoc = doc(db, 'users', user.uid, 'monthlySummaries', `${year}-${month}`);
    const monthlySummaryDocSnap = await getDoc(monthlySummaryDoc);

    if (monthlySummaryDocSnap.exists()) {
        const monthlySummaryData = monthlySummaryDocSnap.data();
        const updatedData = {
            totalSpent: Number(monthlySummaryData.totalSpent),
            totalIncome: Number(monthlySummaryData.totalIncome),
            totalBudget: Number(monthlySummaryData.totalBudget),
            budgetCategories: { ...monthlySummaryData.budgetCategories }
        };

        // update budget amount, spent amount remains the same
        updatedData.budgetCategories[updatedCategory.name] = {
            budgetAmount: Number(updatedCategory.amount),
            spentAmount: updatedData.budgetCategories[prevName].spentAmount
        };

        // remove previous category if name changed
        if (prevName !== updatedCategory.name) {
            delete updatedData.budgetCategories[prevName];
        }

        // update total budget by adding new category amount and subtracting previous category amount
        updatedData.totalBudget += Number(updatedCategory.amount) - Number(prevAmount);

        await setDoc(monthlySummaryDoc, updatedData);
    } else {
        console.error("No such document!");
    }
}

export async function removeCategoryFromMonthlySummary(user, category) {
    console.log(category);
    // get current year/month
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');

    const monthlySummaryDoc = doc(db, 'users', user.uid, 'monthlySummaries', `${year}-${month}`);
    const monthlySummaryDocSnap = await getDoc(monthlySummaryDoc);

    if (monthlySummaryDocSnap.exists()) {
        const monthlySummaryData = monthlySummaryDocSnap.data();
        const updatedData = {
            totalSpent: Number(monthlySummaryData.totalSpent),
            totalIncome: Number(monthlySummaryData.totalIncome),
            totalBudget: Number(monthlySummaryData.totalBudget),
            budgetCategories: { ...monthlySummaryData.budgetCategories }
        };

        console.log(updatedData);

        // remove previous category amount from total budget
        updatedData.totalBudget -= Number(updatedData.budgetCategories[category.name].budgetAmount);
        // remove category from budget categories
        delete updatedData.budgetCategories[category.name];

        await setDoc(monthlySummaryDoc, updatedData);
    } else {
        console.error("No such document!");
    }
}