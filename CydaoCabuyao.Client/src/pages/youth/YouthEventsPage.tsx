import { useState, useMemo } from 'react';
import { Search, Calendar, MapPin, Users, X } from 'lucide-react';
import { YouthLayout } from '@/components/layout/YouthLayout';
import { useRegistrationsStore } from '@/stores/registrationsStore';

interface Event {
	id: number;
	title: string;
	description: string;
	startDate: string;
	endDate: string;
	venue: string;
	availableSlots: number;
	isOpen: boolean;
}

const mockEvents: Event[] = [
	{
		id: 1,
		title: 'Kabataan Leadership Summit 2026',
		description:
			'A two-day summit gathering youth leaders from all 18 barangays to discuss governance, advocacy, and community action plans. Participants will work in barangay clusters to draft local youth development proposals, which will be presented to CYDAO staff and city officials on the final day.',
		startDate: '2026-04-10',
		endDate: '2026-04-12',
		venue: 'Cabuyao City Hall Auditorium',
		availableSlots: 80,
		isOpen: true,
	},
	{
		id: 2,
		title: 'Environmental Awareness Day',
		description:
			'A barangay-wide cleanup drive and environmental education event held at Bigaa Community Park, in partnership with the DENR. Activities include waste segregation workshops, tree planting, and an eco-fair featuring sustainable products from local youth enterprises.',
		startDate: '2026-04-22',
		endDate: '2026-04-22',
		venue: 'Bigaa Community Park',
		availableSlots: 150,
		isOpen: true,
	},
	{
		id: 3,
		title: 'YORP Orientation Seminar',
		description:
			'Mandatory orientation for all youth organizations seeking YORP accreditation in 2026. Bring your documentary requirements. Topics include YORP criteria, submission timelines, and the evaluation process. Representatives from all 18 barangays are expected to attend.',
		startDate: '2026-04-28',
		endDate: '2026-04-28',
		venue: 'CYDAO Conference Room',
		availableSlots: 40,
		isOpen: true,
	},
	{
		id: 4,
		title: 'Youth Mental Health Forum',
		description:
			'A half-day forum featuring licensed psychologists discussing mental wellness, stress management, and seeking help resources for Cabuyao youth. Includes an open Q&A session and distribution of mental health resource kits sponsored by the Department of Health.',
		startDate: '2026-05-03',
		endDate: '2026-05-03',
		venue: 'Cabuyao Public Library',
		availableSlots: 60,
		isOpen: false,
	},
	{
		id: 5,
		title: 'Livelihood Skills Training Fair',
		description:
			'A two-day fair featuring TESDA-accredited training booths, livelihood exhibits, and on-the-spot enrollment for free skills programs. Participants may visit all booths and receive certificates of attendance. Skills covered include cooking, welding, dressmaking, and basic electronics repair.',
		startDate: '2026-05-17',
		endDate: '2026-05-18',
		venue: 'Cabuyao Sports Complex',
		availableSlots: 200,
		isOpen: true,
	},
	{
		id: 6,
		title: 'Kabataang Artista: Arts Festival',
		description:
			'An inter-barangay arts showcase featuring visual art, spoken word, dance, and live music performances celebrating Cabuyao youth talent. Registered participants may join as performers or volunteers. All performers must submit their entry form and materials to CYDAO at least two weeks before the event.',
		startDate: '2026-05-24',
		endDate: '2026-05-25',
		venue: 'Cabuyao Town Plaza',
		availableSlots: 500,
		isOpen: true,
	},
	{
		id: 7,
		title: 'Youth Governance Workshop',
		description:
			'A one-day workshop on participatory governance, budget advocacy, and Sangguniang Kabataan processes for elected SK officials. Participants will receive a workshop kit and a certificate signed by the CYDAO Executive Director upon completion.',
		startDate: '2026-06-12',
		endDate: '2026-06-12',
		venue: 'Cabuyao City Hall Session Hall',
		availableSlots: 50,
		isOpen: true,
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
	if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
		return `${s.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}–${e.toLocaleDateString('en-PH', { day: 'numeric', year: 'numeric' })}`;
	}
	return `${formatDate(start)} – ${formatDate(end)}`;
}

