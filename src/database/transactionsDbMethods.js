import { db } from "../firebase";
import { doc, collection, getDoc, setDoc, addDoc } from "firebase/firestore/lite";

async function addNewTransaction(user, transaction) {
    await addDoc(collection(db, 'users', user.uid, 'transactions'), {
            amount: transaction.amount,
            category: transaction.category,
            date: transaction.date,
            description: transaction.description,
            type: transaction.type
        }
    );
}

export { addNewTransaction };
