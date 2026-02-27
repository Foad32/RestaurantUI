import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface IRegister {
    userName: string,
    phoneNumber: string,
    emailAddress?: string,
    password: string
};

interface ILogin {
    PhoneNumber?: string,
    EmailAddress?: string,
    Password: string
};

interface ILoginResponse {
    token: string
};

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/user` }),
    endpoints: (builder) => ({
        register: builder.mutation<void, IRegister>({
            query: (newUser: IRegister) => ({
                url: "register",
                method: "POST",
                body: newUser
            })
        }),
        login: builder.mutation<ILoginResponse, ILogin>({
            query: (user: ILogin) => ({
                url: "login",
                method: "POST",
                body: user
            })
        })
    })
});

export const { useRegisterMutation, useLoginMutation } = authApi;