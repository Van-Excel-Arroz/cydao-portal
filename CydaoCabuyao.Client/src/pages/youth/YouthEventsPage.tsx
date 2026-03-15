import { useState, useMemo } from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { YouthLayout } from '@/components/layout/YouthLayout';
import { useRegistrationsStore } from '@/stores/registrationsStore';
import { OpenBadge, Badge } from '@/components/shared/Badge';
import { Btn } from '@/components/shared/Btn';
import { EmptyState } from '@/components/shared/EmptyState';
import { Modal, ModalCover, ModalHeader, ModalBody, ModalFooter } from '@/components/shared/Modal';
import { SearchInput } from '@/components/shared/SearchInput';
import { SegmentedControl } from '@/components/shared/SegmentedControl';

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

const STATUS_OPTIONS = [
	{ label: 'All', value: 'all' },
	{ label: 'Open', value: 'open' },
	{ label: 'Closed', value: 'closed' },
] as const;

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
				<SegmentedControl
					options={[...STATUS_OPTIONS]}
					value={status}
					onChange={setStatus}
				/>
				<SearchInput
					placeholder="Search events or venues..."
					value={search}
					onChange={e => setSearch(e.target.value)}
					containerClassName="w-52 ml-auto"
				/>
			</div>

			{/* Events grid */}
			{filtered.length === 0 ? (
				<EmptyState variant="page" title="No events found" subtitle="Try a different search or filter." />
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
					{filtered.map(event => (
						<button
							key={event.id}
							onClick={() => setSelected(event)}
							className="text-left flex flex-col bg-white border border-[#e0e0e0] hover:border-[#0d0d0d] transition-colors group cursor-pointer"
						>
							{/* Cover image */}
							<div className="overflow-hidden h-44 shrink-0 relative">
								<img
									src={`https://picsum.photos/seed/ev${event.id}/600/300`}
									alt={event.title}
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
								/>
								<div className="absolute top-3 left-3 flex items-center gap-1.5">
									<OpenBadge isOpen={event.isOpen} />
									{registeredEventIds.has(event.id) && (
										<Badge className="bg-green-50 text-green-700 border-green-200">Registered</Badge>
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
			<Modal open={!!selected} onClose={() => setSelected(null)}>
				{selected && (
					<>
						<ModalCover
							src={`https://picsum.photos/seed/ev${selected.id}/800/300`}
							alt={selected.title}
							onClose={() => setSelected(null)}
						>
							<OpenBadge isOpen={selected.isOpen} variant="outline" />
							{registeredEventIds.has(selected.id) && (
								<Badge className="bg-white text-green-700 border-green-200">Registered</Badge>
							)}
						</ModalCover>

						<ModalHeader title={selected.title} />

						<ModalBody scroll={false} className="flex flex-col gap-2 border-b border-[#e0e0e0]">
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
						</ModalBody>

						<ModalBody>
							<p className="text-[11px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-[#aaaaaa] mb-3">
								About this Event
							</p>
							<p className="text-sm font-['Instrument_Sans'] text-[#0d0d0d] leading-relaxed">{selected.description}</p>
						</ModalBody>

						<ModalFooter>
							<div>
								{registeredEventIds.has(selected.id) ? (
									<Badge className="bg-green-50 text-green-700 border-green-200 px-4 py-2 text-[10px] tracking-[1px]">
										Already Registered
									</Badge>
								) : selected.isOpen ? (
									<Btn variant="primary" size="sm" onClick={() => handleRegister(selected)}>
										Register Now
									</Btn>
								) : (
									<span className="text-[10px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] text-[#aaaaaa]">
										Registration Closed
									</span>
								)}
							</div>
							<Btn variant="ghost" onClick={() => setSelected(null)} className="px-4 py-2 text-sm">Close</Btn>
						</ModalFooter>
					</>
				)}
			</Modal>
		</YouthLayout>
	);
}
