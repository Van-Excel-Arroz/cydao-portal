import { useState } from 'react';
import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
	LayoutDashboard,
	BookOpen,
	Calendar,
	Megaphone,
	Menu,
	LogOut,
	ChevronRight,
} from 'lucide-react';
import logo from '@/assets/images/logo.svg';
import { useAuthStore } from '@/stores/authStore';

const navItems = [
	{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
	{ to: '/admin/programs', label: 'Programs', icon: BookOpen, end: false },
	{ to: '/admin/events', label: 'Events', icon: Calendar, end: false },
	{ to: '/admin/announcements', label: 'Announcements', icon: Megaphone, end: false },
];

interface AdminLayoutProps {
	children: ReactNode;
	title: string;
	description?: string;
	noScroll?: boolean;
}

export function AdminLayout({ children, title, description, noScroll = false }: AdminLayoutProps) {
	const [collapsed, setCollapsed] = useState(false);
	const { user, clearAuth } = useAuthStore();
	const navigate = useNavigate();

	function handleLogout() {
		clearAuth();
		navigate('/login');
	}

	return (
		<div className="flex h-screen overflow-hidden">
			{/* Sidebar */}
			<aside
				className={`shrink-0 bg-[#0d0d0d] flex flex-col transition-all duration-200 h-screen overflow-y-auto ${collapsed ? 'w-16' : 'w-60'}`}
			>
				{/* Logo */}
				<div
					className={`border-b border-white/10 flex items-center h-19 ${collapsed ? 'justify-center px-0' : 'px-5 gap-3'}`}
				>
					<img src={logo} alt="CYDAO Cabuyao" className="h-12 shrink-0 rounded-full" />
					{!collapsed && (
						<div className="min-w-0">
							<p className="font-['Syne'] font-bold text-white text-sm leading-tight truncate">CYDAO Portal</p>
							<p className="text-[10px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-white/40">
								Staff Panel
							</p>
						</div>
					)}
				</div>

				{/* Nav */}
				<nav className="flex-1 p-2 flex flex-col gap-0.5 overflow-x-hidden overflow-y-auto">
					{navItems.map(({ to, label, icon: Icon, end }) => (
						<NavLink
							key={to}
							to={to}
							end={end}
							title={collapsed ? label : undefined}
							className={({ isActive }) =>
								`flex items-center gap-3 px-3 py-2.5 text-sm font-['Instrument_Sans'] font-medium transition-colors ${
									collapsed ? 'justify-center' : ''
								} ${isActive ? 'bg-[#d42b2b] text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`
							}
						>
							<Icon size={15} className="shrink-0" />
							{!collapsed && label}
						</NavLink>
					))}
				</nav>

				{/* User + logout */}
				{!collapsed && (
					<div className="border-t border-white/10 px-4 py-3">
						<div className="flex items-center gap-2 mb-2">
							<div className="w-7 h-7 rounded-full bg-[#d42b2b] flex items-center justify-center shrink-0">
								<span className="text-[11px] font-bold text-white font-['Instrument_Sans']">
									{user?.firstName?.[0]}
									{user?.lastName?.[0]}
								</span>
							</div>
							<div className="min-w-0">
								<p className="text-xs font-semibold text-white font-['Instrument_Sans'] truncate leading-tight">
									{user?.firstName} {user?.lastName}
								</p>
								<p className="text-[10px] text-white/40 font-['Instrument_Sans'] truncate">Staff</p>
							</div>
						</div>
						<button
							onClick={handleLogout}
							className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-white/50 hover:text-white hover:bg-white/5 transition-colors font-['Instrument_Sans']"
						>
							<LogOut size={13} />
							Logout
						</button>
					</div>
				)}

				{collapsed && (
					<div className="border-t border-white/10 p-2 flex flex-col gap-2 items-center">
						<div className="w-7 h-7 rounded-full bg-[#d42b2b] flex items-center justify-center shrink-0">
							<span className="text-[11px] font-bold text-white font-['Instrument_Sans']">
								{user?.firstName?.[0]}
								{user?.lastName?.[0]}
							</span>
						</div>
						<button
							onClick={handleLogout}
							title="Logout"
							className="flex items-center justify-center py-2.5 text-white/50 hover:text-white hover:bg-white/5 transition-colors"
						>
							<LogOut size={15} />
						</button>
					</div>
				)}
			</aside>

			{/* Main area */}
			<div className="flex-1 flex flex-col bg-[#f5f5f5] min-w-0 overflow-y-auto">
				{/* Top bar */}
				<div className="bg-white border-b border-[#e0e0e0] px-6 py-4 shrink-0 flex items-center gap-4">
					<button
						onClick={() => setCollapsed(c => !c)}
						className="text-[#0d0d0d] hover:text-[#d42b2b] transition-colors"
						aria-label="Toggle sidebar"
					>
						{collapsed ? <ChevronRight size={18} /> : <Menu size={18} />}
					</button>

					<div className="flex-1 min-w-0">
						<h1 className="font-['Syne'] font-bold text-xl text-[#0d0d0d] leading-tight">{title}</h1>
						{description && <p className="text-xs text-[#aaaaaa] font-['Instrument_Sans'] mt-0.5">{description}</p>}
					</div>
				</div>

				{/* Page content */}
				<div className={noScroll ? 'flex-1 overflow-hidden flex flex-col p-6' : 'flex-1 overflow-y-auto p-8'}>
					{children}
				</div>
			</div>
		</div>
	);
}
