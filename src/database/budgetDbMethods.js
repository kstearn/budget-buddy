import { db } from "../firebase";
import { doc, collection, getDocs, setDoc } from "firebase/firestore";
import { addNewCategoryToMonthlySummary } from "./monthlySummariesDbMethods";

export async function getUserBudgetCategories(user) {
    try {
        const categoriesColl = collection(db, 'users', user.uid, 'budgetCategories');
        const categoriesSnapshot = await getDocs(categoriesColl);
        const categories = {};
        categoriesSnapshot.forEach(doc => {
            categories[doc.data().categoryName] = doc.data().budgetAmount;
        });
        return categories;
    } catch (error) {
        console.error("Error fetching budget category: ", error);
        throw error;
    }
}

export async function createNewBudgetCategory(user, name, amount) {
    await setDoc(doc(db, 'users', user.uid, 'budgetCategories', name), {
            categoryName: name,
            budgetAmount: Number(amount)
        }
    );

    addNewCategoryToMonthlySummary(user, name, amount);
}
