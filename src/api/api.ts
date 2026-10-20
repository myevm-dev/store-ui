import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { queryDemo } from './demo';

const localQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
    async (args) => queryDemo(args);

export const api = createApi({
    baseQuery: localQuery,
    endpoints: () => ({}),
});
