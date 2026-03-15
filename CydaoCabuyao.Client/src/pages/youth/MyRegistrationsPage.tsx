import { useState } from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { YouthLayout } from '@/components/layout/YouthLayout';
import { useRegistrationsStore } from '@/stores/registrationsStore';
import type { StoredRegistration } from '@/stores/registrationsStore';
import { Btn } from '@/components/shared/Btn';
import { DataTable, tableRowClass } from '@/components/shared/DataTable';
import { Modal, ModalCover, ModalHeader, ModalBody, ModalFooter } from '@/components/shared/Modal';

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

const COLS = [
	{ label: 'Event' },
	{ label: 'Date', center: true },
	{ label: 'Venue', center: true },
	{ label: 'Slots Left', center: true },
] as const;

export default function MyRegistrationsPage() {
	const { registrations, cancelRegistration } = useRegistrationsStore();
	const [selectedReg, setSelectedReg] = useState<StoredRegistration | null>(null);
	const [confirmCancel, setConfirmCancel] = useState(false);

	function handleCancel() {
		if (!selectedReg) return;
		cancelRegistration(selectedReg.id);
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
				<DataTable
					columns={[...COLS]}
					colsClass="grid-cols-[2fr_1fr_1fr_1fr]"
					empty={registrations.length === 0}
					emptyMessage="You have not registered for any events yet."
					footer={`${registrations.length} registration${registrations.length !== 1 ? 's' : ''}`}
				>
					{registrations.map((reg, i) => (
						<button
							key={reg.id}
							onClick={() => { setSelectedReg(reg); setConfirmCancel(false); }}
							className={`w-full text-left grid grid-cols-[2fr_1fr_1fr_1fr] hover:bg-[#fafafa] transition-colors cursor-pointer ${tableRowClass(i)}`}
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
								<p className="text-sm text-[#0d0d0d] font-['Instrument_Sans'] text-center line-clamp-1">{reg.venue}</p>
							</div>
							<div className="px-5 py-3.5 flex items-center justify-center">
								<span className={`text-sm font-semibold font-['Instrument_Sans'] ${reg.availableSlots <= 10 ? 'text-[#d42b2b]' : 'text-[#0d0d0d]'}`}>
									{reg.availableSlots}
								</span>
							</div>
						</button>
					))}
				</DataTable>
			</div>

			{/* Detail modal */}
			<Modal open={!!selectedReg} onClose={handleCloseModal}>
				{selectedReg && (
					<>
						<ModalCover
							src={`https://picsum.photos/seed/ev${selectedReg.eventId}/800/300`}
							alt={selectedReg.eventTitle}
							onClose={handleCloseModal}
						/>

						<ModalHeader title={selectedReg.eventTitle}>
							<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans'] mt-1">
								Registered {formatDate(selectedReg.registeredAt)}
							</p>
						</ModalHeader>

						<ModalBody scroll={false} className="flex flex-col gap-2 border-b border-[#e0e0e0]">
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
								<span className={selectedReg.availableSlots <= 10 ? 'text-[#d42b2b] font-semibold' : 'text-[#0d0d0d]'}>
									{selectedReg.availableSlots} slot{selectedReg.availableSlots !== 1 ? 's' : ''} remaining
								</span>
							</div>
						</ModalBody>

						<ModalBody>
							<p className="text-[11px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-[#aaaaaa] mb-3">
								About this Event
							</p>
							<p className="text-sm font-['Instrument_Sans'] text-[#0d0d0d] leading-relaxed">
								{selectedReg.eventDescription}
							</p>
						</ModalBody>

						<ModalFooter>
							<div>
								{confirmCancel ? (
									<div className="flex items-center gap-3">
										<p className="text-xs text-[#0d0d0d] font-['Instrument_Sans']">Cancel this registration?</p>
										<Btn variant="danger" size="sm" onClick={handleCancel}>Yes, Cancel</Btn>
										<Btn variant="ghost" size="sm" onClick={() => setConfirmCancel(false)}>No</Btn>
									</div>
								) : (
									<Btn variant="danger-outline" size="sm" onClick={() => setConfirmCancel(true)}>
										Cancel Registration
									</Btn>
								)}
							</div>
							<Btn variant="ghost" onClick={handleCloseModal} className="px-4 py-2 text-sm">Close</Btn>
						</ModalFooter>
					</>
				)}
			</Modal>
		</YouthLayout>
	);
}
