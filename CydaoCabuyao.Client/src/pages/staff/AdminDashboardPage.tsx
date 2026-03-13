import { Link } from 'react-router-dom';
import { BookOpen, Calendar, ClipboardList, Megaphone, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ApplicationStatus, APPLICATION_STATUS_LABELS, BARANGAY_LABELS } from '@/types';

// --- Mock data (replace with API calls once backend is ready) ---

const stats: {
	label: string;
	value: number;
	sub: string;
	icon: LucideIcon;
	to: string;
	highlight?: boolean;
}[] = [
	{ label: 'Open Programs', value: 3, sub: '7 total programs', icon: BookOpen, to: '/admin/programs' },
	{ label: 'Upcoming Events', value: 5, sub: '2 within 30 days', icon: Calendar, to: '/admin/events' },
	{
		label: 'Pending Applications',
		value: 8,
		sub: '3 submitted today',
		icon: ClipboardList,
		to: '/admin/applications',
		highlight: true,
	},
	{ label: 'Announcements', value: 4, sub: 'Posted this month', icon: Megaphone, to: '/admin/announcements' },
];

const recentApplications = [
	{
		id: 1,
		name: 'Ana Reyes',
		barangay: BARANGAY_LABELS[16],
		program: 'Leadership Development',
		date: 'Mar 12, 2026',
		status: ApplicationStatus.Pending,
	},
	{
		id: 2,
		name: 'Carlo Mendoza',
		barangay: BARANGAY_LABELS[3],
		program: 'Environmental Awareness',
		date: 'Mar 11, 2026',
		status: ApplicationStatus.UnderReview,
	},
	{
		id: 3,
		name: 'Pia Santos',
		barangay: BARANGAY_LABELS[15],
		program: 'Mental Health Forum',
		date: 'Mar 10, 2026',
		status: ApplicationStatus.Approved,
	},
	{
		id: 4,
		name: 'Mark dela Cruz',
		barangay: BARANGAY_LABELS[7],
		program: 'Livelihood Training',
		date: 'Mar 09, 2026',
		status: ApplicationStatus.Pending,
	},
	{
		id: 5,
		name: 'Jessa Bautista',
		barangay: BARANGAY_LABELS[10],
		program: 'Arts & Culture Workshop',
		date: 'Mar 08, 2026',
		status: ApplicationStatus.Rejected,
	},
	{
		id: 6,
		name: 'Rico Villanueva',
		barangay: BARANGAY_LABELS[2],
		program: 'Leadership Development',
		date: 'Mar 07, 2026',
		status: ApplicationStatus.Approved,
	},
	{
		id: 7,
		name: 'Lara Flores',
		barangay: BARANGAY_LABELS[9],
		program: 'Environmental Awareness',
		date: 'Mar 06, 2026',
		status: ApplicationStatus.Pending,
	},
];

const upcomingEvents = [
	{
		id: 1,
		title: 'Kabataan Leadership Summit 2026',
		date: 'Apr 10–12, 2026',
		venue: 'Cabuyao City Hall Auditorium',
		slots: 80,
	},
	{ id: 2, title: 'Environmental Awareness Day', date: 'Apr 22, 2026', venue: 'Bigaa Community Park', slots: 150 },
	{ id: 3, title: 'Youth Mental Health Forum', date: 'May 3, 2026', venue: 'Cabuyao Public Library', slots: 60 },
	{
		id: 4,
		title: 'Livelihood Skills Training Fair',
		date: 'May 17–18, 2026',
		venue: 'Cabuyao Sports Complex',
		slots: 200,
	},
];

const statusStyles: Record<number, string> = {
	[ApplicationStatus.Pending]: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
	[ApplicationStatus.UnderReview]: 'bg-blue-50 text-blue-700 border border-blue-200',
	[ApplicationStatus.Approved]: 'bg-green-50 text-green-700 border border-green-200',
	[ApplicationStatus.Rejected]: 'bg-red-50 text-red-600 border border-red-200',
};

