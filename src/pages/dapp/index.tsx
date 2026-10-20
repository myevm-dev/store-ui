import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, ExpandAbleText, RImage as Image, PageLayout } from "../../components";
import { ReviewCard } from "../../components/card";
import { Row } from "../../components/layout/flex";
import { StarRating } from "../../components/star_rating";
import { merokuToCustomCategory } from "../../features/categories";
import { useGetAppRatingQuery } from "../../features/dapp/dapp_api";
import { useSearchByIdQuery } from "../../features/search";
import { rememberApp } from "../../lib/history";
import { AppStrings } from "../../app/strings";

function Divider(props) {
	return <div className="h-[1px] bg-[#2D2C33]" />;
}


function DappDetailSection(props) {
	return (
		<section className="my-6">
			{props.title && (
				<h1 className="text-[24px] leading-[32px] font-[500] mb-4">
					{props.title}
				</h1>
			)}
			{props.children}
		</section>
	);
}

function DownloadButton() {
    return (
        <button disabled className="p-4 text-[#525059]" title="Downloads are disabled for sample apps" aria-label="Download unavailable">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 15V3M12 15L7 10M12 15L17 10M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
    );
}

function AppRatingList(props) {
	const { data, isLoading, isFetching } = useGetAppRatingQuery(props.id);
	const dApp = props.dapp;

	if (isLoading || isFetching) return null;
	return (
		<>
			<Row className="justify-between items-center py-[24px]">
				<h1 className="text-[24px] leading-[32px] font-[500]">
					{AppStrings.reviewsTitle}
				</h1>
				<button
					className="flex items-center gap-x-[8px] text-transparent bg-clip-text bg-gradient-to-b from-[#8A46FF] to-[#6E38CC] font-bold text-[14px] leading-[18px]"
					disabled title="Review submissions are disabled in this UI preview"
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
							stroke="url(#paint0_linear_1089_2333)"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<defs>
							<linearGradient
								id="paint0_linear_1089_2333"
								x1="12.0607"
								y1="1.87869"
								x2="12.0607"
								y2="22"
								gradientUnits="userSpaceOnUse"
							>
								<stop stopColor="#8A46FF" />
								<stop offset="1" stopColor="#6E38CC" />
							</linearGradient>
						</defs>
					</svg>
					Add review
				</button>
			</Row>

			<Row className="gap-x-[18px] ">
				<p className="text-[24px] leading-[28px] font-[600]">
					{Math.round((dApp?.metrics?.rating ?? 0) * 10) / 10}
				</p>
				<StarRating
					rating={Math.round((dApp?.metrics?.rating ?? 0) * 10) / 10}
				/>
			</Row>
			<small className="text-[14px] leading-[34px] font-[500] text-[#87868C]">
				{dApp?.metrics?.ratingsCount ?? 0} Ratings
			</small>
			<Row className="gap-x-[16px] items-stretch ">
				{(data?.data ?? []).slice(0, 2).map((review) => (
					<ReviewCard key={review.userId || review.dappId} review={review} />
				))}
			</Row>
			{!!(data?.data ?? []).length && (
				<Row className="justify-end my-[16px]">
					<Link
						className="text-transparent bg-clip-text bg-gradient-to-b from-[#8A46FF] to-[#6E38CC] font-bold text-[14px] leading-[18px]"
						href={`dapp/reviews/?id=${props.id}`}
					>
						View More
					</Link>
				</Row>
			)}
			<p className="text-sm text-[#87868C] my-4">No reviews. This is a read-only sample listing.</p>
			<Divider />
		</>
	);
}


