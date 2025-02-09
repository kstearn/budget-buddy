import { db } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';

export async function createNewUser(user) {
    await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName
    });

    await setDoc(doc(db, 'users', user.uid, 'budgetCategories', 'testCategory'), {
        testCategory: []
    });
}
