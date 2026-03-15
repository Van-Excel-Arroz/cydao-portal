import type { ReactNode } from 'react';
import { X } from 'lucide-react';

// ─── Overlay / container ──────────────────────────────────────────────────────

interface ModalProps {
	open: boolean;
	onClose: () => void;
	/** Tailwind max-width class, e.g. "max-w-lg" or "max-w-3xl". Defaults to "max-w-lg". */
	maxWidth?: string;
	/** Tailwind max-height class. Defaults to "max-h-[90vh]". */
	maxHeight?: string;
	children: ReactNode;
}

export function Modal({ open, onClose, maxWidth = 'max-w-lg', maxHeight = 'max-h-[90vh]', children }: ModalProps) {
	if (!open) return null;
	return (
		<div
			className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
			onClick={e => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div className={`bg-white w-full ${maxWidth} shadow-xl flex flex-col ${maxHeight}`}>{children}</div>
		</div>
	);
}

// ─── Cover image header (optional) ───────────────────────────────────────────

interface ModalCoverProps {
	src: string;
	alt: string;
	onClose: () => void;
	children?: ReactNode;
}

export function ModalCover({ src, alt, onClose, children }: ModalCoverProps) {
	return (
		<div className="relative h-36 shrink-0 overflow-hidden">
			<img src={src} alt={alt} className="w-full h-full object-cover" />
			<div className="absolute inset-0 bg-[#0d0d0d]/50" />
			<button onClick={onClose} className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors cursor-pointer">
				<X size={18} />
			</button>
			{children && <div className="absolute bottom-3 left-5 flex items-center gap-2">{children}</div>}
		</div>
	);
}

// ─── Header ───────────────────────────────────────────────────────────────────

interface ModalHeaderProps {
	title: string;
	eyebrow?: string;
	/** Show close button (use when there's no ModalCover) */
	onClose?: () => void;
	children?: ReactNode;
}

export function ModalHeader({ title, eyebrow, onClose, children }: ModalHeaderProps) {
	return (
		<div className="shrink-0 flex items-start justify-between px-6 py-4 border-b border-[#e0e0e0]">
			<div>
				{eyebrow && (
					<p className="text-[10px] font-bold tracking-[3px] uppercase font-['Instrument_Sans'] text-[#aaaaaa]">
						{eyebrow}
					</p>
				)}
				<h2 className="font-['Syne'] font-bold text-lg text-[#0d0d0d] leading-tight">{title}</h2>
				{children}
			</div>
			{onClose && (
				<button onClick={onClose} className="text-[#aaaaaa] hover:text-[#0d0d0d] transition-colors cursor-pointer mt-1">
					<X size={18} />
				</button>
			)}
		</div>
	);
}

// ─── Body ─────────────────────────────────────────────────────────────────────

interface ModalBodyProps {
	children: ReactNode;
	scroll?: boolean;
	className?: string;
}

export function ModalBody({ children, scroll = true, className = '' }: ModalBodyProps) {
	return (
		<div className={`${scroll ? 'flex-1 overflow-y-auto' : 'shrink-0'} px-6 py-5 ${className}`}>
			{children}
		</div>
	);
}

// ─── Footer ───────────────────────────────────────────────────────────────────

interface ModalFooterProps {
	children: ReactNode;
}

export function ModalFooter({ children }: ModalFooterProps) {
	return (
		<div className="shrink-0 flex items-center justify-between px-6 py-4 border-t border-[#e0e0e0]">
			{children}
		</div>
	);
}