function DappList() {
    const router = useRouter();
    const id = typeof router.query.id === "string" ? router.query.id : "";
    const { data, isLoading, isFetching, isError } = useSearchByIdQuery(id, {
        skip: !router.isReady || !id,
    });
    const dApp = data?.data[0];
    const [shareUrl, setShareUrl] = useState("");

    useEffect(() => {
        if (dApp) rememberApp(dApp.dappId);
        setShareUrl(window.location.href);
    }, [dApp, router.asPath]);

    if (!router.isReady || isLoading || isFetching) {
        return <PageLayout><div className="shimmer w-full h-[400px] rounded-lg" /></PageLayout>;
    }
    if (isError || !dApp) {
        return <PageLayout><h1 className="text-2xl mb-4">App not found</h1>
            <Link href="/">Back to all dApps</Link></PageLayout>;
    }
    const viewLink = dApp.appUrl;
    const canVisit = /^https?:\/\//.test(viewLink);
    const customCategory = merokuToCustomCategory(dApp.category, dApp.subCategory).category;

	return (
		<PageLayout>
			<div className="flex flex-col">
				<div className="mb-6 cursor-pointer" onClick={router.back}>
					<svg
						className="inline-block mr-2"
						width="24"
						height="24"
						viewBox="0 0 25 26"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M12 19.5001L5 12.5001M5 12.5001L12 5.50012M5 12.5001H19"
							stroke="#E2E1E6"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					<span className="text-2xl">{AppStrings.allDapps}</span>
				</div>
				{dApp.images.banner && (
					<div className="z-0 relative top-[16px] lg:top-[48px] w-full h-[200px] lg:h-[400px]">
						<Image
							src={dApp.images.banner}
							placeholder={
								"/assets/images/banner_placeholder.png"
							}
							fill={true}
							alt="DApp Banner"
							className="aspect-video	rounded-lg object-cover	"
						/>
					</div>
				)}
				<section>
					<header className="z-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4 px-[8px] lg:px-[16px]">
						<div className="flex-auto flex flex-row items-end  gap-[16px] pl-[8px] md:pl-0">
							<div className="relative bg-canvas-color flex-initial rounded-2xl w-[74px relative] w-[64px] h-[64px] lg:w-[132px] lg:h-[132px]">
								<Image
									sizes="(max-width: 768px) 100vw,
                                          (max-width: 1200px) 50vw,
                                          33vw"
									style={{ aspectRatio: 1 }}
									fill={true}
									src={dApp.images.logo}
									className="rounded-lg w-[64px] lg:w-[64px] "
									alt=""
								/>
							</div>
							<div className="flex-auto  pt-4">
								<p className="text-[12px] leading-[16px] md:text-[16px] md:leading-[20px] uppercase my-2">
									{customCategory}
								</p>
								<p className="text-[16px] leading-[20px] md:text-[32px] md:leading-[38px] font-[600] line-clamp-1">
									{dApp.name}
								</p>
							</div>
						</div>
						<div className="flex-initial flex">
							<Button
								as={canVisit ? "a" : "button"}
                                disabled={!canVisit}
                                title={canVisit ? "Visit app" : "Fictional sample app"}
                                rel="noopener noreferrer"
								className="flex flex-grow justify-center"
								target="_blank"
								href={canVisit ? viewLink : undefined}
							>
								<div className="text-[12px] mx-2 lg:text-[14px] font-[500]">
									{canVisit ? AppStrings.visitDapp : "Demo listing"}
								</div>
								<svg
									className="mx-2 w-[16px] hover:text-black"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M7 17L17 7M17 7V17M17 7H7"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</Button>

							<a
								target="_blank"
								href={'https://twitter.com/intent/tweet?text=' + encodeURIComponent('Explore this UI preview: ' + shareUrl)}
                                rel="noopener noreferrer"
								className="p-4 font-[600] text-[14px]"
							>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M8.59003 13.51L15.42 17.49M15.41 6.51001L8.59003 10.49M21 5C21 6.65685 19.6569 8 18 8C16.3431 8 15 6.65685 15 5C15 3.34315 16.3431 2 18 2C19.6569 2 21 3.34315 21 5ZM9 12C9 13.6569 7.65685 15 6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12ZM21 19C21 20.6569 19.6569 22 18 22C16.3431 22 15 20.6569 15 19C15 17.3431 16.3431 16 18 16C19.6569 16 21 17.3431 21 19Z"
										stroke="#E2E1E6"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</a>

							<DownloadButton />
						</div>
					</header>
					<DappDetailSection title={AppStrings.about}>
						<ExpandAbleText maxCharacters={320} maxLines={3}>
							{dApp.description}
						</ExpandAbleText>
					</DappDetailSection>
					<Divider />
					<AppRatingList
						id={dApp.dappId}
						dapp={dApp}
					/>
					{Boolean(dApp.images.screenshots?.length) && (
						<>
							<DappDetailSection title={AppStrings.gallery}>
								<div className="grid grid-cols-3 gap-4">
									{dApp.images.screenshots?.map((e, idx) => (
										<img
											key={idx}
											src={e || ""}
											alt="DApp Screenshot"
										/>
									))}
								</div>
							</DappDetailSection>
							<Divider />
						</>
					)}

				</section>
			</div>
		</PageLayout>
	);
}

export default DappList;
