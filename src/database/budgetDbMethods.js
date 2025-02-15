import { db } from "../firebase";
import { doc, collection, addDoc, getDoc, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import { addNewCategoryToMonthlySummary, updateCategoryInMonthlySummary, removeCategoryFromMonthlySummary } from "./monthlySummariesDbMethods";

export async function getUserBudgetCategories(user) {
    try {
        const categoriesColl = collection(db, 'users', user.uid, 'budgetCategories');
        const categoriesSnapshot = await getDocs(categoriesColl);
        const categories = {};
        categoriesSnapshot.forEach(doc => {
            categories[doc.id] = {
                categoryName: doc.data().categoryName,
                budgetAmount: doc.data().budgetAmount
            }
        });
        return categories;
    } catch (error) {
        console.error("Error fetching budget category: ", error);
        return {};
    }
}

export async function createNewBudgetCategory(user, name, amount) {
    await addDoc(collection(db, 'users', user.uid, 'budgetCategories'), {
            categoryName: name,
            budgetAmount: Number(amount)
        }
    );

    addNewCategoryToMonthlySummary(user, name, amount);
}

export async function updateCategory(user, updatedCategory) {
    try {
        console.log(updatedCategory);
        const categoryDoc = doc(db, 'users', user.uid, 'budgetCategories', updatedCategory.id);
        const categoryDocSnap = await getDoc(categoryDoc);

        const prevName = categoryDocSnap.data().categoryName;
        const prevAmount = categoryDocSnap.data().budgetAmount;

        await setDoc(categoryDoc, {
            categoryName: updatedCategory.name,
            budgetAmount: Number(updatedCategory.amount)
        });

        if (prevName !== updatedCategory.name || prevAmount !== updatedCategory.amount) {
            // Update monthly summary
            await updateCategoryInMonthlySummary(user, updatedCategory, prevName, prevAmount);
        }
    } catch (error) {
        console.error("Error updating category: ", error);
        throw error;
    }
}

export async function deleteCategory(user, category) {
    try {
        const categoryDoc = doc(db, 'users', user.uid, 'budgetCategories', category.id);
        await deleteDoc(categoryDoc);

        // Update monthly summary
        await removeCategoryFromMonthlySummary(user, category);
    } catch (error) {
        console.error("Error deleting category: ", error);
        throw error;
    }
}
