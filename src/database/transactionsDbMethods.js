import { db } from "../firebase";
import { doc, collection, getDoc, setDoc, addDoc } from "firebase/firestore/lite";
import { getUserBudgetCategories } from "./budgetDbMethods";

async function getMonthlySummary(user, year, month) {
    const monthlySummaryDoc = doc(db, 'users', user.uid, 'monthlySummaries', `${year}-${month}`);
    const monthlySummaryDocSnap = await getDoc(monthlySummaryDoc);

    if (monthlySummaryDocSnap.exists()) {
        return monthlySummaryDocSnap.data();
    } else {
        console.error("No such document!");
        return null;
    }
}

async function addNewTransaction(user, transaction) {
    try {
        // Add to transactions collection
        await addDoc(collection(db, 'users', user.uid, 'transactions'), {
            amount: Number(transaction.amount),
            category: transaction.category,
            date: transaction.date,
            description: transaction.description,
            type: transaction.type
        });

        // Update monthly summary
        await updateMonthlySummary(user, transaction);
    } catch (error) {
        console.error("Error adding new transaction: ", error);
        throw error;
    }
}

async function updateMonthlySummary(user, transaction) {
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

export { addNewTransaction, getMonthlySummary };
