import React from "react";

const Icon = ({ icon, size }) => {
	const getIcon = () => {
		switch (icon.toLowerCase()) {
			case "epic":
				return (
					<>
						<rect
							id="Rectangle-36"
							fill="#904EE2"
							x="0"
							y="0"
							width={size}
							height={size}
							rx="2"
						/>
						<g
							id="Page-1"
							transform="translate(4.000000, 3.000000)"
							fill="#FFFFFF"
						>
							<path
								d="M5.9233,3.7566 L5.9213,3.7526 C5.9673,3.6776 6.0003,3.5946 6.0003,3.4996 C6.0003,3.2236 5.7763,2.9996 5.5003,2.9996 L3.0003,2.9996 L3.0003,0.4996 C3.0003,0.2236 2.7763,-0.0004 2.5003,-0.0004 C2.3283,-0.0004 2.1853,0.0916 2.0953,0.2226 C2.0673,0.2636 2.0443,0.3056 2.0293,0.3526 L0.0813,4.2366 L0.0833,4.2396 C0.0353,4.3166 0.0003,4.4026 0.0003,4.4996 C0.0003,4.7766 0.2243,4.9996 0.5003,4.9996 L3.0003,4.9996 L3.0003,7.4996 C3.0003,7.7766 3.2243,7.9996 3.5003,7.9996 C3.6793,7.9996 3.8293,7.9006 3.9183,7.7586 L3.9213,7.7596 L3.9343,7.7336 C3.9453,7.7126 3.9573,7.6936 3.9653,7.6716 L5.9233,3.7566 Z"
								id="Fill-1"
							/>
						</g>
					</>
				);

			case "story":
				return (
					<>
						<rect
							id="Rectangle-36"
							fill="#63BA3C"
							x="0"
							y="0"
							width={size}
							height={size}
							rx="2"
						/>
						<path
							d="M9,3 L5,3 C4.448,3 4,3.448 4,4 L4,10.5 C4,10.776 4.224,11 4.5,11 C4.675,11 4.821,10.905 4.91,10.769 L4.914,10.77 L6.84,8.54 C6.92,8.434 7.08,8.434 7.16,8.54 L9.086,10.77 L9.09,10.769 C9.179,10.905 9.325,11 9.5,11 C9.776,11 10,10.776 10,10.5 L10,4 C10,3.448 9.552,3 9,3"
							id="Page-1"
							fill="#FFFFFF"
						/>
					</>
				);

			case "task":
				return (
					<>
						<rect
							id="Rectangle-36"
							fill="#4BADE8"
							x="0"
							y="0"
							width={size}
							height={size}
							rx="2"
						/>
						<g
							id="Page-1"
							transform="translate(4.000000, 4.500000)"
							stroke="#FFFFFF"
							strokeWidth="2"
							strokeLinecap="round"
						>
							<path d="M2,5 L6,0" id="Stroke-1" />
							<path d="M2,5 L0,3" id="Stroke-3" />
						</g>
					</>
				);

			case "bug":
				return (
					<>
						<rect
							id="Rectangle-36"
							fill="#E5493A"
							x="0"
							y="0"
							width={size}
							height={size}
							rx="2"
						/>
						<path
							d="M10,7 C10,8.657 8.657,10 7,10 C5.343,10 4,8.657 4,7 C4,5.343 5.343,4 7,4 C8.657,4 10,5.343 10,7"
							id="Fill-2"
							fill="#FFFFFF"
						/>
					</>
				);
			default:
				break;
		}
	};
	return (
		<svg width={size} height={size} viewBox="0 0 16 16" version="1.1">
			<defs />
			<g transform="translate(1.000000, 1.000000)">{getIcon()}</g>
		</svg>
	);
};

export default Icon;
