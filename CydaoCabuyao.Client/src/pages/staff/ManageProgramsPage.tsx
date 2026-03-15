import { useState } from 'react';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import {
	ProgramCategory,
	PROGRAM_CATEGORY_LABELS,
	ApplicationStatus,
	APPLICATION_STATUS_LABELS,
	BARANGAY_LABELS,
} from '@/types';
import type { CydaoProgram } from '@/types';
import { CategoryBadge } from '@/components/shared/Badge';
import { Btn } from '@/components/shared/Btn';
import { DataTable, tableRowClass } from '@/components/shared/DataTable';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/shared/Modal';
import { ToggleSwitch } from '@/components/shared/ToggleSwitch';
import { FormField, FieldInput, FieldTextarea, FieldSelect } from '@/components/shared/FormField';
import { SearchInput } from '@/components/shared/SearchInput';
import { SegmentedControl } from '@/components/shared/SegmentedControl';

// --- Mock data (replace with API calls once backend is ready) ---
const initialPrograms: CydaoProgram[] = [
	{
		id: 1,
		title: 'Leadership Development Program',
		description: 'A comprehensive leadership training program for youth aged 15–30 from all barangays of Cabuyao.',
		category: ProgramCategory.Leadership,
		applicationDeadline: '2026-04-30',
		isOpen: true,
		createdAt: '2026-01-15T00:00:00Z',
	},
	{
		id: 2,
		title: 'Environmental Awareness Campaign',
		description:
			'Community-based environmental program focusing on waste segregation, tree planting, and river cleanup.',
		category: ProgramCategory.Environment,
		applicationDeadline: '2026-04-15',
		isOpen: true,
		createdAt: '2026-01-20T00:00:00Z',
	},
	{
		id: 3,
		title: 'Youth Sports Festival',
		description: 'Inter-barangay sports competition promoting sportsmanship and physical wellness among Cabuyao youth.',
		category: ProgramCategory.Sports,
		applicationDeadline: '2026-03-31',
		isOpen: false,
		createdAt: '2026-01-25T00:00:00Z',
	},
	{
		id: 4,
		title: 'Sining at Kultura Workshop',
		description: 'Arts and cultural workshop celebrating Filipino heritage through visual arts, dance, and music.',
		category: ProgramCategory.ArtsAndCulture,
		applicationDeadline: '2026-05-15',
		isOpen: true,
		createdAt: '2026-02-01T00:00:00Z',
	},
	{
		id: 5,
		title: 'Livelihood Skills Training',
		description:
			'Practical skills training in cooking, welding, dressmaking, and digital marketing for out-of-school youth.',
		category: ProgramCategory.Livelihood,
		applicationDeadline: '2026-05-30',
		isOpen: true,
		createdAt: '2026-02-10T00:00:00Z',
	},
	{
		id: 6,
		title: 'Mental Health Awareness Forum',
		description:
			'A series of seminars and group sessions addressing mental health awareness, stress management, and peer support.',
		category: ProgramCategory.MentalHealth,
		applicationDeadline: '2026-04-20',
		isOpen: true,
		createdAt: '2026-02-15T00:00:00Z',
	},
	{
		id: 7,
		title: 'CYDAO Scholarship Grant',
		description: 'Financial assistance program for deserving youth members pursuing tertiary education within Cabuyao.',
		category: ProgramCategory.Scholarship,
		applicationDeadline: '2026-03-15',
		isOpen: false,
		createdAt: '2026-02-20T00:00:00Z',
	},
];

interface MockApplication {
	id: number;
	programId: number;
	applicantName: string;
	barangay: number;
	motivation: string;
	status: ApplicationStatus;
	submittedAt: string;
}

