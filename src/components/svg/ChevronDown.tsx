import { IconProps } from "@/types/icon"

export default function ChevronDown({
	width = 14,
	height = 14,
	color = "black",
	className
}: IconProps) {
	return (
		<svg width={width} height={height} className={className} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M12.5994 4.1998L6.99941 9.79981L1.39941 4.19981" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}
