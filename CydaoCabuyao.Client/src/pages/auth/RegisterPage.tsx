import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { BARANGAY_LABELS } from '@/types';
import type { RegisterDto } from '@/types';

const registerSchema = z
	.object({
		firstName: z.string().min(2, 'First name must be at least 2 characters'),
		lastName: z.string().min(2, 'Last name must be at least 2 characters'),
		email: z.email('Enter a valid email address'),
		password: z.string().min(8, 'Password must be at least 8 characters'),
		confirmPassword: z.string(),
		mobileNumber: z.string().min(10, 'Enter a valid mobile number').max(15),
		dateOfBirth: z.string().min(1, 'Date of birth is required'),
		barangay: z.number().int(),
	})
	.refine(d => d.password === d.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	});

type RegisterFormData = z.infer<typeof registerSchema>;

const inputClass =
	"border border-[#e0e0e0] px-4 py-3 text-sm font-['Instrument_Sans'] text-[#0d0d0d] placeholder:text-[#aaaaaa] focus:outline-none focus:border-[#0d0d0d] transition-colors bg-white";

const labelClass = "text-[11px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-[#0d0d0d]";

const errorClass = "text-xs text-[#d42b2b] font-['Instrument_Sans']";

const barangayOptions = Object.entries(BARANGAY_LABELS).map(([value, label]) => ({
	value: Number(value),
	label,
}));

export default function RegisterPage() {
	const navigate = useNavigate();
	const { token } = useAuthStore();
	const [serverError, setServerError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
	});

	if (token) {
		return <Navigate to="/youth/profile" replace />;
	}

	async function onSubmit(data: RegisterFormData) {
		setServerError(null);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { confirmPassword: _confirm, ...registerData } = data;
		try {
			await api.post('/users', registerData as RegisterDto);
			navigate('/login');
		} catch (err: unknown) {
			const message =
				err instanceof Error && 'response' in err
					? (err as { response?: { data?: { message?: string } } }).response?.data?.message
					: undefined;
			setServerError(message ?? 'Registration failed. Please try again.');
		}
	}

	return (
		<div className="bg-white">
			{/* Header band */}
			<div className="bg-[#0d0d0d] px-6 py-16">
				<div className="max-w-4xl mx-auto">
					<p className="text-[11px] font-bold tracking-[3px] uppercase font-['Instrument_Sans'] text-white/40">
						Create Account
					</p>
					<h1 className="mt-4 font-['Syne'] font-black text-5xl md:text-6xl text-white leading-[1.05]">
						Join the CYDAO
						<br />
						Community.
					</h1>
					<p className="mt-5 font-['Instrument_Sans'] text-sm text-white/60 max-w-sm leading-relaxed">
						Register to apply for youth programs, join events, and stay connected with CYDAO Cabuyao.
					</p>
				</div>
			</div>

			{/* Form section */}
			<div className="max-w-4xl mx-auto px-6 py-16">
				<p className="font-['Instrument_Sans'] text-sm text-[#aaaaaa]">
					Already have an account?{' '}
					<Link to="/login" className="text-[#d42b2b] font-semibold hover:underline ml-2">
						Sign in here
					</Link>
				</p>

				<form onSubmit={handleSubmit(onSubmit)} className="mt-10">
					{serverError && (
						<div className="mb-8 border border-[#d42b2b] bg-[#d42b2b]/5 px-4 py-3 text-sm text-[#d42b2b] font-['Instrument_Sans']">
							{serverError}
						</div>
					)}

					{/* Personal information section */}
					<div className="flex items-center gap-4 mb-8">
						<span className="text-[11px] font-bold tracking-[3px] uppercase font-['Instrument_Sans'] text-[#aaaaaa] shrink-0">
							Personal Information
						</span>
						<div className="flex-1 h-px bg-[#e0e0e0]" />
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="flex flex-col gap-1.5">
							<label className={labelClass}>First Name</label>
							<input
								{...register('firstName')}
								type="text"
								autoComplete="given-name"
								placeholder="Juan"
								className={inputClass}
							/>
							{errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
						</div>

						<div className="flex flex-col gap-1.5">
							<label className={labelClass}>Last Name</label>
							<input
								{...register('lastName')}
								type="text"
								autoComplete="family-name"
								placeholder="dela Cruz"
								className={inputClass}
							/>
							{errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
						</div>

						<div className="flex flex-col gap-1.5">
							<label className={labelClass}>Mobile Number</label>
							<input
								{...register('mobileNumber')}
								type="tel"
								autoComplete="tel"
								placeholder="09XXXXXXXXX"
								className={inputClass}
							/>
							{errors.mobileNumber && <p className={errorClass}>{errors.mobileNumber.message}</p>}
						</div>

						<div className="flex flex-col gap-1.5">
							<label className={labelClass}>Date of Birth</label>
							<input {...register('dateOfBirth')} type="date" className={inputClass} />
							{errors.dateOfBirth && <p className={errorClass}>{errors.dateOfBirth.message}</p>}
						</div>

						<div className="flex flex-col gap-1.5 md:col-span-2">
							<label className={labelClass}>Barangay</label>
							<select
								{...register('barangay', { valueAsNumber: true })}
								defaultValue=""
								className={inputClass + ' appearance-none cursor-pointer'}
							>
								<option value="" disabled>
									Select your barangay
								</option>
								{barangayOptions.map(({ value, label }) => (
									<option key={value} value={value}>
										{label}
									</option>
								))}
							</select>
							{errors.barangay && <p className={errorClass}>{errors.barangay.message}</p>}
						</div>
					</div>

					{/* Account credentials section */}
					<div className="flex items-center gap-4 mt-12 mb-8">
						<span className="text-[11px] font-bold tracking-[3px] uppercase font-['Instrument_Sans'] text-[#aaaaaa] shrink-0">
							Account Credentials
						</span>
						<div className="flex-1 h-px bg-[#e0e0e0]" />
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="flex flex-col gap-1.5 md:col-span-2">
							<label className={labelClass}>Email Address</label>
							<input
								{...register('email')}
								type="email"
								autoComplete="email"
								placeholder="you@example.com"
								className={inputClass}
							/>
							{errors.email && <p className={errorClass}>{errors.email.message}</p>}
						</div>

						<div className="flex flex-col gap-1.5">
							<label className={labelClass}>Password</label>
							<input
								{...register('password')}
								type="password"
								autoComplete="new-password"
								placeholder="Minimum 8 characters"
								className={inputClass}
							/>
							{errors.password && <p className={errorClass}>{errors.password.message}</p>}
						</div>

						<div className="flex flex-col gap-1.5">
							<label className={labelClass}>Confirm Password</label>
							<input
								{...register('confirmPassword')}
								type="password"
								autoComplete="new-password"
								placeholder="Repeat your password"
								className={inputClass}
							/>
							{errors.confirmPassword && <p className={errorClass}>{errors.confirmPassword.message}</p>}
						</div>
					</div>

					{/* Submit row */}
					<div className="mt-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-t border-[#e0e0e0] pt-8">
						<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans']">
							By registering, you agree to CYDAO Cabuyao's terms of use.
						</p>
						<button
							type="submit"
							disabled={isSubmitting}
							className="bg-[#d42b2b] text-white text-[11px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] px-10 py-4 flex items-center justify-center gap-2 hover:bg-[#b82424] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
						>
							{isSubmitting ? (
								'Creating Account...'
							) : (
								<>
									Create Account <ArrowRight size={14} />
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
