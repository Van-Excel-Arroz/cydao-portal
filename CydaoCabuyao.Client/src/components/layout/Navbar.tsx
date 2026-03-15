import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { UserRole } from '@/types';
import { LogOut, User } from 'lucide-react';
import logo from '@/assets/images/logo.svg';

export function Navbar() {
	const { user, clearAuth } = useAuthStore();
	const navigate = useNavigate();

	function handleLogout() {
		clearAuth();
		navigate('/');
	}

	return (
		<header className="border-b border-[#e0e0e0] bg-white sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
				{/* Logo */}
				<Link to="/" className="flex items-center gap-3">
					<img src={logo} alt="CYDAO Cabuyao" className="h-10 w-auto" />
					<span className="font-['Syne'] font-bold text-sm tracking-wide text-[#0d0d0d]">
						CYDAO Portal
					</span>
				</Link>

				{/* Nav links */}
				<nav className="hidden md:flex items-center gap-8">
					{[
						{ to: '/about', label: 'About' },
						{ to: '/programs', label: 'Programs' },
						{ to: '/events', label: 'Events' },
						{ to: '/announcements', label: 'Announcements' },
					].map(({ to, label }) => (
						<NavLink
							key={to}
							to={to}
							className={({ isActive }) =>
								`text-sm font-medium font-['Instrument_Sans'] transition-colors ${
									isActive
										? 'text-[#d42b2b]'
										: 'text-[#0d0d0d] hover:text-[#d42b2b]'
								}`
							}
						>
							{label}
						</NavLink>
					))}
				</nav>

				{/* Auth area */}
				<div className="flex items-center gap-3">
					{user ? (
						<>
							<Link
								to={user.role === UserRole.Staff ? '/admin/programs' : '/youth/profile'}
								className="flex items-center gap-2 text-sm font-medium text-[#0d0d0d] hover:text-[#d42b2b] transition-colors"
							>
								<User size={16} />
								{user.firstName}
							</Link>
							<button
								onClick={handleLogout}
								className="flex items-center gap-1.5 text-sm font-medium text-[#0d0d0d] hover:text-[#d42b2b] transition-colors"
							>
								<LogOut size={15} />
								Logout
							</button>
						</>
					) : (
						<>
							<Link
								to="/login"
								className="text-sm font-medium text-[#0d0d0d] border border-[#0d0d0d] px-4 py-1.5 hover:bg-[#0d0d0d] hover:text-white transition-colors"
							>
								Login
							</Link>
							<Link
								to="/register"
								className="text-sm font-medium text-white bg-[#d42b2b] px-4 py-1.5 hover:bg-[#b82424] transition-colors"
							>
								Join Now
							</Link>
						</>
					)}
				</div>
			</div>
		</header>
	);
}
