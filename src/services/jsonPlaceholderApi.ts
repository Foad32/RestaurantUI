import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
}

interface NewPost {
    title: string;
    body: string;
    userId: number;
}

export const jsonPlaceholderApi = createApi({
    reducerPath: "jsonPlaceholderApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/` }),
    endpoints: (builder) => ({
        //Examples to use later
        // getPostsById: builder.query({ query: (id) => `posts/${id}` }),
        getPosts: builder.query<Post[], void>({ query: () => "posts" }),
        createPosts: builder.mutation<void, NewPost>({
            query: (newPost) => ({
                url: "posts",
                method: "POST",
                body: newPost
            })
        })
    })
});

export const { useGetPostsQuery, useCreatePostsMutation } = jsonPlaceholderApi;