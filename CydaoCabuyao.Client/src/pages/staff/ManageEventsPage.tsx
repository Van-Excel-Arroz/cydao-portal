import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { BARANGAY_LABELS } from '@/types';
import type { CydaoEvent, CreateEventDto, EventRegistrationEventDto } from '@/types';
import { Btn } from '@/components/shared/Btn';
import { DataTable, tableRowClass } from '@/components/shared/DataTable';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/shared/Modal';
import { ToggleSwitch } from '@/components/shared/ToggleSwitch';
import { FormField, FieldInput, FieldTextarea } from '@/components/shared/FormField';
import { SearchInput } from '@/components/shared/SearchInput';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import api from '@/lib/api';

interface EventForm {
	title: string;
	description: string;
	startDate: string;
	endDate: string;
	venue: string;
	availableSlots: number;
	isOpen: boolean;
}

const emptyForm: EventForm = {
	title: '',
	description: '',
	startDate: '',
	endDate: '',
	venue: '',
	availableSlots: 50,
	isOpen: true,
};

const STATUS_OPTIONS = [
	{ label: 'All', value: 'all' },
	{ label: 'Open', value: 'open' },
	{ label: 'Closed', value: 'closed' },
] as const;

export default function ManageEventsPage() {
	const queryClient = useQueryClient();
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
	const [modalOpen, setModalOpen] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [form, setForm] = useState<EventForm>(emptyForm);
	const [formErrors, setFormErrors] = useState<Partial<Record<keyof EventForm, string>>>({});
	const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
	const [registrantsEventId, setRegistrantsEventId] = useState<number | null>(null);
	const [confirmRemoveRegId, setConfirmRemoveRegId] = useState<number | null>(null);

	const { data: events = [], isLoading } = useQuery({
		queryKey: ['events'],
		queryFn: () => api.get<CydaoEvent[]>('/events').then(r => r.data),
	});

	const { data: panelRegs = [] } = useQuery({
		queryKey: ['registrations', 'event', registrantsEventId],
		queryFn: () =>
			api.get<EventRegistrationEventDto[]>(`/eventregistrations/event/${registrantsEventId}`).then(r => r.data),
		enabled: registrantsEventId !== null,
	});

	const createMutation = useMutation({
		mutationFn: (dto: CreateEventDto) => api.post('/events', dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['events'] });
			closeModal();
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, dto }: { id: number; dto: CreateEventDto }) => api.put(`/events/${id}`, dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['events'] });
			closeModal();
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: number) => api.delete(`/events/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['events'] });
			setConfirmDeleteId(null);
		},
	});

	const removeRegMutation = useMutation({
		mutationFn: (regId: number) => api.delete(`/eventregistrations/${regId}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['registrations', 'event', registrantsEventId] });
			setConfirmRemoveRegId(null);
		},
	});

	const filtered = events.filter(e => {
		const matchSearch = e.title.toLowerCase().includes(search.toLowerCase());
		const matchStatus = statusFilter === 'all' || (statusFilter === 'open' ? e.isOpen : !e.isOpen);
		return matchSearch && matchStatus;
	});

	const registrantsEvent = events.find(e => e.id === registrantsEventId) ?? null;

	function openRegistrants(eventId: number) {
		setRegistrantsEventId(eventId);
		setConfirmRemoveRegId(null);
	}

	function closeRegistrants() {
		setRegistrantsEventId(null);
		setConfirmRemoveRegId(null);
	}

	function openCreate() {
		setForm(emptyForm);
		setEditingId(null);
		setFormErrors({});
		setModalOpen(true);
	}

	function openEdit(event: CydaoEvent) {
		setForm({
			title: event.title,
			description: event.description,
			startDate: event.startDate.slice(0, 16),
			endDate: event.endDate.slice(0, 16),
			venue: event.venue,
			availableSlots: event.availableSlots,
			isOpen: event.isOpen,
		});
		setEditingId(event.id);
		setFormErrors({});
		setModalOpen(true);
	}

	function closeModal() {
		setModalOpen(false);
		setFormErrors({});
	}

	function validate(): boolean {
		const e: Partial<Record<keyof EventForm, string>> = {};
		if (!form.title.trim()) e.title = 'Title is required';
		if (!form.description.trim()) e.description = 'Description is required';
		if (!form.startDate) e.startDate = 'Start date is required';
		if (!form.endDate) e.endDate = 'End date is required';
		if (form.startDate && form.endDate && form.endDate < form.startDate)
			e.endDate = 'End date must be after start date';
		if (!form.venue.trim()) e.venue = 'Venue is required';
		if (!form.availableSlots || form.availableSlots < 1) e.availableSlots = 'Slots must be at least 1';
		setFormErrors(e);
		return Object.keys(e).length === 0;
	}

	function handleSave() {
		if (!validate()) return;
		const dto: CreateEventDto = {
			title: form.title,
			description: form.description,
			startDate: new Date(form.startDate).toISOString(),
			endDate: new Date(form.endDate).toISOString(),
			venue: form.venue,
			availableSlots: form.availableSlots,
			isOpen: form.isOpen,
		};
		if (editingId !== null) {
			updateMutation.mutate({ id: editingId, dto });
		} else {
			createMutation.mutate(dto);
		}
	}

	function formatDate(iso: string) {
		return new Date(iso).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
	}

	const isSaving = createMutation.isPending || updateMutation.isPending;

	return (
		<AdminLayout title="Events" description="Create and manage CYDAO events." noScroll>
			<div className="flex flex-col h-full gap-4 min-h-0">
				{/* Toolbar */}
				<div className="shrink-0 flex items-center gap-3 flex-wrap">
					<SearchInput
						value={search}
						onChange={e => setSearch(e.target.value)}
						placeholder="Search events..."
						containerClassName="w-56"
					/>

					<SegmentedControl options={[...STATUS_OPTIONS]} value={statusFilter} onChange={setStatusFilter} />

					<div className="flex-1" />

					<Btn variant="primary" size="md" onClick={openCreate} className="flex items-center gap-2 shrink-0">
						<Plus size={14} /> New Event
					</Btn>
				</div>

				{/* Table */}
				<DataTable
					columns={[
						{ label: 'Title' },
						{ label: 'Venue' },
						{ label: 'Date' },
						{ label: 'Registered', center: true },
						{ label: 'Status', center: true },
						{ label: 'Actions', center: true },
					]}
					colsClass="grid-cols-[2fr_1.5fr_1fr_110px_1fr_120px]"
					empty={!isLoading && filtered.length === 0}
					emptyMessage={isLoading ? 'Loading...' : 'No events match your filters.'}
					footer={`Showing ${filtered.length} of ${events.length} events`}
				>
					{filtered.map((event, i) => (
						<div key={event.id} className={`grid grid-cols-[2fr_1.5fr_1fr_110px_1fr_120px] ${tableRowClass(i)}`}>
							<div className="px-5 py-3.5">
								<p className="text-sm font-semibold text-[#0d0d0d] font-['Instrument_Sans'] leading-tight">
									{event.title}
								</p>
								<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans'] mt-0.5 line-clamp-1">
									{event.description}
								</p>
							</div>

							<div className="px-5 py-3.5 flex items-center">
								<p className="text-sm text-[#0d0d0d] font-['Instrument_Sans'] line-clamp-1">{event.venue}</p>
							</div>

							<div className="px-5 py-3.5 flex items-center">
								<p className="text-sm text-[#0d0d0d] font-['Instrument_Sans']">{formatDate(event.startDate)}</p>
							</div>

							<div className="px-5 py-3.5 flex items-center justify-center">
								<button
									onClick={() => openRegistrants(event.id)}
									className="flex items-center gap-1.5 text-[#0d0d0d] hover:text-[#d42b2b] transition-colors cursor-pointer"
								>
									<Users size={13} />
									<span className="text-sm font-semibold font-['Instrument_Sans']">— / {event.availableSlots}</span>
								</button>
							</div>

							<div className="px-5 py-3.5 flex items-center justify-center">
								<span
									className={`text-[10px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] px-2 py-0.5 border ${
										event.isOpen
											? 'bg-green-50 text-green-700 border-green-200'
											: 'bg-[#f5f5f5] text-[#aaaaaa] border-[#e0e0e0]'
									}`}
								>
									{event.isOpen ? 'Open' : 'Closed'}
								</span>
							</div>

							<div className="px-5 py-3.5 flex items-center justify-center gap-3">
								{confirmDeleteId === event.id ? (
									<>
										<Btn
											variant="danger"
											size="sm"
											onClick={() => deleteMutation.mutate(event.id)}
											disabled={deleteMutation.isPending}
										>
											Yes
										</Btn>
										<Btn variant="ghost" size="sm" onClick={() => setConfirmDeleteId(null)}>
											No
										</Btn>
									</>
								) : (
									<>
										<Btn variant="icon" onClick={() => openEdit(event)} title="Edit">
											<Pencil size={14} />
										</Btn>
										<Btn
											variant="icon"
											onClick={() => setConfirmDeleteId(event.id)}
											title="Delete"
											className="hover:text-[#d42b2b]"
										>
											<Trash2 size={14} />
										</Btn>
									</>
								)}
							</div>
						</div>
					))}
				</DataTable>
			</div>

			{/* Registrants Panel Modal */}
			<Modal
				open={registrantsEventId !== null && registrantsEvent !== null}
				onClose={closeRegistrants}
				maxWidth="max-w-2xl"
				maxHeight="h-[80vh]"
			>
				{registrantsEvent && (
					<>
						<ModalHeader
							title={registrantsEvent.title}
							eyebrow={`Registrants — ${panelRegs.length} / ${registrantsEvent.availableSlots} slots`}
							onClose={closeRegistrants}
						>
							<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans'] mt-1">
								{registrantsEvent.venue} &middot; {formatDate(registrantsEvent.startDate)}
							</p>
						</ModalHeader>

						{/* Registrants list */}
						<div className="flex-1 overflow-y-scroll">
							{/* List header */}
							<div className="grid grid-cols-[1fr_1fr_1fr_80px] border-b border-[#e0e0e0] bg-[#fafafa]">
								{['Name', 'Barangay', 'Registered', ''].map((h, idx) => (
									<div
										key={idx}
										className="px-5 py-2.5 text-[10px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-[#aaaaaa]"
									>
										{h}
									</div>
								))}
							</div>

							{panelRegs.length === 0 ? (
								<div className="flex items-center justify-center h-32">
									<p className="text-sm text-[#aaaaaa] font-['Instrument_Sans']">No registrants yet.</p>
								</div>
							) : (
								panelRegs.map((reg, i) => (
									<div
										key={reg.id}
										className={`grid grid-cols-[1fr_1fr_1fr_80px] border-b border-[#f5f5f5] last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}
									>
										<div className="px-5 py-3 flex items-center">
											<p className="text-sm font-semibold text-[#0d0d0d] font-['Instrument_Sans']">
												{reg.registrantName}
											</p>
										</div>
										<div className="px-5 py-3 flex items-center">
											<p className="text-sm text-[#0d0d0d] font-['Instrument_Sans']">{BARANGAY_LABELS[reg.barangay]}</p>
										</div>
										<div className="px-5 py-3 flex items-center">
											<p className="text-sm text-[#aaaaaa] font-['Instrument_Sans']">
												{new Date(reg.registeredAt).toLocaleDateString('en-PH', {
													month: 'short',
													day: 'numeric',
													year: 'numeric',
												})}
											</p>
										</div>
										<div className="px-5 py-3 flex items-center">
											{confirmRemoveRegId === reg.id ? (
												<div className="flex items-center gap-2">
													<Btn
														variant="danger"
														size="sm"
														className="text-[9px] px-2 py-1"
														onClick={() => removeRegMutation.mutate(reg.id)}
														disabled={removeRegMutation.isPending}
													>
														Yes
													</Btn>
													<Btn
														variant="ghost"
														size="sm"
														className="text-[9px]"
														onClick={() => setConfirmRemoveRegId(null)}
													>
														No
													</Btn>
												</div>
											) : (
												<Btn
													variant="icon"
													onClick={() => setConfirmRemoveRegId(reg.id)}
													title="Remove"
													className="hover:text-[#d42b2b]"
												>
													<Trash2 size={13} />
												</Btn>
											)}
										</div>
									</div>
								))
							)}
						</div>

						<div className="shrink-0 border-t border-[#e0e0e0] px-6 py-2.5 bg-[#fafafa]">
							<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans']">
								{registrantsEvent.availableSlots - panelRegs.length} slots remaining
							</p>
						</div>
					</>
				)}
			</Modal>

			{/* Create / Edit Modal */}
			<Modal open={modalOpen} onClose={closeModal}>
				<ModalHeader
					title={editingId !== null ? 'Edit Event' : 'Create Event'}
					eyebrow={editingId !== null ? 'Edit' : 'New'}
					onClose={closeModal}
				/>

				<ModalBody scroll className="flex flex-col gap-4 max-h-[70vh]">
					<FormField label="Title" error={formErrors.title}>
						<FieldInput
							value={form.title}
							onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
							placeholder="e.g. CYDAO Youth Summit 2026"
						/>
					</FormField>

					<FormField label="Description" error={formErrors.description}>
						<FieldTextarea
							value={form.description}
							onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
							placeholder="Describe the event and its purpose..."
							rows={3}
						/>
					</FormField>

					<FormField label="Venue" error={formErrors.venue}>
						<FieldInput
							value={form.venue}
							onChange={e => setForm(f => ({ ...f, venue: e.target.value }))}
							placeholder="e.g. Cabuyao City Hall Auditorium"
						/>
					</FormField>

					<div className="grid grid-cols-2 gap-4">
						<FormField label="Start Date & Time" error={formErrors.startDate}>
							<FieldInput
								type="datetime-local"
								value={form.startDate}
								onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
							/>
						</FormField>

						<FormField label="End Date & Time" error={formErrors.endDate}>
							<FieldInput
								type="datetime-local"
								value={form.endDate}
								onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
							/>
						</FormField>
					</div>

					<FormField label="Available Slots" error={formErrors.availableSlots}>
						<FieldInput
							type="number"
							min={1}
							value={form.availableSlots}
							onChange={e => setForm(f => ({ ...f, availableSlots: Number(e.target.value) }))}
							placeholder="e.g. 100"
						/>
					</FormField>

					<div className="flex items-center justify-between py-1">
						<div>
							<p className="text-[11px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-[#0d0d0d]">
								Accept Registrations
							</p>
							<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans'] mt-0.5">
								Toggle to open or close this event
							</p>
						</div>
						<ToggleSwitch checked={form.isOpen} onChange={checked => setForm(f => ({ ...f, isOpen: checked }))} />
					</div>
				</ModalBody>

				<ModalFooter>
					<div />
					<div className="flex items-center gap-3">
						<Btn variant="ghost" onClick={closeModal} className="px-4 py-2 text-sm">
							Cancel
						</Btn>
						<Btn variant="primary" size="lg" onClick={handleSave} disabled={isSaving}>
							{isSaving ? 'Saving...' : editingId !== null ? 'Save Changes' : 'Create Event'}
						</Btn>
					</div>
				</ModalFooter>
			</Modal>
		</AdminLayout>
	);
}
