import { db } from "../firebase";
import { collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
import { updateMonthlySummary } from "./monthlySummariesDbMethods";

export async function addNewTransaction(user, transaction) {
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

export async function getRecentTransactions(user, lim) {
    try {
        const transactionsColl = collection(db, 'users', user.uid, 'transactions');
        const q = query(transactionsColl, orderBy('date', 'desc'), limit(lim));

        const transactions = [];
        const transactionsSnapshot = await getDocs(q);
        transactionsSnapshot.forEach(doc => {
            transactions.push(doc.data());
        });
        return transactions;
    } catch (error) {
        console.error("Error fetching recent transactions: ", error);
        throw error;
    }
}