const initialApplications: MockApplication[] = [
	{
		id: 1,
		programId: 1,
		applicantName: 'Juan dela Cruz',
		barangay: 16,
		motivation:
			'I want to develop my leadership skills to serve my community better and become a role model for other youth in Cabuyao.',
		status: ApplicationStatus.Pending,
		submittedAt: '2026-03-01T10:00:00Z',
	},
	{
		id: 2,
		programId: 1,
		applicantName: 'Maria Santos',
		barangay: 3,
		motivation:
			'As a student leader in my school, this program would help me expand my skills and connect with other youth leaders across Cabuyao.',
		status: ApplicationStatus.UnderReview,
		submittedAt: '2026-03-02T09:30:00Z',
	},
	{
		id: 3,
		programId: 1,
		applicantName: 'Carlo Reyes',
		barangay: 9,
		motivation:
			'I believe in empowering the youth of Cabuyao. This program aligns with my personal advocacy of servant leadership.',
		status: ApplicationStatus.Approved,
		submittedAt: '2026-03-03T14:00:00Z',
	},
	{
		id: 4,
		programId: 1,
		applicantName: 'Ana Lim',
		barangay: 15,
		motivation:
			'I have always been passionate about community work. Joining this program is the next step in my journey as a youth leader.',
		status: ApplicationStatus.Rejected,
		submittedAt: '2026-03-04T11:00:00Z',
	},
	{
		id: 5,
		programId: 2,
		applicantName: 'Rico Flores',
		barangay: 6,
		motivation:
			'Environmental protection is close to my heart. I want to make a tangible impact in keeping Cabuyao clean and green.',
		status: ApplicationStatus.Pending,
		submittedAt: '2026-03-05T08:00:00Z',
	},
	{
		id: 6,
		programId: 2,
		applicantName: 'Liza Ramos',
		barangay: 7,
		motivation:
			'I volunteer in local clean-up drives and this program would give me more knowledge and impact in environmental advocacy.',
		status: ApplicationStatus.Pending,
		submittedAt: '2026-03-06T09:00:00Z',
	},
	{
		id: 7,
		programId: 4,
		applicantName: 'Paolo Cruz',
		barangay: 2,
		motivation:
			'Art is my passion. I want to use this workshop to hone my skills and represent our barangay in cultural activities.',
		status: ApplicationStatus.Approved,
		submittedAt: '2026-03-07T10:00:00Z',
	},
	{
		id: 8,
		programId: 4,
		applicantName: 'Sofia Garcia',
		barangay: 4,
		motivation:
			'I have been dancing since I was 7 years old. This workshop is an opportunity to share Filipino culture with more people.',
		status: ApplicationStatus.UnderReview,
		submittedAt: '2026-03-08T11:00:00Z',
	},
	{
		id: 9,
		programId: 4,
		applicantName: 'Diego Tan',
		barangay: 10,
		motivation:
			'I am a visual artist who wants to contribute to the preservation of Filipino heritage through my work.',
		status: ApplicationStatus.Pending,
		submittedAt: '2026-03-09T12:00:00Z',
	},
	{
		id: 10,
		programId: 5,
		applicantName: 'Grace Villanueva',
		barangay: 11,
		motivation:
			'I am an out-of-school youth looking for practical skills to start a small business and support my family.',
		status: ApplicationStatus.Pending,
		submittedAt: '2026-03-10T13:00:00Z',
	},
];

interface ProgramForm {
	title: string;
	description: string;
	category: number;
	applicationDeadline: string;
	isOpen: boolean;
}

const emptyForm: ProgramForm = {
	title: '',
	description: '',
	category: ProgramCategory.Leadership,
	applicationDeadline: '',
	isOpen: true,
};

const ALL = -1;

const STATUS_OPTIONS = [
	{ label: 'All', value: 'all' },
	{ label: 'Open', value: 'open' },
	{ label: 'Closed', value: 'closed' },
] as const;

const APP_STATUS_TABS: Array<{ key: ApplicationStatus | 'all'; label: string }> = [
	{ key: 'all', label: 'All' },
	{ key: ApplicationStatus.Pending, label: 'Pending' },
	{ key: ApplicationStatus.UnderReview, label: 'Under Review' },
	{ key: ApplicationStatus.Approved, label: 'Approved' },
	{ key: ApplicationStatus.Rejected, label: 'Rejected' },
];

