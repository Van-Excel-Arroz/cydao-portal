import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { OpenBadge, Badge } from '@/components/shared/Badge';
import { EmptyState } from '@/components/shared/EmptyState';
import { SearchInput } from '@/components/shared/SearchInput';
import { SegmentedControl } from '@/components/shared/SegmentedControl';

const mockEvents = [
	{
		id: 1,
		title: 'Kabataan Leadership Summit 2026',
		description:
			'A two-day summit gathering youth leaders from all 18 barangays to discuss governance, advocacy, and community action plans.',
		startDate: '2026-04-10',
		endDate: '2026-04-12',
		venue: 'Cabuyao City Hall Auditorium',
		availableSlots: 80,
		isOpen: true,
		month: 'April 2026',
	},
	{
		id: 2,
		title: 'Environmental Awareness Day',
		description:
			'A barangay-wide cleanup drive and environmental education event held at Bigaa Community Park, in partnership with the DENR.',
		startDate: '2026-04-22',
		endDate: '2026-04-22',
		venue: 'Bigaa Community Park',
		availableSlots: 150,
		isOpen: true,
		month: 'April 2026',
	},
	{
		id: 3,
		title: 'YORP Orientation Seminar',
		description:
			'Mandatory orientation for all youth organizations seeking YORP accreditation in 2026. Bring your documentary requirements.',
		startDate: '2026-04-28',
		endDate: '2026-04-28',
		venue: 'CYDAO Conference Room',
		availableSlots: 40,
		isOpen: true,
		month: 'April 2026',
	},
	{
		id: 4,
		title: 'Youth Mental Health Forum',
		description:
			'A half-day forum featuring licensed psychologists discussing mental wellness, stress management, and seeking help resources for Cabuyao youth.',
		startDate: '2026-05-03',
		endDate: '2026-05-03',
		venue: 'Cabuyao Public Library',
		availableSlots: 60,
		isOpen: false,
		month: 'May 2026',
	},
	{
		id: 5,
		title: 'Livelihood Skills Training Fair',
		description:
			'A two-day fair featuring TESDA-accredited training booths, livelihood exhibits, and on-the-spot enrollment for free skills programs.',
		startDate: '2026-05-17',
		endDate: '2026-05-18',
		venue: 'Cabuyao Sports Complex',
		availableSlots: 200,
		isOpen: true,
		month: 'May 2026',
	},
	{
		id: 6,
		title: 'Kabataang Artista: Arts Festival',
		description:
			'An inter-barangay arts showcase featuring visual art, spoken word, dance, and live music performances celebrating Cabuyao youth talent.',
		startDate: '2026-05-24',
		endDate: '2026-05-25',
		venue: 'Cabuyao Town Plaza',
		availableSlots: 500,
		isOpen: true,
		month: 'May 2026',
	},
	{
		id: 7,
		title: 'Youth Governance Workshop',
		description:
			'A one-day workshop on participatory governance, budget advocacy, and Sangguniang Kabataan processes for elected SK officials.',
		startDate: '2026-06-12',
		endDate: '2026-06-12',
		venue: 'Cabuyao City Hall Session Hall',
		availableSlots: 50,
		isOpen: true,
		month: 'June 2026',
	},
];

