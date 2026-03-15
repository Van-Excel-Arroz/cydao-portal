import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

const LABEL_CLASS = "text-[11px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-[#0d0d0d]";
export const INPUT_CLASS =
	"border border-[#e0e0e0] px-3 py-2.5 text-sm font-['Instrument_Sans'] text-[#0d0d0d] placeholder:text-[#aaaaaa] focus:outline-none focus:border-[#0d0d0d] transition-colors bg-white w-full";

// ─── Wrapper ──────────────────────────────────────────────────────────────────

interface FormFieldProps {
	label: string;
	error?: string;
	children: ReactNode;
}

/** Wraps a label, input/select/textarea, and optional error message. */
export function FormField({ label, error, children }: FormFieldProps) {
	return (
		<div className="flex flex-col gap-1.5">
			<label className={LABEL_CLASS}>{label}</label>
			{children}
			{error && <p className="text-xs text-[#d42b2b] font-['Instrument_Sans']">{error}</p>}
		</div>
	);
}

// ─── Input ────────────────────────────────────────────────────────────────────

type FieldInputProps = InputHTMLAttributes<HTMLInputElement>;

export function FieldInput({ className = '', ...rest }: FieldInputProps) {
	return <input className={`${INPUT_CLASS} ${className}`} {...rest} />;
}

// ─── Textarea ─────────────────────────────────────────────────────────────────

type FieldTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function FieldTextarea({ className = '', ...rest }: FieldTextareaProps) {
	return <textarea className={`${INPUT_CLASS} resize-none ${className}`} {...rest} />;
}

// ─── Select ───────────────────────────────────────────────────────────────────

type FieldSelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function FieldSelect({ className = '', children, ...rest }: FieldSelectProps) {
	return (
		<select className={`${INPUT_CLASS} cursor-pointer ${className}`} {...rest}>
			{children}
		</select>
	);
}
