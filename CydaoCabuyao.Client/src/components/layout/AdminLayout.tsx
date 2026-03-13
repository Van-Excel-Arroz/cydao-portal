import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Calendar, ClipboardList, Megaphone } from 'lucide-react';

const navItems = [
	{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
	{ to: '/admin/programs', label: 'Programs', icon: BookOpen, end: false },
	{ to: '/admin/events', label: 'Events', icon: Calendar, end: false },
	{ to: '/admin/applications', label: 'Applications', icon: ClipboardList, end: false },
	{ to: '/admin/announcements', label: 'Announcements', icon: Megaphone, end: false },
];

interface AdminLayoutProps {
	children: ReactNode;
	title: string;
	description?: string;
}

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
	return (
		<div className="flex min-h-[calc(100vh-64px)]">
			{/* Sidebar */}
			<aside className="w-60 shrink-0 bg-[#0d0d0d] flex flex-col">
				<div className="px-6 py-5 border-b border-white/10">
					<p className="text-[10px] font-bold tracking-[3px] uppercase font-['Instrument_Sans'] text-white/40">
						Staff Panel
					</p>
					<p className="mt-0.5 font-['Syne'] font-bold text-white text-base leading-tight">
						CYDAO Admin
					</p>
				</div>

				<nav className="flex-1 p-3 flex flex-col gap-0.5">
					{navItems.map(({ to, label, icon: Icon, end }) => (
						<NavLink
							key={to}
							to={to}
							end={end}
							className={({ isActive }) =>
								`flex items-center gap-3 px-3 py-2.5 text-sm font-['Instrument_Sans'] font-medium transition-colors ${
									isActive
										? 'bg-[#d42b2b] text-white'
										: 'text-white/50 hover:text-white hover:bg-white/5'
								}`
							}
						>
							<Icon size={15} />
							{label}
						</NavLink>
					))}
				</nav>

				<div className="px-6 py-4 border-t border-white/10">
					<p className="text-[10px] tracking-[2px] uppercase font-['Instrument_Sans'] text-white/20">
						CYDAO Cabuyao &copy; 2026
					</p>
				</div>
			</aside>

			{/* Main area */}
			<div className="flex-1 flex flex-col bg-[#f5f5f5] min-w-0">
				{/* Page header */}
				<div className="bg-white border-b border-[#e0e0e0] px-8 py-5 shrink-0">
					<h1 className="font-['Syne'] font-bold text-2xl text-[#0d0d0d] leading-tight">
						{title}
					</h1>
					{description && (
						<p className="mt-1 text-sm text-[#aaaaaa] font-['Instrument_Sans']">
							{description}
						</p>
					)}
				</div>

				{/* Page content */}
				<div className="flex-1 p-8">
					{children}
				</div>
			</div>
		</div>
	);
}
