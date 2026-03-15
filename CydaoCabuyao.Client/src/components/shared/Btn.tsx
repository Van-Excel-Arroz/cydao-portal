import type { ButtonHTMLAttributes, ReactNode } from 'react';

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'danger-outline' | 'icon';
type BtnSize = 'sm' | 'md' | 'lg';

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: BtnVariant;
	size?: BtnSize;
	children: ReactNode;
}

const VARIANT_CLASSES: Record<BtnVariant, string> = {
	primary:
		"bg-[#d42b2b] text-white font-bold uppercase tracking-[2px] font-['Instrument_Sans'] hover:bg-[#b82424] transition-colors",
	secondary:
		"border border-[#0d0d0d] text-[#0d0d0d] font-bold uppercase tracking-[2px] font-['Instrument_Sans'] hover:bg-[#0d0d0d] hover:text-white transition-colors",
	ghost:
		"text-[#aaaaaa] font-medium font-['Instrument_Sans'] hover:text-[#0d0d0d] transition-colors",
	danger:
		"bg-[#d42b2b] text-white font-bold uppercase tracking-[1px] font-['Instrument_Sans'] hover:bg-[#b82424] transition-colors",
	'danger-outline':
		"border border-[#d42b2b] text-[#d42b2b] font-bold uppercase tracking-[1px] font-['Instrument_Sans'] hover:bg-red-50 transition-colors",
	icon: "text-[#aaaaaa] hover:text-[#0d0d0d] transition-colors",
};

const SIZE_CLASSES: Record<BtnSize, string> = {
	sm: 'text-[10px] px-3 py-1.5',
	md: 'text-[11px] px-4 py-2',
	lg: 'text-[11px] px-6 py-2.5',
};

/**
 * Base button for the CYDAO portal.
 * - No rounded corners, flat design.
 * - `icon` variant: no padding, icon-only.
 * - Always has `cursor-pointer`.
 */
export function Btn({ variant = 'primary', size = 'md', className = '', children, ...rest }: BtnProps) {
	const sizeClass = variant === 'icon' ? '' : SIZE_CLASSES[size];
	return (
		<button className={`cursor-pointer ${VARIANT_CLASSES[variant]} ${sizeClass} ${className}`} {...rest}>
			{children}
		</button>
	);
}
