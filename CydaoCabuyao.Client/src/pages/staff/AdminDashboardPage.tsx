import { Link } from 'react-router-dom';
import { BookOpen, Calendar, ClipboardList, Megaphone, ArrowRight, TrendingUp } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ApplicationStatus, APPLICATION_STATUS_LABELS, BARANGAY_LABELS } from '@/types';

// --- Mock data (replace with API calls once backend is ready) ---

const stats = [
	{
		label: 'Open Programs',
		value: 3,
		sub: '7 total programs',
		icon: BookOpen,
		to: '/admin/programs',
	},
	{
		label: 'Upcoming Events',
		value: 5,
		sub: '2 within 30 days',
		icon: Calendar,
		to: '/admin/events',
	},
	{
		label: 'Pending Applications',
		value: 8,
		sub: '3 submitted today',
		icon: ClipboardList,
		to: '/admin/applications',
		highlight: true,
	},
	{
		label: 'Announcements',
		value: 4,
		sub: 'Posted this month',
		icon: Megaphone,
		to: '/admin/announcements',
	},
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
];

const upcomingEvents = [
	{
		id: 1,
		title: 'Kabataan Leadership Summit 2026',
		date: 'Apr 10–12, 2026',
		venue: 'Cabuyao City Hall Auditorium',
		slots: 80,
	},
	{
		id: 2,
		title: 'Environmental Awareness Day',
		date: 'Apr 22, 2026',
		venue: 'Bigaa Community Park',
		slots: 150,
	},
	{
		id: 3,
		title: 'Youth Mental Health Forum',
		date: 'May 3, 2026',
		venue: 'Cabuyao Public Library',
		slots: 60,
	},
];

const statusStyles: Record<number, string> = {
	[ApplicationStatus.Pending]: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
	[ApplicationStatus.UnderReview]: 'bg-blue-50 text-blue-700 border border-blue-200',
	[ApplicationStatus.Approved]: 'bg-green-50 text-green-700 border border-green-200',
	[ApplicationStatus.Rejected]: 'bg-red-50 text-red-700 border border-red-200',
};

export default function AdminDashboardPage() {
	return (
		<AdminLayout title="Dashboard" description="Overview of CYDAO portal activity.">
			{/* Stats row */}
			<div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
				{stats.map(({ label, value, sub, icon: Icon, to, highlight }) => (
					<Link
						key={label}
						to={to}
						className={`group flex flex-col justify-between p-5 border transition-colors ${
							highlight
								? 'bg-[#d42b2b] border-[#d42b2b] text-white'
								: 'bg-white border-[#e0e0e0] hover:border-[#0d0d0d]'
						}`}
					>
						<div className="flex items-start justify-between">
							<Icon
								size={18}
								className={highlight ? 'text-white/70' : 'text-[#aaaaaa]'}
							/>
							<ArrowRight
								size={14}
								className={`opacity-0 group-hover:opacity-100 transition-opacity ${
									highlight ? 'text-white' : 'text-[#0d0d0d]'
								}`}
							/>
						</div>
						<div className="mt-6">
							<p
								className={`font-['Syne'] font-black text-4xl leading-none ${
									highlight ? 'text-white' : 'text-[#0d0d0d]'
								}`}
							>
								{value}
							</p>
							<p
								className={`mt-1.5 text-[11px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] ${
									highlight ? 'text-white/80' : 'text-[#0d0d0d]'
								}`}
							>
								{label}
							</p>
							<p
								className={`mt-0.5 text-xs font-['Instrument_Sans'] ${
									highlight ? 'text-white/60' : 'text-[#aaaaaa]'
								}`}
							>
								{sub}
							</p>
						</div>
					</Link>
				))}
			</div>

			{/* Main content grid */}
			<div className="mt-6 grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
				{/* Recent Applications */}
				<div className="bg-white border border-[#e0e0e0]">
					<div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e0e0]">
						<div>
							<p className="text-[11px] font-bold tracking-[3px] uppercase font-['Instrument_Sans'] text-[#aaaaaa]">
								Recent
							</p>
							<h2 className="font-['Syne'] font-bold text-base text-[#0d0d0d] leading-tight">
								Applications
							</h2>
						</div>
						<Link
							to="/admin/applications"
							className="text-[11px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-[#d42b2b] hover:underline flex items-center gap-1"
						>
							View all <ArrowRight size={12} />
						</Link>
					</div>

					<table className="w-full">
						<thead>
							<tr className="border-b border-[#e0e0e0]">
								{['Applicant', 'Program', 'Date', 'Status'].map((h) => (
									<th
										key={h}
										className="px-6 py-3 text-left text-[10px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-[#aaaaaa]"
									>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{recentApplications.map((app, i) => (
								<tr
									key={app.id}
									className={`border-b border-[#f5f5f5] last:border-0 ${
										i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'
									}`}
								>
									<td className="px-6 py-3.5">
										<p className="text-sm font-semibold text-[#0d0d0d] font-['Instrument_Sans']">
											{app.name}
										</p>
										<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans']">
											{app.barangay}
										</p>
									</td>
									<td className="px-6 py-3.5">
										<p className="text-sm text-[#0d0d0d] font-['Instrument_Sans']">
											{app.program}
										</p>
									</td>
									<td className="px-6 py-3.5">
										<p className="text-sm text-[#aaaaaa] font-['Instrument_Sans'] whitespace-nowrap">
											{app.date}
										</p>
									</td>
									<td className="px-6 py-3.5">
										<span
											className={`inline-block text-[10px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] px-2 py-0.5 ${statusStyles[app.status]}`}
										>
											{APPLICATION_STATUS_LABELS[app.status]}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Upcoming Events */}
				<div className="bg-white border border-[#e0e0e0] self-start">
					<div className="flex items-center justify-between px-5 py-4 border-b border-[#e0e0e0]">
						<div>
							<p className="text-[11px] font-bold tracking-[3px] uppercase font-['Instrument_Sans'] text-[#aaaaaa]">
								Upcoming
							</p>
							<h2 className="font-['Syne'] font-bold text-base text-[#0d0d0d] leading-tight">
								Events
							</h2>
						</div>
						<Link
							to="/admin/events"
							className="text-[11px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-[#d42b2b] hover:underline flex items-center gap-1"
						>
							View all <ArrowRight size={12} />
						</Link>
					</div>

					<div className="divide-y divide-[#f5f5f5]">
						{upcomingEvents.map((event) => (
							<div key={event.id} className="px-5 py-4">
								<div className="flex items-start justify-between gap-2">
									<p className="text-sm font-semibold text-[#0d0d0d] font-['Instrument_Sans'] leading-snug">
										{event.title}
									</p>
									<span className="shrink-0 flex items-center gap-1 text-[10px] font-bold font-['Instrument_Sans'] text-[#aaaaaa] mt-0.5">
										<TrendingUp size={10} />
										{event.slots}
									</span>
								</div>
								<p className="mt-1 text-xs text-[#d42b2b] font-['Instrument_Sans'] font-medium">
									{event.date}
								</p>
								<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans']">
									{event.venue}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</AdminLayout>
	);
}
