import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    user : null,
    role : null, 
    loading : true,
};

const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers : {
        setAuth: (state, action) => {
            state.user = action.payload.user;
            state.role = action.payload.role;
            state.loading = false;
        },
        logout: (state) => {
            state.user = null;
            state.role = null;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    },
});

export const {setAuth, logout, setLoading} = authSlice.actions;
export default authSlice.reducer;