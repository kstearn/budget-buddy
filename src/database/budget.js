import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore/lite";

async function getData() {
    
}

async function getUserBudgetCategories(user) {
    console.log(user);
    console.log(user.uid);
    try {
        const categoryDoc = doc(db, `users/${user.uid}/budgetCategories`, "testCategory");
        const categorySnapshot = await getDoc(categoryDoc);
        if (categorySnapshot.exists()) {
            return categorySnapshot.data();
        } else {
            console.error("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching budget category: ", error);
        throw error;
    }
}

export { getData, getUserBudgetCategories };
