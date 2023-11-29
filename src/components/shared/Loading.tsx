export function Loading() {
	return (
		<div className="flex h-full items-center justify-center">
			<svg
				viewBox="0 0 100 100"
				xmlns="http://www.w3.org/2000/svg"
				className="rotate-180 transform animate-[spin_5s_linear_infinite]"
			>
				<path
					id="circlePath"
					fill="none"
					// d={`
					// 	M (CENTER_X - RADIUS), (CENTER_Y)
					// 	a RADIUS, RADIUS 0 1, 1 (2 * RADIUS), 0
					// 	RADIUS, RADIUS 0 1, 1 (-2 * RADIUS), 0
					// `}

					d="
							M 30, 50
							a 20, 20 0 1, 1 40,0
							20, 20 0 1, 1 -40,0
						"
				/>
				<text>
					<textPath
						href="#circlePath"
						className="flex justify-evenly fill-brand-500 text-[5.55px]"
					>
						Buscando mis notas · Buscando mis notas ·
					</textPath>
				</text>
			</svg>
		</div>
	);
}
