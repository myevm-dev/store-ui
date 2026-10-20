import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppList, Button, PageLayout } from ".";
import { AppStrings } from "../app/strings";
import { getApp } from "../features/app/app_slice";
import { customToMerokuCategory } from "../features/categories";
import { useGetCategoryListQuery, useGetInfiniteDappListQuery } from "../features/dapp/dapp_api";
import type { Dapp } from "../features/dapp/models/dapp";

const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export default function Catalog({ title, all = false }: { title?: string; all?: boolean }) {
    const router = useRouter();
    const app = useSelector(getApp);
    const category = all ? undefined : first(router.query.categories || router.query.category);
    const subCategory = all ? undefined : first(router.query.subCategory);
    const search = all ? undefined : first(router.query.search);
    const categories = useGetCategoryListQuery();
    const mapped = customToMerokuCategory(category, categories.data, subCategory);
    const key = JSON.stringify([app.chainId, category, subCategory, search]);
    const [pagination, setPagination] = useState({ key, page: 1 });
    const page = pagination.key === key ? pagination.page : 1;
    useEffect(() => { setPagination({ key, page: 1 }); }, [key]);
    const [loaded, setLoaded] = useState<{ key: string; page: number; items: Dapp[] }>({
        key, page: 0, items: [],
    });
    const { currentData, isFetching, isError } = useGetInfiniteDappListQuery({
        page, limit: 8, chainId: app.chainId, search,
        categories: mapped.category, subCategory: mapped.subCategory,
    }, { skip: !router.isReady || !categories.data });

    useEffect(() => {
        if (!currentData) return;
        setLoaded(previous => {
            const existing = previous.key === key && page > 1 ? previous.items : [];
            const unique = new Map(existing.map(item => [item.dappId, item]));
            currentData.response.forEach(item => unique.set(item.dappId, item));
            return { key, page, items: Array.from(unique.values()) };
        });
    }, [currentData, key, page]);

    const items = loaded.key === key ? loaded.items : [];
    const canLoadMore = !isFetching && loaded.key === key && loaded.page === page
        && page < (currentData?.pageCount || 0);

    useEffect(() => {
        const onScroll = () => {
            if (canLoadMore && window.innerHeight + window.scrollY + window.innerHeight / 3 >= document.body.offsetHeight) {
                setPagination({ key, page: page + 1 });
            }
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [canLoadMore, key, page]);

    const loading = !router.isReady || categories.isLoading || isFetching || (!currentData && !isError);
    return (
        <PageLayout>
            <h1 className="text-[24px] leading-[32px] lg:text-4xl mb-8 capitalize">
                {title || category || AppStrings.allDapps}
            </h1>
            {subCategory && <h2 className="text-[20px] leading-[28px] mb-8 capitalize">{subCategory}</h2>}
            {items.length > 0 && <AppList data={items} />}
            {!loading && !isError && items.length === 0 && <p className="text-secondary-text-color py-8">No sample apps match these filters.</p>}
            {isError && <p className="py-8">Unable to load the catalog. Please reload the page.</p>}
            {loading && <div className="grid gap-8 grid-cols-1 md:grid-cols-2 3xl:grid-cols-3 mt-8">
                {Array.from({ length: items.length ? 4 : 8 }, (_, index) => <div key={index} className="shimmer w-full h-[160px] rounded-lg" />)}
            </div>}
            {canLoadMore && <div className="py-8 text-center">
                <Button onClick={() => setPagination({ key, page: page + 1 })}>Load more</Button>
            </div>}
        </PageLayout>
    );
}
