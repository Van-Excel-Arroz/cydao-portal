import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, ArrowRight, SlidersHorizontal } from 'lucide-react';

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

	// Group by month
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
					src={`https://picsum.photos/seed/event-featured/1400/700`}
					alt={featured.title}
					className="absolute inset-0 w-full h-full object-cover opacity-30"
				/>
				<div className="relative h-full flex flex-col justify-end max-w-7xl mx-auto px-6 pb-12">
					<span className="text-[9px] font-bold uppercase tracking-[2px] px-2 py-0.5 bg-[#d42b2b] text-white w-fit mb-3 font-['Instrument_Sans']">
						Next Up
					</span>
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
					<div className="relative flex-1 max-w-sm">
						<Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]" />
						<input
							type="text"
							placeholder="Search events or venues..."
							value={search}
							onChange={e => setSearch(e.target.value)}
							className="w-full pl-9 pr-4 py-2 border border-[#e0e0e0] text-sm font-['Instrument_Sans'] focus:outline-none focus:border-[#0d0d0d] bg-white"
						/>
					</div>
					<div className="flex items-center gap-3">
						<SlidersHorizontal size={13} className="text-[#aaa]" />
						<div className="flex border border-[#e0e0e0]">
							{(['all', 'open', 'closed'] as const).map(s => (
								<button
									key={s}
									onClick={() => setStatus(s)}
									className={`px-4 py-2 text-[11px] font-bold uppercase tracking-[1px] transition-colors font-['Instrument_Sans'] ${
										status === s ? 'bg-[#0d0d0d] text-white' : 'text-[#555] hover:text-[#0d0d0d]'
									}`}
								>
									{s}
								</button>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Events grouped by month */}
			<div className="max-w-7xl mx-auto px-6 py-16">
				{filtered.length === 0 ? (
					<div className="py-24 text-center">
						<p className="font-['Syne'] font-bold text-2xl text-[#e0e0e0] mb-2">No events found</p>
						<p className="text-sm text-[#aaa] font-['Instrument_Sans']">Try a different search or filter.</p>
					</div>
				) : (
					<div className="space-y-16">
						{Array.from(grouped.entries()).map(([month, events]) => (
							<div key={month}>
								{/* Month header */}
								<div className="flex items-center gap-6 mb-8">
									<h2 className="font-['Syne'] font-extrabold text-4xl text-[#f0f0f0] shrink-0">{month}</h2>
									<div className="h-px flex-1 bg-[#e0e0e0]" />
									<span className="text-xs text-[#aaa] font-['Instrument_Sans'] shrink-0">
										{events.length} event{events.length !== 1 ? 's' : ''}
									</span>
								</div>

								{/* Events in this month */}
								<div className="space-y-4">
									{events.map(event => (
										<div
											key={event.id}
											className="grid grid-cols-1 lg:grid-cols-[200px_1fr_auto] gap-0 bg-white border border-[#e0e0e0] group hover:border-[#d42b2b] transition-colors"
										>
											{/* Image */}
											<div className="overflow-hidden h-40 lg:h-auto">
												<img
													src={`https://picsum.photos/seed/ev${event.id}/300/200`}
													alt={event.title}
													className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
												/>
											</div>

											{/* Details */}
											<div className="p-6 border-t lg:border-t-0 lg:border-l border-[#e0e0e0] flex flex-col justify-between">
												<div>
													<div className="flex items-center gap-2 mb-2">
														<span
															className={`text-[9px] font-bold uppercase tracking-[2px] px-2 py-0.5 font-['Instrument_Sans'] ${
																event.isOpen ? 'bg-[#d42b2b] text-white' : 'bg-[#f5f5f5] text-[#aaa]'
															}`}
														>
															{event.isOpen ? 'Open' : 'Closed'}
														</span>
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

											{/* CTA */}
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