export default function ManageProgramsPage() {
	const [programs, setPrograms] = useState<CydaoProgram[]>(initialPrograms);
	const [applications, setApplications] = useState<MockApplication[]>(initialApplications);
	const [search, setSearch] = useState('');
	const [categoryFilter, setCategoryFilter] = useState<number>(ALL);
	const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
	const [modalOpen, setModalOpen] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [form, setForm] = useState<ProgramForm>(emptyForm);
	const [formErrors, setFormErrors] = useState<Partial<Record<keyof ProgramForm, string>>>({});
	const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
	const [applicantsProgramId, setApplicantsProgramId] = useState<number | null>(null);
	const [appStatusFilter, setAppStatusFilter] = useState<ApplicationStatus | 'all'>('all');

	const filtered = programs.filter(p => {
		const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
		const matchCategory = categoryFilter === ALL || p.category === categoryFilter;
		const matchStatus = statusFilter === 'all' || (statusFilter === 'open' ? p.isOpen : !p.isOpen);
		return matchSearch && matchCategory && matchStatus;
	});

	const applicantsProgram = programs.find(p => p.id === applicantsProgramId) ?? null;
	const panelApps = applications.filter(a => {
		if (a.programId !== applicantsProgramId) return false;
		return appStatusFilter === 'all' || a.status === appStatusFilter;
	});
	const allPanelApps = applications.filter(a => a.programId === applicantsProgramId);

	function appCountFor(programId: number) {
		return applications.filter(a => a.programId === programId).length;
	}

	function openApplicants(programId: number) {
		setApplicantsProgramId(programId);
		setAppStatusFilter('all');
	}

	function updateAppStatus(appId: number, status: ApplicationStatus) {
		setApplications(prev => prev.map(a => (a.id === appId ? { ...a, status } : a)));
	}

	function openCreate() {
		setForm(emptyForm);
		setEditingId(null);
		setFormErrors({});
		setModalOpen(true);
	}

	function openEdit(program: CydaoProgram) {
		setForm({
			title: program.title,
			description: program.description,
			category: program.category,
			applicationDeadline: program.applicationDeadline,
			isOpen: program.isOpen,
		});
		setEditingId(program.id);
		setFormErrors({});
		setModalOpen(true);
	}

	function closeModal() {
		setModalOpen(false);
		setFormErrors({});
	}

	function validate(): boolean {
		const e: Partial<Record<keyof ProgramForm, string>> = {};
		if (!form.title.trim()) e.title = 'Title is required';
		if (!form.description.trim()) e.description = 'Description is required';
		if (!form.applicationDeadline) e.applicationDeadline = 'Deadline is required';
		setFormErrors(e);
		return Object.keys(e).length === 0;
	}

	function handleSave() {
		if (!validate()) return;
		const category = Number(form.category) as ProgramCategory;
		if (editingId !== null) {
			setPrograms(prev => prev.map(p => (p.id === editingId ? { ...p, ...form, category } : p)));
		} else {
			setPrograms(prev => [{ id: Date.now(), ...form, category, createdAt: new Date().toISOString() }, ...prev]);
		}
		closeModal();
	}

	function handleDelete(id: number) {
		setPrograms(prev => prev.filter(p => p.id !== id));
		setConfirmDeleteId(null);
	}

	return (
		<AdminLayout title="Programs" description="Create and manage CYDAO youth programs." noScroll>
			<div className="flex flex-col h-full gap-4 min-h-0">
				{/* Toolbar */}
				<div className="shrink-0 flex items-center gap-3">
					<SearchInput
						value={search}
						onChange={e => setSearch(e.target.value)}
						placeholder="Search programs..."
						containerClassName="w-56"
					/>

					<FieldSelect
						value={categoryFilter}
						onChange={e => setCategoryFilter(Number(e.target.value))}
						className="w-44! py-2 px-3 text-[11px] font-bold uppercase tracking-[1px]"
					>
						<option value={ALL}>All Categories</option>
						{Object.entries(PROGRAM_CATEGORY_LABELS).map(([value, label]) => (
							<option key={value} value={value}>
								{label}
							</option>
						))}
					</FieldSelect>

					<SegmentedControl options={[...STATUS_OPTIONS]} value={statusFilter} onChange={setStatusFilter} />

					<div className="flex-1" />

					<Btn variant="primary" size="md" onClick={openCreate} className="flex items-center gap-2 shrink-0">
						<Plus size={14} /> New Program
					</Btn>
				</div>

				{/* Table */}
				<DataTable
					columns={[
						{ label: 'Title' },
						{ label: 'Category' },
						{ label: 'Deadline' },
						{ label: 'Status', center: true },
						{ label: 'Applicants', center: true },
						{ label: 'Actions', center: true },
					]}
					colsClass="grid-cols-[2fr_1fr_1fr_1fr_100px_120px]"
					empty={filtered.length === 0}
					emptyMessage="No programs match your filters."
					footer={`Showing ${filtered.length} of ${programs.length} programs`}
				>
					{filtered.map((program, i) => {
						const count = appCountFor(program.id);
						return (
							<div key={program.id} className={`grid grid-cols-[2fr_1fr_1fr_1fr_100px_120px] ${tableRowClass(i)}`}>
								<div className="px-5 py-3.5">
									<p className="text-sm font-semibold text-[#0d0d0d] font-['Instrument_Sans'] leading-tight">
										{program.title}
									</p>
									<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans'] mt-0.5 line-clamp-1">
										{program.description}
									</p>
								</div>

								<div className="px-5 py-3.5 flex items-center">
									<CategoryBadge category={program.category} />
								</div>

								<div className="px-5 py-3.5 flex items-center">
									<p className="text-sm text-[#0d0d0d] font-['Instrument_Sans']">
										{new Date(program.applicationDeadline).toLocaleDateString('en-PH', {
											month: 'short',
											day: 'numeric',
											year: 'numeric',
										})}
									</p>
								</div>

								<div className="px-5 py-3.5 flex items-center justify-center">
									<span
										className={`text-[10px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] px-2 py-0.5 border ${
											program.isOpen
												? 'bg-green-50 text-green-700 border-green-200'
												: 'bg-[#f5f5f5] text-[#aaaaaa] border-[#e0e0e0]'
										}`}
									>
										{program.isOpen ? 'Open' : 'Closed'}
									</span>
								</div>

								<div className="px-5 py-3.5 flex items-center justify-center">
									{count > 0 ? (
										<button
											onClick={() => openApplicants(program.id)}
											className="flex items-center gap-1.5 text-[#0d0d0d] hover:text-[#d42b2b] transition-colors cursor-pointer ml-5"
										>
											<Users size={13} />
											<span className="text-sm font-semibold font-['Instrument_Sans']">{count}</span>
										</button>
									) : (
										<span className="text-sm text-[#aaaaaa] font-['Instrument_Sans']">—</span>
									)}
								</div>

								<div className="px-5 py-3.5 flex items-center justify-center gap-3">
									{confirmDeleteId === program.id ? (
										<>
											<Btn variant="danger" size="sm" onClick={() => handleDelete(program.id)}>
												Yes
											</Btn>
											<Btn variant="ghost" size="sm" onClick={() => setConfirmDeleteId(null)}>
												No
											</Btn>
										</>
									) : (
										<>
											<Btn variant="icon" onClick={() => openEdit(program)} title="Edit">
												<Pencil size={14} />
											</Btn>
											<Btn
												variant="icon"
												onClick={() => setConfirmDeleteId(program.id)}
												title="Delete"
												className="hover:text-[#d42b2b]"
											>
												<Trash2 size={14} />
											</Btn>
										</>
									)}
								</div>
							</div>
						);
					})}
				</DataTable>
			</div>

			{/* Applicants Panel Modal */}
			<Modal
				open={applicantsProgramId !== null && applicantsProgram !== null}
				onClose={() => setApplicantsProgramId(null)}
				maxWidth="max-w-3xl"
				maxHeight="h-[85vh]"
			>
				{applicantsProgram && (
					<>
						<ModalHeader
							title={applicantsProgram.title}
							eyebrow={`Applicants — ${allPanelApps.length} total`}
							onClose={() => setApplicantsProgramId(null)}
						/>

						{/* Status filter tabs */}
						<div className="shrink-0 flex border-b border-[#e0e0e0] px-6">
							{APP_STATUS_TABS.map(tab => {
								const tabCount =
									tab.key === 'all' ? allPanelApps.length : allPanelApps.filter(a => a.status === tab.key).length;
								return (
									<button
										key={tab.key}
										onClick={() => setAppStatusFilter(tab.key)}
										className={`px-4 py-2.5 text-[10px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] border-b-2 transition-colors cursor-pointer ${
											appStatusFilter === tab.key
												? 'border-[#0d0d0d] text-[#0d0d0d]'
												: 'border-transparent text-[#aaaaaa] hover:text-[#0d0d0d]'
										}`}
									>
										{tab.label}
										{tabCount > 0 && <span className="ml-1.5 text-[9px]">({tabCount})</span>}
									</button>
								);
							})}
						</div>

						{/* Applicants list */}
						<div className="flex-1 overflow-y-auto">
							{panelApps.length === 0 ? (
								<div className="flex items-center justify-center h-32">
									<p className="text-sm text-[#aaaaaa] font-['Instrument_Sans']">No applicants in this category.</p>
								</div>
							) : (
								panelApps.map((app, i) => (
									<div
										key={app.id}
										className={`px-6 py-4 border-b border-[#f5f5f5] last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}
									>
										<div className="flex items-start gap-4">
											<div className="w-44 shrink-0">
												<p className="text-sm font-semibold text-[#0d0d0d] font-['Instrument_Sans'] leading-tight">
													{app.applicantName}
												</p>
												<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans'] mt-0.5">
													{BARANGAY_LABELS[app.barangay as keyof typeof BARANGAY_LABELS]}
												</p>
												<p className="text-[10px] text-[#aaaaaa] font-['Instrument_Sans'] mt-1">
													{new Date(app.submittedAt).toLocaleDateString('en-PH', {
														month: 'short',
														day: 'numeric',
														year: 'numeric',
													})}
												</p>
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-xs text-[#0d0d0d] font-['Instrument_Sans'] leading-relaxed line-clamp-2">
													{app.motivation}
												</p>
											</div>
											<div className="shrink-0">
												<select
													value={app.status}
													onChange={e => updateAppStatus(app.id, Number(e.target.value) as ApplicationStatus)}
													className={`text-[10px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] px-2 py-1 border cursor-pointer focus:outline-none ${
														{
															0: 'bg-[#f5f5f5] text-[#aaaaaa] border-[#e0e0e0]',
															1: 'bg-yellow-50 text-yellow-700 border-yellow-200',
															2: 'bg-green-50 text-green-700 border-green-200',
															3: 'bg-red-50 text-[#d42b2b] border-red-200',
														}[app.status]
													}`}
												>
													{Object.entries(APPLICATION_STATUS_LABELS).map(([value, label]) => (
														<option
															key={value}
															value={value}
															className="bg-white text-[#0d0d0d] font-normal normal-case tracking-normal"
														>
															{label}
														</option>
													))}
												</select>
											</div>
										</div>
									</div>
								))
							)}
						</div>

						<div className="shrink-0 border-t border-[#e0e0e0] px-6 py-2.5 bg-[#fafafa]">
							<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans']">
								Showing {panelApps.length} of {allPanelApps.length} applicants
							</p>
						</div>
					</>
				)}
			</Modal>

			{/* Create / Edit Modal */}
			<Modal open={modalOpen} onClose={closeModal}>
				<ModalHeader
					title={editingId !== null ? 'Edit Program' : 'Create Program'}
					eyebrow={editingId !== null ? 'Edit' : 'New'}
					onClose={closeModal}
				/>

				<ModalBody scroll={false} className="flex flex-col gap-4">
					<FormField label="Title" error={formErrors.title}>
						<FieldInput
							value={form.title}
							onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
							placeholder="e.g. Leadership Development Program"
						/>
					</FormField>

					<FormField label="Description" error={formErrors.description}>
						<FieldTextarea
							value={form.description}
							onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
							placeholder="Describe the program objectives and target participants..."
							rows={3}
						/>
					</FormField>

					<div className="grid grid-cols-2 gap-4">
						<FormField label="Category">
							<FieldSelect
								value={form.category}
								onChange={e => setForm(f => ({ ...f, category: Number(e.target.value) }))}
							>
								{Object.entries(PROGRAM_CATEGORY_LABELS).map(([value, label]) => (
									<option key={value} value={value}>
										{label}
									</option>
								))}
							</FieldSelect>
						</FormField>

						<FormField label="Application Deadline" error={formErrors.applicationDeadline}>
							<FieldInput
								type="date"
								value={form.applicationDeadline}
								onChange={e => setForm(f => ({ ...f, applicationDeadline: e.target.value }))}
							/>
						</FormField>
					</div>

					<div className="flex items-center justify-between py-1">
						<div>
							<p className="text-[11px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-[#0d0d0d]">
								Accept Applications
							</p>
							<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans'] mt-0.5">
								Toggle to open or close this program
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
						<Btn variant="primary" size="lg" onClick={handleSave}>
							{editingId !== null ? 'Save Changes' : 'Create Program'}
						</Btn>
					</div>
				</ModalFooter>
			</Modal>
		</AdminLayout>
	);
}