export default function YouthEventsPage() {
	const [search, setSearch] = useState('');
	const [status, setStatus] = useState<'all' | 'open' | 'closed'>('all');
	const [selected, setSelected] = useState<Event | null>(null);

	const { registrations, addRegistration } = useRegistrationsStore();
	const registeredEventIds = new Set(registrations.map(r => r.eventId));

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

	function handleRegister(event: Event) {
		addRegistration({
			eventId: event.id,
			eventTitle: event.title,
			eventDescription: event.description,
			startDate: `${event.startDate}T08:00:00Z`,
			endDate: `${event.endDate}T17:00:00Z`,
			venue: event.venue,
			availableSlots: event.availableSlots,
		});
		setSelected(null);
	}

	return (
		<YouthLayout title="Events">
			{/* Toolbar */}
			<div className="flex flex-wrap items-center gap-3 mb-6">
				<div className="flex border border-[#e0e0e0]">
					{(['all', 'open', 'closed'] as const).map(s => (
						<button
							key={s}
							onClick={() => setStatus(s)}
							className={`px-3 py-2 text-[11px] font-bold uppercase tracking-[1px] transition-colors font-['Instrument_Sans'] ${
								status === s ? 'bg-[#0d0d0d] text-white' : 'bg-white text-[#555] hover:text-[#0d0d0d]'
							}`}
						>
							{s}
						</button>
					))}
				</div>

				<div className="relative w-52 ml-auto">
					<Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]" />
					<input
						type="text"
						placeholder="Search events or venues..."
						value={search}
						onChange={e => setSearch(e.target.value)}
						className="w-full pl-8 pr-3 py-2 border border-[#e0e0e0] text-[11px] font-['Instrument_Sans'] focus:outline-none focus:border-[#0d0d0d] bg-white"
					/>
				</div>
			</div>

			{/* Events grid */}
			{filtered.length === 0 ? (
				<div className="py-24 text-center">
					<p className="font-['Syne'] font-bold text-2xl text-[#e0e0e0] mb-2">No events found</p>
					<p className="text-sm text-[#aaa] font-['Instrument_Sans']">Try a different search or filter.</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
					{filtered.map(event => (
						<button
							key={event.id}
							onClick={() => setSelected(event)}
							className="text-left flex flex-col bg-white border border-[#e0e0e0] hover:border-[#0d0d0d] transition-colors group"
						>
							{/* Cover image */}
							<div className="overflow-hidden h-44 shrink-0 relative">
								<img
									src={`https://picsum.photos/seed/ev${event.id}/600/300`}
									alt={event.title}
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
								/>
								<div className="absolute top-3 left-3 flex items-center gap-1.5">
									<span
										className={`text-[9px] font-bold uppercase tracking-[2px] px-2 py-0.5 font-['Instrument_Sans'] ${
											event.isOpen ? 'bg-[#d42b2b] text-white' : 'bg-[#f5f5f5] text-[#aaa]'
										}`}
									>
										{event.isOpen ? 'Open' : 'Closed'}
									</span>
									{registeredEventIds.has(event.id) && (
										<span className="text-[9px] font-bold uppercase tracking-[2px] px-2 py-0.5 font-['Instrument_Sans'] bg-green-50 text-green-700 border border-green-200">
											Registered
										</span>
									)}
								</div>
							</div>

							{/* Details */}
							<div className="p-4 flex flex-col flex-1">
								<h3 className="font-['Syne'] font-bold text-sm text-[#0d0d0d] mb-2 leading-snug group-hover:text-[#d42b2b] transition-colors line-clamp-2">
									{event.title}
								</h3>
								<p className="text-xs text-[#555] font-['Instrument_Sans'] leading-relaxed line-clamp-2 flex-1">
									{event.description}
								</p>
								<div className="flex flex-col gap-1 mt-3 text-xs text-[#aaa] font-['Instrument_Sans']">
									<span className="flex items-center gap-1.5">
										<Calendar size={11} className="shrink-0" />
										{formatEventDate(event.startDate, event.endDate)}
									</span>
									<span className="flex items-center gap-1.5">
										<MapPin size={11} className="shrink-0" />
										{event.venue}
									</span>
									<span className={`flex items-center gap-1.5 ${event.availableSlots <= 10 ? 'text-[#d42b2b] font-semibold' : ''}`}>
										<Users size={11} className="shrink-0" />
										{event.availableSlots} slots
									</span>
								</div>
							</div>
						</button>
					))}
				</div>
			)}

			{/* Detail modal */}
			{selected && (
				<div
					className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
					onClick={e => {
						if (e.target === e.currentTarget) setSelected(null);
					}}
				>
					<div className="bg-white w-full max-w-lg shadow-xl flex flex-col max-h-[90vh]">
						{/* Cover image */}
						<div className="relative h-36 shrink-0 overflow-hidden">
							<img
								src={`https://picsum.photos/seed/ev${selected.id}/800/300`}
								alt={selected.title}
								className="w-full h-full object-cover"
							/>
							<div className="absolute inset-0 bg-[#0d0d0d]/50" />
							<button
								onClick={() => setSelected(null)}
								className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
							>
								<X size={18} />
							</button>
							<div className="absolute bottom-3 left-5 flex items-center gap-2">
								<span
									className={`text-[10px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] px-2 py-0.5 border ${
										selected.isOpen
											? 'text-[#d42b2b] border-[#d42b2b] bg-white'
											: 'text-[#555] border-[#e0e0e0] bg-white'
									}`}
								>
									{selected.isOpen ? 'Open' : 'Closed'}
								</span>
								{registeredEventIds.has(selected.id) && (
									<span className="text-[10px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] px-2 py-0.5 border bg-white text-green-700 border-green-200">
										Registered
									</span>
								)}
							</div>
						</div>

						{/* Header */}
						<div className="shrink-0 px-6 py-4 border-b border-[#e0e0e0]">
							<h2 className="font-['Syne'] font-bold text-lg text-[#0d0d0d] leading-tight">{selected.title}</h2>
						</div>

						{/* Event details */}
						<div className="shrink-0 px-6 pt-5 pb-4 flex flex-col gap-2 border-b border-[#e0e0e0]">
							<div className="flex items-center gap-2 text-sm font-['Instrument_Sans'] text-[#0d0d0d]">
								<Calendar size={13} className="shrink-0 text-[#aaaaaa]" />
								{formatEventDate(selected.startDate, selected.endDate)}
							</div>
							<div className="flex items-center gap-2 text-sm font-['Instrument_Sans'] text-[#0d0d0d]">
								<MapPin size={13} className="shrink-0 text-[#aaaaaa]" />
								{selected.venue}
							</div>
							<div className="flex items-center gap-2 text-sm font-['Instrument_Sans']">
								<Users size={13} className="shrink-0 text-[#aaaaaa]" />
								<span className={selected.availableSlots <= 10 ? 'text-[#d42b2b] font-semibold' : 'text-[#0d0d0d]'}>
									{selected.availableSlots} slot{selected.availableSlots !== 1 ? 's' : ''} available
								</span>
							</div>
						</div>

						{/* Description — scrollable */}
						<div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-3">
							<p className="text-[11px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-[#aaaaaa]">
								About this Event
							</p>
							<p className="text-sm font-['Instrument_Sans'] text-[#0d0d0d] leading-relaxed">{selected.description}</p>
						</div>

						{/* Footer */}
						<div className="shrink-0 flex items-center justify-between px-6 py-4 border-t border-[#e0e0e0]">
							<div>
								{registeredEventIds.has(selected.id) ? (
									<span className="text-[10px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] text-green-700 bg-green-50 border border-green-200 px-4 py-2">
										Already Registered
									</span>
								) : selected.isOpen ? (
									<button
										onClick={() => handleRegister(selected)}
										className="text-[10px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] text-white bg-[#d42b2b] px-4 py-2 hover:bg-[#b82424] transition-colors"
									>
										Register Now
									</button>
								) : (
									<span className="text-[10px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] text-[#aaaaaa]">
										Registration Closed
									</span>
								)}
							</div>
							<button
								onClick={() => setSelected(null)}
								className="text-sm font-['Instrument_Sans'] font-medium text-[#aaaaaa] hover:text-[#0d0d0d] transition-colors px-4 py-2"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</YouthLayout>
	);
}
