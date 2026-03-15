import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { UserRole } from '@/types';
import type { AuthResponse, User } from '@/types';

// --- Mock users for testing without a backend ---
const MOCK_USERS: Record<string, { password: string; user: User; token: string }> = {
	'youth@test.com': {
		password: 'password',
		token: 'mock-youth-token',
		user: {
			id: 1,
			firstName: 'Juan',
			lastName: 'dela Cruz',
			email: 'youth@test.com',
			mobileNumber: '09171234567',
			dateOfBirth: '2002-05-15',
			barangay: 7,
			role: UserRole.Youth,
			createdAt: '2026-01-01T00:00:00Z',
		},
	},
	'staff@test.com': {
		password: 'password',
		token: 'mock-staff-token',
		user: {
			id: 2,
			firstName: 'Maria',
			lastName: 'Santos',
			email: 'staff@test.com',
			mobileNumber: '09189876543',
			dateOfBirth: '1995-08-20',
			barangay: 12,
			role: UserRole.Staff,
			createdAt: '2026-01-01T00:00:00Z',
		},
	},
};

const loginSchema = z.object({
	email: z.string().email('Enter a valid email address'),
	password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const navigate = useNavigate();
	const { user, setAuth } = useAuthStore();
	const [serverError, setServerError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	if (user) {
		return <Navigate to={user.role === UserRole.Staff ? '/admin/programs' : '/youth/profile'} replace />;
	}

	async function onSubmit(data: LoginFormData) {
		setServerError(null);

		// Mock login — bypass API when using test credentials
		const mock = MOCK_USERS[data.email];
		if (mock && mock.password === data.password) {
			setAuth(mock.user, mock.token);
			navigate(mock.user.role === UserRole.Staff ? '/admin/programs' : '/youth/profile');
			return;
		}

		try {
			const res = await api.post<AuthResponse>('/auth/login', data);
			setAuth(res.data.user, res.data.token);
			navigate(res.data.user.role === UserRole.Staff ? '/admin/programs' : '/youth/profile');
		} catch (err: unknown) {
			const message =
				err instanceof Error && 'response' in err
					? (err as { response?: { data?: { message?: string } } }).response?.data?.message
					: undefined;
			setServerError(message ?? 'Invalid email or password.');
		}
	}

	return (
		<div className="min-h-[calc(100vh-64px)] grid md:grid-cols-[480px_1fr]">
			{/* Left — brand panel */}
			<div className="hidden md:flex flex-col justify-between bg-[#d42b2b] p-12 text-white">
				<div className="text-[11px] font-bold tracking-[3px] uppercase font-['Instrument_Sans'] text-white/50">
					Member Portal
				</div>
				<div>
					<h1 className="font-['Syne'] font-black text-6xl leading-[1.05] tracking-tight">
						Empowering
						<br />
						Cabuyao's
						<br />
						Youth.
					</h1>
					<div className="mt-10 h-px bg-white/25 w-full" />
					<p className="mt-6 font-['Instrument_Sans'] text-sm text-white/75 leading-relaxed max-w-xs">
						Sign in to access your programs, event registrations, and CYDAO activities.
					</p>
				</div>
				<div className="text-[11px] tracking-[3px] uppercase font-['Instrument_Sans'] text-white/30">
					CYDAO Cabuyao &copy; 2026
				</div>
			</div>

			{/* Right — form panel */}
			<div className="flex items-center justify-center px-8 py-16 bg-white">
				<div className="w-full max-w-md">
					<p className="eyebrow text-[#aaaaaa]">Sign In</p>
					<h2 className="mt-5 font-['Syne'] font-bold text-4xl text-[#0d0d0d] leading-tight">Welcome back.</h2>
					<p className="mt-3 text-sm text-[#aaaaaa] font-['Instrument_Sans']">
						Don't have an account?{' '}
						<Link to="/register" className="text-[#d42b2b] font-semibold hover:underline">
							Register here
						</Link>
					</p>

					{/* Dev hint */}
					<div className="mt-8 border border-dashed border-[#e0e0e0] px-4 py-3 space-y-1">
						<p className="text-[10px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-[#aaaaaa]">
							Test Credentials
						</p>
						<p className="text-xs font-['Instrument_Sans'] text-[#0d0d0d]">
							Youth — <span className="text-[#d42b2b]">youth@test.com</span> / password
						</p>
						<p className="text-xs font-['Instrument_Sans'] text-[#0d0d0d]">
							Staff — <span className="text-[#d42b2b]">staff@test.com</span> / password
						</p>
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-6">
						{serverError && (
							<div className="border border-[#d42b2b] bg-[#d42b2b]/5 px-4 py-3 text-sm text-[#d42b2b] font-['Instrument_Sans']">
								{serverError}
							</div>
						)}

						<div className="flex flex-col gap-1.5">
							<label className="text-[11px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-[#0d0d0d]">
								Email Address
							</label>
							<input
								{...register('email')}
								type="email"
								autoComplete="email"
								placeholder="you@example.com"
								className="border border-[#e0e0e0] px-4 py-3 text-sm font-['Instrument_Sans'] text-[#0d0d0d] placeholder:text-[#aaaaaa] focus:outline-none focus:border-[#0d0d0d] transition-colors"
							/>
							{errors.email && (
								<p className="text-xs text-[#d42b2b] font-['Instrument_Sans']">{errors.email.message}</p>
							)}
						</div>

						<div className="flex flex-col gap-1.5">
							<label className="text-[11px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-[#0d0d0d]">
								Password
							</label>
							<input
								{...register('password')}
								type="password"
								autoComplete="current-password"
								placeholder="••••••••"
								className="border border-[#e0e0e0] px-4 py-3 text-sm font-['Instrument_Sans'] text-[#0d0d0d] placeholder:text-[#aaaaaa] focus:outline-none focus:border-[#0d0d0d] transition-colors"
							/>
							{errors.password && (
								<p className="text-xs text-[#d42b2b] font-['Instrument_Sans']">{errors.password.message}</p>
							)}
						</div>

						<button
							type="submit"
							disabled={isSubmitting}
							className="mt-2 bg-[#d42b2b] text-white text-[11px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] py-4 flex items-center justify-center gap-2 hover:bg-[#b82424] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSubmitting ? (
								'Signing in...'
							) : (
								<>
									Sign In <ArrowRight size={14} />
								</>
							)}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
