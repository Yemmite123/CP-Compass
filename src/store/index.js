import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { persistReducer, persistStore } from "redux-persist";
import storage from 'redux-persist/lib/storage';

import rootReducer from "./rootReducer";

let middlewares = [thunkMiddleware];

if(process.env.NODE_ENV !== "production") {
    middlewares = [...middlewares]
}

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["user"],
    keyPrefix: ""
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

// added this to be able to use redux dev tools in chrome
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
    persistedReducer,
    composeEnhancers(applyMiddleware(
        ...middlewares
    ))
);
export const persistor = persistStore(store);