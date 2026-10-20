import localFont from "next/font/local";

export const generalSans = localFont({
	src: [
		{
			path: "../../public/assets/fonts/GeneralSans/GeneralSans-Regular.ttf",
			weight: "400",
			style: "normal",
		},
		{
			path: "../../public/assets/fonts/GeneralSans/GeneralSans-Medium.ttf",
			weight: "500",
			style: "normal",
		},
		{
			path: "../../public/assets/fonts/GeneralSans/GeneralSans-Bold.ttf",
			weight: "800",
			style: "normal",
		},
	],
	display: "swap",
	fallback: ["system-ui"],
	variable: "--font-sans",
});

// Keep tag typography local; no Google Fonts request is needed to build.
export const spaceMono = { className: "font-mono" };
