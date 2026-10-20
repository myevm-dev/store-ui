import { api } from '../../api/api';
import type { PagedResponse } from '../../models/response';
import type { Dapp } from '../dapp/models/dapp';

const searchApi = api.injectEndpoints({
    endpoints: (build) => ({
        searchById: build.query<PagedResponse<Dapp>, string>({
            query: (id) => 'dapp/search/' + encodeURIComponent(id),
        }),
        searchByPackageId: build.query<PagedResponse<Dapp>, string[]>({
            query: (packages) => ({ url: 'dapp/queryWithPackageId', params: { packages: packages.join(',') } }),
        }),
    }),
});

export const { useSearchByIdQuery, useSearchByPackageIdQuery } = searchApi;
