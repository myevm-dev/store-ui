import { api } from '../../api/api';
import demoApps from '../../data/demo-apps.json';
import type { PagedResponse, CategoryListResponse } from '../../models/response';
import type { Dapp } from './models/dapp';
import type { Review } from './models/review';
import { categories } from './custom_categories';

export interface CatalogRequest {
    page: number;
    limit: number;
    search?: string;
    categories?: string | string[];
    subCategory?: string | string[];
    chainId?: number | null;
}

const dappApi = api.injectEndpoints({
    endpoints: (build) => ({
        getDappList: build.query<PagedResponse<Dapp>, CatalogRequest>({
            query: (params) => ({ url: 'dapp', params }),
        }),
        getInfiniteDappList: build.query<PagedResponse<Dapp>, CatalogRequest>({
            query: (params) => ({ url: 'dapp', params }),
        }),
        getCategoryList: build.query<CategoryListResponse, { chainId?: number | null } | void>({
            query: () => 'dapp/categories',
        }),
        getFeaturedDapps: build.query<Dapp[], void>({
            queryFn: () => ({ data: demoApps.slice(0, 6) }),
        }),
        getAppRating: build.query<{ data: Review[] }, string>({
            query: (id) => 'dapp/rate/' + encodeURIComponent(id),
        }),
    }),
});

export const {
    useGetDappListQuery,
    useGetInfiniteDappListQuery,
    useGetCategoryListQuery,
    useGetFeaturedDappsQuery,
    useGetAppRatingQuery,
} = dappApi;

export const getPolygonCategoryList = () => categories;
