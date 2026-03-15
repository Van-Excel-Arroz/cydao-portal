interface Option<T extends string> {
	label: string;
	value: T;
}

interface SegmentedControlProps<T extends string> {
	options: Option<T>[];
	value: T;
	onChange: (value: T) => void;
	className?: string;
}

/**
 * Flat segmented button group (All / Open / Closed style filter).
 * Active segment = dark fill; inactive = white with hover.
 */
export function SegmentedControl<T extends string>({
	options,
	value,
	onChange,
	className = '',
}: SegmentedControlProps<T>) {
	return (
		<div className={`flex border border-[#e0e0e0] ${className}`}>
			{options.map(opt => (
				<button
					key={opt.value}
					onClick={() => onChange(opt.value)}
					className={`px-3 py-2 text-[11px] font-bold uppercase tracking-[1px] font-['Instrument_Sans'] transition-colors cursor-pointer ${
						value === opt.value ? 'bg-[#0d0d0d] text-white' : 'bg-white text-[#555] hover:text-[#0d0d0d]'
					}`}
				>
					{opt.label}
				</button>
			))}
		</div>
	);
}
