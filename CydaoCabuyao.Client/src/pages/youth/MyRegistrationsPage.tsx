import { useState } from 'react';
import { X, MapPin, Calendar, Users } from 'lucide-react';
import { YouthLayout } from '@/components/layout/YouthLayout';

interface MyRegistration {
	id: number;
	eventTitle: string;
	eventDescription: string;
	startDate: string;
	endDate: string;
	venue: string;
	availableSlots: number;
	registeredAt: string;
}

const eventImages: Record<number, string> = {
	1: 'https://picsum.photos/seed/event-kabataan/800/300',
	2: 'https://picsum.photos/seed/event-livelihood/800/300',
	3: 'https://picsum.photos/seed/event-sports/800/300',
};

const initialRegistrations: MyRegistration[] = [
	{
		id: 1,
		eventTitle: 'Kabataan Caravan 2026',
		eventDescription:
			'An annual multi-day youth development caravan traversing all 18 barangays of Cabuyao. Activities include leadership talks, health services, livelihood demonstrations, and cultural presentations. All registered participants are expected to attend at least three barangay stops and assist in facilitating activities.',
		startDate: '2026-04-10T08:00:00Z',
		endDate: '2026-04-12T17:00:00Z',
		venue: 'Various Barangays, Cabuyao City',
		availableSlots: 12,
		registeredAt: '2026-03-02T09:00:00Z',
	},
	{
		id: 2,
		eventTitle: 'Livelihood Skills Fair',
		eventDescription:
			'A two-day skills fair featuring booths and hands-on stations for cooking, digital marketing, welding, dressmaking, and basic electronics repair. Participants may attend any or all stations and will receive a certificate of participation upon completing at least four stations.',
		startDate: '2026-04-25T09:00:00Z',
		endDate: '2026-04-26T16:00:00Z',
		venue: 'Cabuyao City Hall Grounds',
		availableSlots: 3,
		registeredAt: '2026-03-06T14:30:00Z',
	},
	{
		id: 3,
		eventTitle: 'Inter-Barangay Sports Cup',
		eventDescription:
			'Annual inter-barangay sports competition open to youth aged 15–30. Events include basketball, volleyball, badminton, and athletics. Teams must be registered by barangay. Individual participants may join athletics events. Medals and certificates will be awarded to top three finishers in each category.',
		startDate: '2026-05-03T07:00:00Z',
		endDate: '2026-05-04T18:00:00Z',
		venue: 'Cabuyao Sports Complex',
		availableSlots: 28,
		registeredAt: '2026-03-10T11:00:00Z',
	},
];

