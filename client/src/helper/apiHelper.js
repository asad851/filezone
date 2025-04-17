import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Use env var or fallback to local
export const API_URL = import.meta.env.API_URL || "http://localhost:5022";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["Users"], // Cache 'Users' data
    }),
    postLogin: builder.mutation({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Users"], // Invalidate cache of 'Users' when login happens
    }),
  }),
});
