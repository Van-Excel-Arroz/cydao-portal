import { useState, useMemo } from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { YouthLayout } from '@/components/layout/YouthLayout';
import type { CydaoEvent, EventRegistrationUserDto } from '@/types';
import { OpenBadge, Badge } from '@/components/shared/Badge';
import { Btn } from '@/components/shared/Btn';
import { EmptyState } from '@/components/shared/EmptyState';
import { Modal, ModalCover, ModalHeader, ModalBody, ModalFooter } from '@/components/shared/Modal';
import { SearchInput } from '@/components/shared/SearchInput';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import api from '@/lib/api';

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
	const [selected, setSelected] = useState<CydaoEvent | null>(null);

	const queryClient = useQueryClient();

	const { data: events = [], isLoading } = useQuery({
		queryKey: ['events'],
		queryFn: () => api.get<CydaoEvent[]>('/events').then(r => r.data),
	});

	const { data: myRegistrations = [] } = useQuery({
		queryKey: ['my-registrations'],
		queryFn: () => api.get<EventRegistrationUserDto[]>('/eventregistrations/user').then(r => r.data),
	});

	const registeredEventIds = new Set(myRegistrations.map(r => r.eventId));

	const registerMutation = useMutation({
		mutationFn: (eventId: number) => api.post('/eventregistrations', { eventId }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
			queryClient.invalidateQueries({ queryKey: ['events'] });
			setSelected(null);
		},
	});

	const filtered = useMemo(() => {
		let list = [...events];
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
	}, [events, search, status]);

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
			{isLoading ? (
				<EmptyState variant="page" title="Loading events..." subtitle="Please wait." />
			) : filtered.length === 0 ? (
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
									<Btn
										variant="primary"
										size="sm"
										onClick={() => registerMutation.mutate(selected.id)}
										disabled={registerMutation.isPending}
									>
										{registerMutation.isPending ? 'Registering...' : 'Register Now'}
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