export default function AdminDashboardPage() {
	return (
		<AdminLayout title="Dashboard" description="Overview of CYDAO portal activity." noScroll>
			<div className="flex flex-col h-full gap-5 min-h-0">
				{/* Stats row */}
				<div className="grid grid-cols-4 gap-4 shrink-0">
					{stats.map(({ label, value, sub, icon: Icon, to, highlight }) => (
						<Link
							key={label}
							to={to}
							className={`relative overflow-hidden group flex flex-col justify-between p-4 border transition-colors ${
								highlight ? 'bg-[#d42b2b] border-[#d42b2b]' : 'bg-white border-[#e0e0e0] hover:border-[#0d0d0d]'
							}`}
						>
							{/* Text */}
							<div className="relative z-10">
								<p
									className={`font-['Syne'] font-black text-3xl leading-none ${highlight ? 'text-white' : 'text-[#0d0d0d]'}`}
								>
									{value}
								</p>
								<p
									className={`mt-1.5 text-[11px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] ${highlight ? 'text-white/80' : 'text-[#0d0d0d]'}`}
								>
									{label}
								</p>
								<p
									className={`mt-0.5 text-xs font-['Instrument_Sans'] ${highlight ? 'text-white/60' : 'text-[#aaaaaa]'}`}
								>
									{sub}
								</p>
							</div>

							{/* Icon overlay — large, faded, right-anchored */}
							<Icon
								size={88}
								className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
									highlight ? 'text-white opacity-[0.13]' : 'text-[#0d0d0d] opacity-[0.06]'
								}`}
							/>

							{/* Gradient mask — fades icon into card bg from the left */}
							<div
								className={`absolute inset-y-0 left-0 w-3/5 pointer-events-none bg-linear-to-r ${
									highlight ? 'from-[#d42b2b] to-transparent' : 'from-white to-transparent'
								}`}
							/>

							{/* Hover arrow */}
							<ArrowRight
								size={13}
								className={`absolute bottom-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
									highlight ? 'text-white' : 'text-[#0d0d0d]'
								}`}
							/>
						</Link>
					))}
				</div>

				{/* Tables row — fills remaining height, each scrolls internally */}
				<div className="flex-1 flex gap-4 min-h-0">
					{/* Recent Applications */}
					<div className="flex-1 flex flex-col min-h-0 bg-white border border-[#e0e0e0]">
						<div className="shrink-0 flex items-center justify-between px-5 py-3.5 border-b border-[#e0e0e0]">
							<div>
								<p className="text-[10px] font-bold tracking-[3px] uppercase font-['Instrument_Sans'] text-[#aaaaaa]">
									Recent
								</p>
								<h2 className="font-['Syne'] font-bold text-sm text-[#0d0d0d] leading-tight">Applications</h2>
							</div>
							<Link
								to="/admin/applications"
								className="text-[10px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-[#d42b2b] hover:underline flex items-center gap-1"
							>
								View all <ArrowRight size={11} />
							</Link>
						</div>

						{/* Table header */}
						<div className="shrink-0 grid grid-cols-[1.5fr_1.5fr_1fr_1fr] border-b border-[#e0e0e0] bg-[#fafafa]">
							{['Applicant', 'Program', 'Date', 'Status'].map(h => (
								<div
									key={h}
									className="px-5 py-2.5 text-[10px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-[#aaaaaa]"
								>
									{h}
								</div>
							))}
						</div>

						{/* Scrollable rows */}
						<div className="flex-1 overflow-y-auto">
							{recentApplications.map((app, i) => (
								<div
									key={app.id}
									className={`grid grid-cols-[1.5fr_1.5fr_1fr_1fr] border-b border-[#f5f5f5] last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}
								>
									<div className="px-5 py-3">
										<p className="text-sm font-semibold text-[#0d0d0d] font-['Instrument_Sans'] leading-tight">
											{app.name}
										</p>
										<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans']">{app.barangay}</p>
									</div>
									<div className="px-5 py-3 flex items-center">
										<p className="text-sm text-[#0d0d0d] font-['Instrument_Sans']">{app.program}</p>
									</div>
									<div className="px-5 py-3 flex items-center">
										<p className="text-sm text-[#aaaaaa] font-['Instrument_Sans'] whitespace-nowrap">{app.date}</p>
									</div>
									<div className="px-5 py-3 flex items-center">
										<span
											className={`inline-block text-[10px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] px-2 py-0.5 ${statusStyles[app.status]}`}
										>
											{APPLICATION_STATUS_LABELS[app.status]}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Upcoming Events */}
					<div className="w-72 shrink-0 flex flex-col min-h-0 bg-white border border-[#e0e0e0]">
						<div className="shrink-0 flex items-center justify-between px-5 py-3.5 border-b border-[#e0e0e0]">
							<div>
								<p className="text-[10px] font-bold tracking-[3px] uppercase font-['Instrument_Sans'] text-[#aaaaaa]">
									Upcoming
								</p>
								<h2 className="font-['Syne'] font-bold text-sm text-[#0d0d0d] leading-tight">Events</h2>
							</div>
							<Link
								to="/admin/events"
								className="text-[10px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-[#d42b2b] hover:underline flex items-center gap-1"
							>
								View all <ArrowRight size={11} />
							</Link>
						</div>

						<div className="flex-1 overflow-y-auto divide-y divide-[#f5f5f5]">
							{upcomingEvents.map(event => (
								<div key={event.id} className="px-5 py-3.5">
									<p className="text-sm font-semibold text-[#0d0d0d] font-['Instrument_Sans'] leading-snug">
										{event.title}
									</p>
									<p className="mt-1 text-xs font-medium text-[#d42b2b] font-['Instrument_Sans']">{event.date}</p>
									<div className="flex items-center justify-between mt-0.5">
										<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans'] truncate">{event.venue}</p>
										<span className="shrink-0 ml-2 text-[10px] font-bold font-['Instrument_Sans'] text-[#aaaaaa]">
											{event.slots} slots
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</AdminLayout>
	);
}
