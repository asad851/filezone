import { API_URL } from "@/helper/apiHelper";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
const token = Cookies.get("token");
export const fileFolderApi = createApi({
  reducerPath: "",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: "include",
    mode: "cors",
    prepareHeaders: (headers) => {
      const token = Cookies.get("token");
      if (token) {
        headers.set("Authorization", `${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSegment: builder.query({
      query: () => ({
        url: "/segment/get",
        method: "GET",
      }),
      providesTags: ["Segment"],
    }),
    postCreateSegment: builder.mutation({
      query: (data) => ({
        url: "/segment/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Segment"],
    }),
    updateSegment: builder.mutation({
      query: ({ data, id }) => ({
        url: `/segment/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Segment"],
    }),
    deleteSegment: builder.mutation({
      query: (id) => ({
        url: `/segment/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Segment"],
    }),
    getUploadUrls: builder.mutation({
      query: (files) => ({
        url: "users/get-upload-urls",
        method: "POST",
        body: files.map((file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
        })),
      }),
    }),
    
    postAvatar: builder.mutation({
      query: (avatar) => ({
        url: "/users/update-avatar",
        method: "POST",
        body: { avatar },
      }),
    }),
  }),
});

export const {
  usePostCreateSegmentMutation,
  useGetSegmentQuery,
  useUpdateSegmentMutation,
  useDeleteSegmentMutation,
  useGetUploadUrlsMutation,
  usePostAvatarMutation,
} = fileFolderApi;
