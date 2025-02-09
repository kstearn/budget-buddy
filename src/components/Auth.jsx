import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { auth } from '../firebase';
import { createNewUser } from '../database/userDbMethods';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

const Auth = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    useEffect(() => {
        const uiConfig = {
            signInFlow: 'popup',
            signInSuccessUrl: '/',
            signInOptions: [
                firebase.auth.EmailAuthProvider.PROVIDER_ID
            ],
            callbacks: {
                signInSuccessWithAuthResult: (authResult, redirectUrl) => {
                    // User successfully signed in.
                    setUser(authResult.user);

                    if (authResult.additionalUserInfo.isNewUser) {
                        // New user created
                        // Add user to the database
                        createNewUser(authResult.user);
                    }

                    navigate('/');
                    return false; // Avoid redirects after sign-in.
                }
            }
        };

        // Check if an AuthUI instance already exists
        if (!firebaseui.auth.AuthUI.getInstance()) {
            const ui = new firebaseui.auth.AuthUI(auth);
            ui.start('#firebaseui-auth-container', uiConfig);
        } else {
            const ui = firebaseui.auth.AuthUI.getInstance();
            ui.start('#firebaseui-auth-container', uiConfig);
        }
    }, [navigate, setUser]);

    return (
        <div id="firebaseui-auth-container"></div>
    );
}

export default Auth;
