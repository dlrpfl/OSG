import { IconProps } from "@/types/icon"

export default function Speaker({
	width = 32,
	height = 32,
	color = "#F05C22",
	className
}: IconProps) {
	return (
		<svg width={width} height={height} className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M14.8692 6.74658L9.21188 11.2724H4.68604V18.0612H9.21188L14.8692 22.587V6.74658Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M24.0016 6.6665C26.1228 8.78831 27.3144 11.6657 27.3144 14.6659C27.3144 17.6662 26.1228 20.5436 24.0016 22.6654M20.0076 10.6606C21.0681 11.7215 21.664 13.1602 21.664 14.6603C21.664 16.1604 21.0681 17.5991 20.0076 18.66" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>

	)
}
