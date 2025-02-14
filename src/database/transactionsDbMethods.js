import { db } from "../firebase";
import { collection, doc, addDoc, getDoc, setDoc, deleteDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
import { addNewTransactionToMonthlySummary,
    removeTransactionFromMonthlySummary,
    updateTransactionAmountInMonthlySummary } from "./monthlySummariesDbMethods";

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
        await addNewTransactionToMonthlySummary(user, transaction);
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
            transactions.push({ id: doc.id, ...doc.data() });
        });
        return transactions;
    } catch (error) {
        console.error("Error fetching recent transactions: ", error);
        throw error;
    }
}

export async function updateTransaction(user, transaction) {
    try {
        const transactionDoc = doc(db, 'users', user.uid, 'transactions', transaction.id);
        const transactionDocSnap = await getDoc(transactionDoc);

        const prevAmount = transactionDocSnap.data().amount;
        console.log(prevAmount);

        await setDoc(transactionDoc, {
            amount: Number(transaction.amount),
            category: transaction.category,
            date: transaction.date,
            description: transaction.description,
            type: transaction.type
        });

        if (prevAmount !== transaction.amount) {
            // Update monthly summary
            await updateTransactionAmountInMonthlySummary(user, transaction, prevAmount);
        }
    } catch (error) {
        console.error("Error updating transaction: ", error);
        throw error;
    }
}

export async function deleteTransaction(user, transaction) {
    console.log("Deleting transaction: ", transaction);
    try {
        const transactionDoc = doc(db, 'users', user.uid, 'transactions', transaction.id);
        await deleteDoc(transactionDoc);

        // Update monthly summary
        await removeTransactionFromMonthlySummary(user, transaction);
    } catch (error) {
        console.error("Error deleting transaction: ", error);
        throw error;
    }
}
