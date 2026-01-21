import { IconProps } from '@/types/icon';

export default function Save({
	className,
	width = 20,
	height = 20,
	color = 'black',
}: IconProps) {
	return (
		<svg width={width} height={height} className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M15.8337 17.5L10.0003 13.3333L4.16699 17.5V4.16667C4.16699 3.72464 4.34259 3.30072 4.65515 2.98816C4.96771 2.67559 5.39163 2.5 5.83366 2.5H14.167C14.609 2.5 15.0329 2.67559 15.3455 2.98816C15.6581 3.30072 15.8337 3.72464 15.8337 4.16667V17.5Z" stroke={color} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
		</svg>

	)
}
