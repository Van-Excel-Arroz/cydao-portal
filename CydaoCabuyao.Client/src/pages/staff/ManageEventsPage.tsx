import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, X, Users } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { BARANGAY_LABELS } from '@/types';
import type { CydaoEvent } from '@/types';

// --- Mock data (replace with API calls once backend is ready) ---
const initialEvents: CydaoEvent[] = [
	{
		id: 1,
		title: 'CYDAO Youth Summit 2026',
		description: 'Annual gathering of youth leaders from all barangays of Cabuyao to discuss community initiatives.',
		startDate: '2026-04-10T08:00:00Z',
		endDate: '2026-04-10T17:00:00Z',
		venue: 'Cabuyao City Hall Auditorium',
		availableSlots: 200,
		isOpen: true,
		createdAt: '2026-02-01T00:00:00Z',
	},
	{
		id: 2,
		title: 'Inter-Barangay Basketball Tournament',
		description: 'Friendly basketball competition among youth representatives of all 18 barangays of Cabuyao.',
		startDate: '2026-04-20T07:00:00Z',
		endDate: '2026-04-22T18:00:00Z',
		venue: 'Cabuyao Sports Complex',
		availableSlots: 150,
		isOpen: true,
		createdAt: '2026-02-05T00:00:00Z',
	},
	{
		id: 3,
		title: 'Environmental Clean-Up Drive',
		description: 'Community clean-up at Laguna de Bay shoreline involving youth volunteers across all barangays.',
		startDate: '2026-03-22T06:00:00Z',
		endDate: '2026-03-22T12:00:00Z',
		venue: 'Mamatid Shoreline, Cabuyao',
		availableSlots: 100,
		isOpen: false,
		createdAt: '2026-02-10T00:00:00Z',
	},
	{
		id: 4,
		title: 'Skills Training Workshop: Digital Literacy',
		description:
			'Hands-on workshop covering basic computer skills, social media responsibility, and digital entrepreneurship.',
		startDate: '2026-05-05T09:00:00Z',
		endDate: '2026-05-05T16:00:00Z',
		venue: 'Cabuyao City Library and Learning Hub',
		availableSlots: 60,
		isOpen: true,
		createdAt: '2026-02-15T00:00:00Z',
	},
	{
		id: 5,
		title: 'Kabataang Cabuyao Cultural Night',
		description:
			'Showcase of local talent featuring traditional and contemporary Filipino arts, dance, and music performances.',
		startDate: '2026-06-12T18:00:00Z',
		endDate: '2026-06-12T22:00:00Z',
		venue: 'Cabuyao City Plaza',
		availableSlots: 500,
		isOpen: true,
		createdAt: '2026-02-20T00:00:00Z',
	},
];

interface MockRegistration {
	id: number;
	eventId: number;
	registrantName: string;
	barangay: number;
	registeredAt: string;
}

const initialRegistrations: MockRegistration[] = [
	{ id: 1, eventId: 1, registrantName: 'Juan dela Cruz', barangay: 16, registeredAt: '2026-03-01T10:00:00Z' },
	{ id: 2, eventId: 1, registrantName: 'Maria Santos', barangay: 3, registeredAt: '2026-03-02T09:30:00Z' },
	{ id: 3, eventId: 1, registrantName: 'Carlo Reyes', barangay: 9, registeredAt: '2026-03-03T14:00:00Z' },
	{ id: 4, eventId: 1, registrantName: 'Ana Lim', barangay: 15, registeredAt: '2026-03-04T11:00:00Z' },
	{ id: 5, eventId: 1, registrantName: 'Rico Flores', barangay: 6, registeredAt: '2026-03-05T08:00:00Z' },
	{ id: 6, eventId: 2, registrantName: 'Liza Ramos', barangay: 7, registeredAt: '2026-03-06T09:00:00Z' },
	{ id: 7, eventId: 2, registrantName: 'Paolo Cruz', barangay: 2, registeredAt: '2026-03-07T10:00:00Z' },
	{ id: 8, eventId: 2, registrantName: 'Sofia Garcia', barangay: 4, registeredAt: '2026-03-08T11:00:00Z' },
	{ id: 9, eventId: 3, registrantName: 'Diego Tan', barangay: 10, registeredAt: '2026-03-09T12:00:00Z' },
	{ id: 10, eventId: 3, registrantName: 'Grace Villanueva', barangay: 11, registeredAt: '2026-03-10T13:00:00Z' },
	{ id: 11, eventId: 3, registrantName: 'Kevin Mendoza', barangay: 1, registeredAt: '2026-03-11T14:00:00Z' },
	{ id: 12, eventId: 4, registrantName: 'Jasmine Ocampo', barangay: 5, registeredAt: '2026-03-12T08:00:00Z' },
	{ id: 13, eventId: 4, registrantName: 'Bryan Torres', barangay: 12, registeredAt: '2026-03-13T09:00:00Z' },
];

