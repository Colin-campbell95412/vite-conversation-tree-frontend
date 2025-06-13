import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // Uses localStorage
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import { combineReducers } from "redux";
import userReducer from "./reducers/userSlice";
import subscriptionReducer from "./reducers/subscriptionSlice"
import adminReducer from "./reducers/adminSlice";

// Persist configuration
const persistConfig = {
    key: "root",
    storage, // Stores in localStorage
    // transforms: [functionTransform],
};


// Combine reducers before persisting
const rootReducer = combineReducers({
    admin: adminReducer,
    user: userReducer,
    subscription: subscriptionReducer,
});

// Apply persistence to the reducers
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            },
        }),
});

// Create a persistor
export const persistor = persistStore(store);
export default store;