function formatDate(dateStr: string) {
	return new Date(dateStr).toLocaleDateString('en-PH', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
}

function formatDateRange(start: string, end: string) {
	const s = new Date(start);
	const e = new Date(end);
	const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
	if (sameMonth) {
		return `${s.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}–${e.toLocaleDateString('en-PH', { day: 'numeric', year: 'numeric' })}`;
	}
	return `${formatDate(start)} – ${formatDate(end)}`;
}

export default function MyRegistrationsPage() {
	const [registrations, setRegistrations] = useState<MyRegistration[]>(initialRegistrations);
	const [selectedReg, setSelectedReg] = useState<MyRegistration | null>(null);
	const [confirmCancel, setConfirmCancel] = useState(false);

	function handleCancel() {
		if (!selectedReg) return;
		setRegistrations(prev => prev.filter(r => r.id !== selectedReg.id));
		setSelectedReg(null);
		setConfirmCancel(false);
	}

	function handleCloseModal() {
		setSelectedReg(null);
		setConfirmCancel(false);
	}

	return (
		<YouthLayout title="My Registrations" noScroll>
			<div className="flex flex-col h-full min-h-0">
				<div className="flex-1 flex flex-col min-h-0 bg-white border border-[#e0e0e0]">
					{/* Scrollable area */}
					<div className="flex-1 overflow-y-scroll">
						{/* Sticky header */}
						<div className="sticky top-0 z-10 grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-[#e0e0e0] bg-[#fafafa]">
							{(
								[
									{ label: 'Event', center: false },
									{ label: 'Date', center: true },
									{ label: 'Venue', center: true },
									{ label: 'Slots Left', center: true },
								] as const
							).map(({ label, center }) => (
								<div
									key={label}
									className={`px-5 py-3 text-[10px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-[#aaaaaa] ${center ? 'text-center' : ''}`}
								>
									{label}
								</div>
							))}
						</div>

						{/* Rows */}
						{registrations.length === 0 ? (
							<div className="flex items-center justify-center h-40">
								<p className="text-sm text-[#aaaaaa] font-['Instrument_Sans']">
									You have not registered for any events yet.
								</p>
							</div>
						) : (
							registrations.map((reg, i) => (
								<button
									key={reg.id}
									onClick={() => { setSelectedReg(reg); setConfirmCancel(false); }}
									className={`w-full text-left grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-[#f5f5f5] last:border-0 hover:bg-[#fafafa] transition-colors ${
										i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'
									}`}
								>
									<div className="px-5 py-3.5">
										<p className="text-sm font-semibold text-[#0d0d0d] font-['Instrument_Sans'] leading-tight">
											{reg.eventTitle}
										</p>
									</div>

									<div className="px-5 py-3.5 flex items-center justify-center">
										<p className="text-sm text-[#0d0d0d] font-['Instrument_Sans'] text-center">
											{formatDateRange(reg.startDate, reg.endDate)}
										</p>
									</div>

									<div className="px-5 py-3.5 flex items-center justify-center">
										<p className="text-sm text-[#0d0d0d] font-['Instrument_Sans'] text-center line-clamp-1">
											{reg.venue}
										</p>
									</div>

									<div className="px-5 py-3.5 flex items-center justify-center">
										<span className={`text-sm font-semibold font-['Instrument_Sans'] ${reg.availableSlots <= 5 ? 'text-[#d42b2b]' : 'text-[#0d0d0d]'}`}>
											{reg.availableSlots}
										</span>
									</div>
								</button>
							))
						)}
					</div>

					{/* Footer */}
					<div className="shrink-0 border-t border-[#e0e0e0] px-5 py-2.5 bg-[#fafafa]">
						<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans']">
							{registrations.length} registration{registrations.length !== 1 ? 's' : ''}
						</p>
					</div>
				</div>
			</div>

			{/* Detail modal */}
			{selectedReg && (
				<div
					className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
					onClick={e => { if (e.target === e.currentTarget) handleCloseModal(); }}
				>
					<div className="bg-white w-full max-w-lg shadow-xl">
						{/* Cover image */}
						<div className="relative h-36 overflow-hidden">
							<img
								src={eventImages[selectedReg.id]}
								alt={selectedReg.eventTitle}
								className="w-full h-full object-cover"
							/>
							<div className="absolute inset-0 bg-[#0d0d0d]/50" />
							<button
								onClick={handleCloseModal}
								className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
							>
								<X size={18} />
							</button>
						</div>

						{/* Header */}
						<div className="px-6 py-4 border-b border-[#e0e0e0]">
							<h2 className="font-['Syne'] font-bold text-lg text-[#0d0d0d] leading-tight">
								{selectedReg.eventTitle}
							</h2>
							<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans'] mt-1">
								Registered {formatDate(selectedReg.registeredAt)}
							</p>
						</div>

						{/* Body */}
						<div className="px-6 py-5 flex flex-col gap-4">
							{/* Event details */}
							<div className="flex flex-col gap-2">
								<div className="flex items-center gap-2 text-sm font-['Instrument_Sans'] text-[#0d0d0d]">
									<Calendar size={13} className="shrink-0 text-[#aaaaaa]" />
									{formatDateRange(selectedReg.startDate, selectedReg.endDate)}
								</div>
								<div className="flex items-center gap-2 text-sm font-['Instrument_Sans'] text-[#0d0d0d]">
									<MapPin size={13} className="shrink-0 text-[#aaaaaa]" />
									{selectedReg.venue}
								</div>
								<div className="flex items-center gap-2 text-sm font-['Instrument_Sans']">
									<Users size={13} className="shrink-0 text-[#aaaaaa]" />
									<span className={selectedReg.availableSlots <= 5 ? 'text-[#d42b2b] font-semibold' : 'text-[#0d0d0d]'}>
										{selectedReg.availableSlots} slot{selectedReg.availableSlots !== 1 ? 's' : ''} remaining
									</span>
								</div>
							</div>

							{/* Description */}
							<div className="border-t border-[#e0e0e0] pt-4">
								<p className="text-[11px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-[#aaaaaa] mb-2">
									About this Event
								</p>
								<div className="max-h-36 overflow-y-auto pr-1">
									<p className="text-sm font-['Instrument_Sans'] text-[#0d0d0d] leading-relaxed">
										{selectedReg.eventDescription}
									</p>
								</div>
							</div>
						</div>

						{/* Footer */}
						<div className="flex items-center justify-between px-6 py-4 border-t border-[#e0e0e0]">
							<div>
								{confirmCancel ? (
									<div className="flex items-center gap-3">
										<p className="text-xs text-[#0d0d0d] font-['Instrument_Sans']">Cancel this registration?</p>
										<button
											onClick={handleCancel}
											className="text-[10px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] text-white bg-[#d42b2b] px-3 py-1.5 hover:bg-[#b82424] transition-colors"
										>
											Yes, Cancel
										</button>
										<button
											onClick={() => setConfirmCancel(false)}
											className="text-[10px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] text-[#aaaaaa] hover:text-[#0d0d0d] transition-colors"
										>
											No
										</button>
									</div>
								) : (
									<button
										onClick={() => setConfirmCancel(true)}
										className="text-[10px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] text-[#d42b2b] border border-[#d42b2b] px-3 py-1.5 hover:bg-red-50 transition-colors"
									>
										Cancel Registration
									</button>
								)}
							</div>
							<button
								onClick={handleCloseModal}
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
