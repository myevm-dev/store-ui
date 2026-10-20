import { AppList, PageLayout } from "@/components";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getApp } from "../../features/app/app_slice";
import { Dapp } from "../../features/dapp/models/dapp";
import { AppStrings } from "../../app/strings";
import { readHistory } from "../../lib/history";

export default function HistoryPage(props) {
    const app = useSelector(getApp);
    const [history, setHistory] = useState<Dapp[]>([]);

    useEffect(() => { setHistory(readHistory()); }, []);
    return (
        <PageLayout>
            <h1 className="text-4xl mb-8 capitalize">
                {AppStrings.browsingHistory}
            </h1>
            {props.subtitle && (
                <h2 className="text-[20px] leading-[28px]  mb-8 capitalize">
                    {"props.subtitle"}
                </h2>
            )}
            <AppList
                data={history.filter((dapp) => app.chainId == null || dapp.chains.includes(app.chainId))}
            />
        </PageLayout>
    );
}
