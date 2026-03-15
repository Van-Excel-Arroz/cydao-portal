interface ToggleSwitchProps {
	checked: boolean;
	onChange: (checked: boolean) => void;
	disabled?: boolean;
}

/** Flat rectangular toggle switch matching the CYDAO editorial design. */
export function ToggleSwitch({ checked, onChange, disabled }: ToggleSwitchProps) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			disabled={disabled}
			onClick={() => onChange(!checked)}
			className={`relative w-11 h-6 transition-colors shrink-0 cursor-pointer ${
				checked ? 'bg-[#d42b2b]' : 'bg-[#e0e0e0]'
			} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
		>
			<span
				className={`absolute top-1 w-4 h-4 bg-white transition-all ${checked ? 'left-6' : 'left-1'}`}
			/>
		</button>
	);
}
