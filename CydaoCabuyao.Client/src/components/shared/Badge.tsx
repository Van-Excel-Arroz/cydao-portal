import type { ProgramCategory, ApplicationStatus, AnnouncementCategory } from '@/types';
import { PROGRAM_CATEGORY_LABELS, APPLICATION_STATUS_LABELS, ANNOUNCEMENT_CATEGORY_LABELS } from '@/types';

interface BadgeProps {
	className?: string;
	children: React.ReactNode;
}

/** Generic badge — rectangular, uppercase, small tracking. Pass className for colors. */
export function Badge({ className = '', children }: BadgeProps) {
	return (
		<span
			className={`text-[9px] font-bold uppercase tracking-[2px] px-2 py-0.5 font-['Instrument_Sans'] border ${className}`}
		>
			{children}
		</span>
	);
}

// ─── Category badge ───────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<ProgramCategory, string> = {
	0: 'bg-blue-50 text-blue-700 border-blue-200',
	1: 'bg-green-50 text-green-700 border-green-200',
	2: 'bg-orange-50 text-orange-700 border-orange-200',
	3: 'bg-purple-50 text-purple-700 border-purple-200',
	4: 'bg-yellow-50 text-yellow-700 border-yellow-200',
	5: 'bg-pink-50 text-pink-700 border-pink-200',
	6: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

interface CategoryBadgeProps {
	category: ProgramCategory;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
	return <Badge className={CATEGORY_COLORS[category]}>{PROGRAM_CATEGORY_LABELS[category]}</Badge>;
}

// ─── Application status badge ─────────────────────────────────────────────────

const STATUS_COLORS: Record<ApplicationStatus, string> = {
	0: 'bg-[#f5f5f5] text-[#aaaaaa] border-[#e0e0e0]',
	1: 'bg-yellow-50 text-yellow-700 border-yellow-200',
	2: 'bg-green-50 text-green-700 border-green-200',
	3: 'bg-red-50 text-[#d42b2b] border-red-200',
};

interface StatusBadgeProps {
	status: ApplicationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
	return <Badge className={STATUS_COLORS[status]}>{APPLICATION_STATUS_LABELS[status]}</Badge>;
}

// ─── Open / Closed badge ──────────────────────────────────────────────────────

interface OpenBadgeProps {
	isOpen: boolean;
	/** "solid" = red fill (card thumbnails), "outline" = border only (modal badges) */
	variant?: 'solid' | 'outline';
}

export function OpenBadge({ isOpen, variant = 'solid' }: OpenBadgeProps) {
	const colors =
		variant === 'outline'
			? isOpen
				? 'text-[#d42b2b] border-[#d42b2b] bg-white'
				: 'text-[#555] border-[#e0e0e0] bg-white'
			: isOpen
				? 'bg-[#d42b2b] text-white border-[#d42b2b]'
				: 'bg-[#f5f5f5] text-[#aaaaaa] border-[#e0e0e0]';
	return <Badge className={colors}>{isOpen ? 'Open' : 'Closed'}</Badge>;
}

// ─── Announcement category badge ──────────────────────────────────────────────

const ANNOUNCEMENT_COLORS: Record<AnnouncementCategory, string> = {
	0: 'bg-[#d42b2b] text-white border-[#d42b2b]',
	1: 'bg-[#0d0d0d] text-white border-[#0d0d0d]',
	2: 'bg-[#f5f5f5] text-[#0d0d0d] border-[#e0e0e0]',
	3: 'bg-[#f5f5f5] text-[#0d0d0d] border-[#e0e0e0]',
};

interface AnnouncementBadgeProps {
	category: AnnouncementCategory;
}

export function AnnouncementBadge({ category }: AnnouncementBadgeProps) {
	return <Badge className={ANNOUNCEMENT_COLORS[category]}>{ANNOUNCEMENT_CATEGORY_LABELS[category]}</Badge>;
}
