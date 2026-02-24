import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { jsonPlaceholderApi } from "./services/jsonPlaceholderApi"
import { authApi } from "./services/authAPI";

export const store = configureStore({
    reducer: {
        [jsonPlaceholderApi.reducerPath]: jsonPlaceholderApi.reducer,
        [authApi.reducerPath]: authApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
        jsonPlaceholderApi.middleware,
        authApi.middleware
    )
});

setupListeners(store.dispatch);