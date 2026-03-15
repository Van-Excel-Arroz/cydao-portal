import type { ReactNode } from 'react';

interface Column {
	label: string;
	center?: boolean;
}

interface DataTableProps {
	/** Column header definitions */
	columns: Column[];
	/** Tailwind grid-cols class, e.g. "grid-cols-[2fr_1fr_1fr_1fr]" */
	colsClass: string;
	/** Table rows as children — each row should use the same colsClass */
	children: ReactNode;
	/** Footer content (count text, etc.) */
	footer?: ReactNode;
	/** When true, shows the empty message instead of children */
	empty?: boolean;
	/** Message to show when empty */
	emptyMessage?: string;
}

/**
 * Reusable data table shell.
 * Provides the outer border, sticky header, scrollable rows, and footer.
 * Each row must be passed as a child and should use the same `colsClass` grid template.
 */
export function DataTable({ columns, colsClass, children, footer, empty, emptyMessage = 'No results.' }: DataTableProps) {
	return (
		<div className="flex-1 flex flex-col min-h-0 bg-white border border-[#e0e0e0]">
			<div className="flex-1 overflow-y-scroll">
				{/* Sticky header */}
				<div className={`sticky top-0 z-10 grid ${colsClass} border-b border-[#e0e0e0] bg-[#fafafa]`}>
					{columns.map(col => (
						<div
							key={col.label}
							className={`px-5 py-3 text-[10px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-[#aaaaaa] ${col.center ? 'text-center' : ''}`}
						>
							{col.label}
						</div>
					))}
				</div>

				{/* Empty state */}
				{empty ? (
					<div className="flex items-center justify-center h-40">
						<p className="text-sm text-[#aaaaaa] font-['Instrument_Sans']">{emptyMessage}</p>
					</div>
				) : (
					children
				)}
			</div>

			{/* Footer */}
			{footer !== undefined && (
				<div className="shrink-0 border-t border-[#e0e0e0] px-5 py-2.5 bg-[#fafafa]">
					<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans']">{footer}</p>
				</div>
			)}
		</div>
	);
}

/** Helper: class for a data row. Pass `index` for alternating backgrounds. */
export function tableRowClass(index: number, extra = '') {
	return `border-b border-[#f5f5f5] last:border-0 ${index % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'} ${extra}`;
}
