interface EmptyStateProps {
	/** "table" = centered in a short container, "page" = centered with large display text */
	variant?: 'table' | 'page';
	title?: string;
	subtitle?: string;
}

/**
 * Empty / no-results state.
 * - `table`: small, fits inside a table area (h-40 centered)
 * - `page`: large, for full-page empty states (py-24 centered)
 */
export function EmptyState({
	variant = 'table',
	title = 'No results found',
	subtitle,
}: EmptyStateProps) {
	if (variant === 'table') {
		return (
			<div className="flex items-center justify-center h-40">
				<p className="text-sm text-[#aaaaaa] font-['Instrument_Sans']">{title}</p>
			</div>
		);
	}

	return (
		<div className="py-24 text-center">
			<p className="font-['Syne'] font-bold text-2xl text-[#e0e0e0] mb-2">{title}</p>
			{subtitle && <p className="text-sm text-[#aaa] font-['Instrument_Sans']">{subtitle}</p>}
		</div>
	);
}
