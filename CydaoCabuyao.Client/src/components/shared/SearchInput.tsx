import { Search } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
	containerClassName?: string;
}

/** Search input with a leading search icon. */
export function SearchInput({ containerClassName = '', className = '', ...rest }: SearchInputProps) {
	return (
		<div className={`relative ${containerClassName}`}>
			<Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa] pointer-events-none" />
			<input
				type="text"
				className={`w-full pl-8 pr-3 py-2 border border-[#e0e0e0] text-[11px] font-['Instrument_Sans'] text-[#0d0d0d] placeholder:text-[#aaaaaa] focus:outline-none focus:border-[#0d0d0d] transition-colors bg-white ${className}`}
				{...rest}
			/>
		</div>
	);
}
