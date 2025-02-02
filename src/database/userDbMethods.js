import { db } from '../firebase';
import { setDoc, doc } from 'firebase/firestore/lite';

async function createNewUser(user) {
    await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName
    });

    await setDoc(doc(db, 'users', user.uid, 'budgetCategories', 'testCategory'), {
        testCategory: []
    });
}

export { createNewUser};
