import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { auth } from '../firebase';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../auth/AuthContext';

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
                    // Redirect to the home page or any other page.
                    setUser(authResult.user);
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
    }, [navigate]);

    return (
        <div id="firebaseui-auth-container"></div>
    );
}

export default Auth;
