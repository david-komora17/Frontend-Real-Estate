import { createContext, useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {doc, getDoc} from 'firebase/firestore';
import {useDispatch} from 'react-redux';
import {auth, db} from '../firebase/config';
import {setAuth, clearAuth} from '../store/authSlice';


const AuthContext = createContext(); 

export const AuthProvider = ({ children }) => { 
    const dispatch = useDispatch();
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async(user) => {
            if(user) {
                const userDoc= await getDoc(doc(db, 'users', user.uid));
                const userData = userDoc.data();
                dispatch(setAuth ({
                    user: {uid:user.uid, email: user.email},
                    role: userData?.role || 'user'
                }));
            } else {
                dispatch(clearAuth());
            }
        });
    })

    return() => unsubscribe();
}, [dispatch]);

    return (
        <AuthContext.Provider value={{}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);