const labelClass = "text-[11px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-[#0d0d0d]";
const inputClass =
	"border border-[#e0e0e0] px-3 py-2.5 text-sm font-['Instrument_Sans'] text-[#0d0d0d] placeholder:text-[#aaaaaa] focus:outline-none focus:border-[#0d0d0d] transition-colors bg-white";

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

export default function ManageEventsPage() {
	const [events, setEvents] = useState<CydaoEvent[]>(initialEvents);
	const [registrations, setRegistrations] = useState<MockRegistration[]>(initialRegistrations);
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
	const [modalOpen, setModalOpen] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [form, setForm] = useState<EventForm>(emptyForm);
	const [formErrors, setFormErrors] = useState<Partial<Record<keyof EventForm, string>>>({});
	const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

	// Registrants panel state
	const [registrantsEventId, setRegistrantsEventId] = useState<number | null>(null);
	const [confirmRemoveRegId, setConfirmRemoveRegId] = useState<number | null>(null);

	const filtered = events.filter(e => {
		const matchSearch = e.title.toLowerCase().includes(search.toLowerCase());
		const matchStatus = statusFilter === 'all' || (statusFilter === 'open' ? e.isOpen : !e.isOpen);
		return matchSearch && matchStatus;
	});

	const registrantsEvent = events.find(e => e.id === registrantsEventId) ?? null;
	const panelRegs = registrations.filter(r => r.eventId === registrantsEventId);

	function regCountFor(eventId: number) {
		return registrations.filter(r => r.eventId === eventId).length;
	}

	function openRegistrants(eventId: number) {
		setRegistrantsEventId(eventId);
		setConfirmRemoveRegId(null);
	}

	function closeRegistrants() {
		setRegistrantsEventId(null);
		setConfirmRemoveRegId(null);
	}

	function removeRegistration(regId: number) {
		setRegistrations(prev => prev.filter(r => r.id !== regId));
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
		if (editingId !== null) {
			setEvents(prev =>
				prev.map(e =>
					e.id === editingId
						? {
								...e,
								...form,
								startDate: new Date(form.startDate).toISOString(),
								endDate: new Date(form.endDate).toISOString(),
							}
						: e,
				),
			);
		} else {
			setEvents(prev => [
				{
					id: Date.now(),
					...form,
					startDate: new Date(form.startDate).toISOString(),
					endDate: new Date(form.endDate).toISOString(),
					createdAt: new Date().toISOString(),
				},
				...prev,
			]);
		}
		closeModal();
	}

	function handleDelete(id: number) {
		setEvents(prev => prev.filter(e => e.id !== id));
		setConfirmDeleteId(null);
	}

	function formatDate(iso: string) {
		return new Date(iso).toLocaleDateString('en-PH', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	}

	return (
		<AdminLayout title="Events" description="Create and manage CYDAO events." noScroll>
			<div className="flex flex-col h-full gap-4 min-h-0">
				{/* Toolbar */}
				<div className="shrink-0 flex items-center gap-3 flex-wrap">
					<div className="relative">
						<Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaaaaa]" />
						<input
							value={search}
							onChange={e => setSearch(e.target.value)}
							placeholder="Search events..."
							className="pl-9 pr-4 py-2 text-sm border border-[#e0e0e0] bg-white font-['Instrument_Sans'] text-[#0d0d0d] placeholder:text-[#aaaaaa] focus:outline-none focus:border-[#0d0d0d] transition-colors w-56"
						/>
					</div>

					<div className="flex border border-[#e0e0e0]">
						{(['all', 'open', 'closed'] as const).map(s => (
							<button
								key={s}
								onClick={() => setStatusFilter(s)}
								className={`px-4 py-2 text-[11px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] transition-colors ${
									statusFilter === s ? 'bg-[#0d0d0d] text-white' : 'bg-white text-[#aaaaaa] hover:text-[#0d0d0d]'
								}`}
							>
								{s}
							</button>
						))}
					</div>

					<div className="flex-1" />

					<button
						onClick={openCreate}
						className="flex items-center gap-2 bg-[#d42b2b] text-white text-[11px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] px-4 py-2 hover:bg-[#b82424] transition-colors shrink-0"
					>
						<Plus size={14} /> New Event
					</button>
				</div>

				{/* Table */}
				<div className="flex-1 flex flex-col min-h-0 bg-white border border-[#e0e0e0]">
					{/* Scrollable area — header is sticky inside so widths always match */}
					<div className="flex-1 overflow-y-scroll">
						{/* Sticky header */}
						<div className="sticky top-0 z-10 grid grid-cols-[2fr_1.5fr_1fr_110px_1fr_120px] border-b border-[#e0e0e0] bg-[#fafafa]">
							{(
								[
									{ label: 'Title', center: false },
									{ label: 'Venue', center: false },
									{ label: 'Date', center: false },
									{ label: 'Registered', center: true },
									{ label: 'Status', center: true },
									{ label: 'Actions', center: true },
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
						{filtered.length === 0 ? (
							<div className="flex items-center justify-center h-40">
								<p className="text-sm text-[#aaaaaa] font-['Instrument_Sans']">No events match your filters.</p>
							</div>
						) : (
							filtered.map((event, i) => {
								const regCount = regCountFor(event.id);
								return (
									<div
										key={event.id}
										className={`grid grid-cols-[2fr_1.5fr_1fr_110px_1fr_120px] border-b border-[#f5f5f5] last:border-0 ${
											i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'
										}`}
									>
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
											{regCount > 0 ? (
												<button
													onClick={() => openRegistrants(event.id)}
													className="flex items-center gap-1.5 text-[#0d0d0d] hover:text-[#d42b2b] transition-colors"
												>
													<Users size={13} />
													<span className="text-sm font-semibold font-['Instrument_Sans']">
														{regCount} / {event.availableSlots}
													</span>
												</button>
											) : (
												<span className="text-sm text-[#aaaaaa] font-['Instrument_Sans']">
													0 / {event.availableSlots}
												</span>
											)}
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
													<button
														onClick={() => handleDelete(event.id)}
														className="text-[10px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] text-white bg-[#d42b2b] px-2 py-1 hover:bg-[#b82424] transition-colors"
													>
														Yes
													</button>
													<button
														onClick={() => setConfirmDeleteId(null)}
														className="text-[10px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] text-[#aaaaaa] hover:text-[#0d0d0d] transition-colors"
													>
														No
													</button>
												</>
											) : (
												<>
													<button
														onClick={() => openEdit(event)}
														title="Edit"
														className="text-[#aaaaaa] hover:text-[#0d0d0d] transition-colors"
													>
														<Pencil size={14} />
													</button>
													<button
														onClick={() => setConfirmDeleteId(event.id)}
														title="Delete"
														className="text-[#aaaaaa] hover:text-[#d42b2b] transition-colors"
													>
														<Trash2 size={14} />
													</button>
												</>
											)}
										</div>
									</div>
								);
							})
						)}
					</div>

					{/* Footer count */}
					<div className="shrink-0 border-t border-[#e0e0e0] px-5 py-2.5 bg-[#fafafa]">
						<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans']">
							Showing {filtered.length} of {events.length} events
						</p>
					</div>
				</div>
			</div>

			{/* Registrants Panel Modal */}
			{registrantsEventId !== null && registrantsEvent && (
				<div
					className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
					onClick={e => {
						if (e.target === e.currentTarget) closeRegistrants();
					}}
				>
					<div className="bg-white w-full max-w-2xl h-[80vh] shadow-xl flex flex-col">
						{/* Header */}
						<div className="shrink-0 flex items-start justify-between px-6 py-4 border-b border-[#e0e0e0]">
							<div>
								<p className="text-[10px] font-bold tracking-[3px] uppercase font-['Instrument_Sans'] text-[#aaaaaa]">
									Registrants — {panelRegs.length} / {registrantsEvent.availableSlots} slots
								</p>
								<h2 className="font-['Syne'] font-bold text-lg text-[#0d0d0d] leading-tight mt-0.5">
									{registrantsEvent.title}
								</h2>
								<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans'] mt-1">
									{registrantsEvent.venue} &middot; {formatDate(registrantsEvent.startDate)}
								</p>
							</div>
							<button onClick={closeRegistrants} className="text-[#aaaaaa] hover:text-[#0d0d0d] transition-colors mt-1">
								<X size={18} />
							</button>
						</div>

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
											<p className="text-sm text-[#0d0d0d] font-['Instrument_Sans']">
												{BARANGAY_LABELS[reg.barangay as keyof typeof BARANGAY_LABELS]}
											</p>
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
													<button
														onClick={() => removeRegistration(reg.id)}
														className="text-[9px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] text-white bg-[#d42b2b] px-2 py-1 hover:bg-[#b82424] transition-colors"
													>
														Yes
													</button>
													<button
														onClick={() => setConfirmRemoveRegId(null)}
														className="text-[9px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] text-[#aaaaaa] hover:text-[#0d0d0d] transition-colors"
													>
														No
													</button>
												</div>
											) : (
												<button
													onClick={() => setConfirmRemoveRegId(reg.id)}
													title="Remove"
													className="text-[#aaaaaa] hover:text-[#d42b2b] transition-colors"
												>
													<Trash2 size={13} />
												</button>
											)}
										</div>
									</div>
								))
							)}
						</div>

						{/* Footer */}
						<div className="shrink-0 border-t border-[#e0e0e0] px-6 py-2.5 bg-[#fafafa]">
							<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans']">
								{registrantsEvent.availableSlots - panelRegs.length} slots remaining
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Create / Edit Modal */}
			{modalOpen && (
				<div
					className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
					onClick={e => {
						if (e.target === e.currentTarget) closeModal();
					}}
				>
					<div className="bg-white w-full max-w-lg shadow-xl">
						{/* Modal header */}
						<div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e0e0]">
							<div>
								<p className="text-[10px] font-bold tracking-[3px] uppercase font-['Instrument_Sans'] text-[#aaaaaa]">
									{editingId !== null ? 'Edit' : 'New'}
								</p>
								<h2 className="font-['Syne'] font-bold text-lg text-[#0d0d0d] leading-tight">
									{editingId !== null ? 'Edit Event' : 'Create Event'}
								</h2>
							</div>
							<button onClick={closeModal} className="text-[#aaaaaa] hover:text-[#0d0d0d] transition-colors">
								<X size={18} />
							</button>
						</div>

						{/* Modal form */}
						<div className="px-6 py-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
							<div className="flex flex-col gap-1.5">
								<label className={labelClass}>Title</label>
								<input
									value={form.title}
									onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
									placeholder="e.g. CYDAO Youth Summit 2026"
									className={inputClass + ' w-full'}
								/>
								{formErrors.title && (
									<p className="text-xs text-[#d42b2b] font-['Instrument_Sans']">{formErrors.title}</p>
								)}
							</div>

							<div className="flex flex-col gap-1.5">
								<label className={labelClass}>Description</label>
								<textarea
									value={form.description}
									onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
									placeholder="Describe the event and its purpose..."
									rows={3}
									className={inputClass + ' w-full resize-none'}
								/>
								{formErrors.description && (
									<p className="text-xs text-[#d42b2b] font-['Instrument_Sans']">{formErrors.description}</p>
								)}
							</div>

							<div className="flex flex-col gap-1.5">
								<label className={labelClass}>Venue</label>
								<input
									value={form.venue}
									onChange={e => setForm(f => ({ ...f, venue: e.target.value }))}
									placeholder="e.g. Cabuyao City Hall Auditorium"
									className={inputClass + ' w-full'}
								/>
								{formErrors.venue && (
									<p className="text-xs text-[#d42b2b] font-['Instrument_Sans']">{formErrors.venue}</p>
								)}
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="flex flex-col gap-1.5">
									<label className={labelClass}>Start Date & Time</label>
									<input
										type="datetime-local"
										value={form.startDate}
										onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
										className={inputClass + ' w-full'}
									/>
									{formErrors.startDate && (
										<p className="text-xs text-[#d42b2b] font-['Instrument_Sans']">{formErrors.startDate}</p>
									)}
								</div>

								<div className="flex flex-col gap-1.5">
									<label className={labelClass}>End Date & Time</label>
									<input
										type="datetime-local"
										value={form.endDate}
										onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
										className={inputClass + ' w-full'}
									/>
									{formErrors.endDate && (
										<p className="text-xs text-[#d42b2b] font-['Instrument_Sans']">{formErrors.endDate}</p>
									)}
								</div>
							</div>

							<div className="flex flex-col gap-1.5">
								<label className={labelClass}>Available Slots</label>
								<input
									type="number"
									min={1}
									value={form.availableSlots}
									onChange={e => setForm(f => ({ ...f, availableSlots: Number(e.target.value) }))}
									placeholder="e.g. 100"
									className={inputClass + ' w-full'}
								/>
								{formErrors.availableSlots && (
									<p className="text-xs text-[#d42b2b] font-['Instrument_Sans']">{formErrors.availableSlots}</p>
								)}
							</div>

							{/* Open/Closed toggle */}
							<div className="flex items-center justify-between py-1">
								<div>
									<p className={labelClass}>Accept Registrations</p>
									<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans'] mt-0.5">
										Toggle to open or close this event
									</p>
								</div>
								<button
									type="button"
									onClick={() => setForm(f => ({ ...f, isOpen: !f.isOpen }))}
									className={`relative w-11 h-6 transition-colors shrink-0 ${form.isOpen ? 'bg-[#d42b2b]' : 'bg-[#e0e0e0]'}`}
								>
									<span
										className={`absolute top-1 w-4 h-4 bg-white transition-all ${form.isOpen ? 'left-6' : 'left-1'}`}
									/>
								</button>
							</div>
						</div>

						{/* Modal footer */}
						<div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e0e0e0]">
							<button
								onClick={closeModal}
								className="text-sm font-['Instrument_Sans'] font-medium text-[#aaaaaa] hover:text-[#0d0d0d] transition-colors px-4 py-2"
							>
								Cancel
							</button>
							<button
								onClick={handleSave}
								className="bg-[#d42b2b] text-white text-[11px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] px-6 py-2.5 hover:bg-[#b82424] transition-colors"
							>
								{editingId !== null ? 'Save Changes' : 'Create Event'}
							</button>
						</div>
					</div>
				</div>
			)}
		</AdminLayout>
	);
}
