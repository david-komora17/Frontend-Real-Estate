import { createContext, useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { auth, db } from '../firebase/config';
import { setAuth, logout, setLoading } from '../store/authSlice.js'; // Ensure setLoading exists

const AuthContext = createContext(); 

export const AuthProvider = ({ children }) => { 
    const dispatch = useDispatch();

    useEffect(() => {
        // Start by telling Redux we are checking the session
        dispatch(setLoading(true)); 

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                if (user) {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        dispatch(setAuth({
                            user: { uid: user.uid, email: user.email },
                            role: userData.role // This is the payload your slice needs
                        }));
                    } else {
                        // If auth exists but no Firestore doc, fallback to 'user'
                        dispatch(setAuth({
                            user: { uid: user.uid, email: user.email },
                            role: 'user'
                        }));
                    }
                } else {
                    dispatch(logout());
                }
            } catch (error) {
                console.error("Auth Provider Error:", error);
                dispatch(logout());
            } finally {
                // IMPORTANT: Tell Redux we are done loading so ProtectedRoute can proceed
                dispatch(setLoading(false));
            }
        });

        return () => unsubscribe();
    }, [dispatch]);

    return (
        <AuthContext.Provider value={{}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);