function formatDate(dateStr: string) {
	return new Date(dateStr).toLocaleDateString('en-PH', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
}

function formatEventDate(start: string, end: string) {
	if (start === end) return formatDate(start);
	const s = new Date(start);
	const e = new Date(end);
	return `${s.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })} – ${e.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}`;
}

const STATUS_OPTIONS = [
	{ label: 'All', value: 'all' },
	{ label: 'Open', value: 'open' },
	{ label: 'Closed', value: 'closed' },
] as const;

export default function EventsPage() {
	const [search, setSearch] = useState('');
	const [status, setStatus] = useState<'all' | 'open' | 'closed'>('all');

	const filtered = useMemo(() => {
		let list = [...mockEvents];
		if (search.trim()) {
			const q = search.toLowerCase();
			list = list.filter(
				e =>
					e.title.toLowerCase().includes(q) ||
					e.venue.toLowerCase().includes(q) ||
					e.description.toLowerCase().includes(q),
			);
		}
		if (status !== 'all') {
			list = list.filter(e => (status === 'open' ? e.isOpen : !e.isOpen));
		}
		return list;
	}, [search, status]);

	const grouped = useMemo(() => {
		const map = new Map<string, typeof filtered>();
		for (const ev of filtered) {
			if (!map.has(ev.month)) map.set(ev.month, []);
			map.get(ev.month)!.push(ev);
		}
		return map;
	}, [filtered]);

	const featured = mockEvents[0];

	return (
		<>
			{/* Featured event — full-bleed banner */}
			<section className="relative overflow-hidden bg-[#0d0d0d] h-[50vh] min-h-90">
				<img
					src="https://picsum.photos/seed/event-featured/1400/700"
					alt={featured.title}
					className="absolute inset-0 w-full h-full object-cover opacity-30"
				/>
				<div className="relative h-full flex flex-col justify-end max-w-7xl mx-auto px-6 pb-12">
					<Badge className="bg-[#d42b2b] text-white border-[#d42b2b] w-fit mb-3">Next Up</Badge>
					<h2 className="font-['Syne'] font-extrabold text-4xl text-white leading-tight mb-3 max-w-xl">
						{featured.title}
					</h2>
					<div className="flex flex-wrap gap-5 text-sm text-white/60 font-['Instrument_Sans'] mb-5">
						<span className="flex items-center gap-1.5">
							<Calendar size={13} />
							{formatEventDate(featured.startDate, featured.endDate)}
						</span>
						<span className="flex items-center gap-1.5">
							<MapPin size={13} />
							{featured.venue}
						</span>
						<span className="flex items-center gap-1.5">
							<Users size={13} />
							{featured.availableSlots} slots
						</span>
					</div>
					<Link
						to="/register"
						className="inline-flex items-center gap-2 bg-[#d42b2b] text-white px-6 py-3 text-sm font-semibold font-['Instrument_Sans'] hover:bg-[#b82424] transition-colors w-fit"
					>
						Register Now <ArrowRight size={14} />
					</Link>
				</div>
			</section>

			{/* Filters */}
			<section className="border-b border-[#e0e0e0] sticky top-16 z-40 bg-[#f5f5f5]">
				<div className="max-w-7xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
					<SearchInput
						placeholder="Search events or venues..."
						value={search}
						onChange={e => setSearch(e.target.value)}
						containerClassName="flex-1 max-w-sm"
					/>
					<div className="flex items-center gap-3">
						<SlidersHorizontal size={13} className="text-[#aaa]" />
						<SegmentedControl options={[...STATUS_OPTIONS]} value={status} onChange={setStatus} />
					</div>
				</div>
			</section>

			{/* Events grouped by month */}
			<div className="max-w-7xl mx-auto px-6 py-16">
				{filtered.length === 0 ? (
					<EmptyState variant="page" title="No events found" subtitle="Try a different search or filter." />
				) : (
					<div className="space-y-16">
						{Array.from(grouped.entries()).map(([month, events]) => (
							<div key={month}>
								{/* Month header */}
								<div className="flex items-center gap-6 mb-8">
									<h2 className="font-['Syne'] font-extrabold text-4xl text-[#e0e0e0] shrink-0">{month}</h2>
									<div className="h-px flex-1 bg-[#e0e0e0]" />
									<span className="text-xs text-[#aaa] font-['Instrument_Sans'] shrink-0">
										{events.length} event{events.length !== 1 ? 's' : ''}
									</span>
								</div>

								<div className="space-y-4">
									{events.map(event => (
										<div
											key={event.id}
											className="grid grid-cols-1 lg:grid-cols-[200px_1fr_auto] bg-white border border-[#e0e0e0] group hover:border-[#d42b2b] transition-colors"
										>
											<div className="overflow-hidden h-40 lg:h-auto">
												<img
													src={`https://picsum.photos/seed/ev${event.id}/300/200`}
													alt={event.title}
													className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
												/>
											</div>

											<div className="p-6 border-t lg:border-t-0 lg:border-l border-[#e0e0e0] flex flex-col justify-between">
												<div>
													<div className="mb-2">
														<OpenBadge isOpen={event.isOpen} />
													</div>
													<h3 className="font-['Syne'] font-bold text-lg text-[#0d0d0d] mb-2 leading-snug">
														{event.title}
													</h3>
													<p className="text-sm text-[#555] font-['Instrument_Sans'] leading-relaxed line-clamp-2">
														{event.description}
													</p>
												</div>
												<div className="flex flex-wrap gap-5 mt-4 text-xs text-[#aaa] font-['Instrument_Sans']">
													<span className="flex items-center gap-1">
														<Calendar size={11} />
														{formatEventDate(event.startDate, event.endDate)}
													</span>
													<span className="flex items-center gap-1">
														<MapPin size={11} />
														{event.venue}
													</span>
													<span className="flex items-center gap-1">
														<Users size={11} />
														{event.availableSlots} slots available
													</span>
												</div>
											</div>

											<div className="flex items-center justify-center px-8 border-t lg:border-t-0 lg:border-l border-[#e0e0e0] py-4 lg:py-0">
												{event.isOpen ? (
													<Link
														to="/register"
														className="inline-flex items-center gap-2 bg-[#d42b2b] text-white px-5 py-2.5 text-xs font-bold font-['Instrument_Sans'] hover:bg-[#b82424] transition-colors whitespace-nowrap"
													>
														Register <ArrowRight size={12} />
													</Link>
												) : (
													<span className="text-xs text-[#aaa] font-['Instrument_Sans'] uppercase tracking-[1px]">
														Registration Closed
													</span>
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</>
	);
}
