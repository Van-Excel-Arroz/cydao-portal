import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, X, Users } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import {
	ProgramCategory,
	PROGRAM_CATEGORY_LABELS,
	ApplicationStatus,
	APPLICATION_STATUS_LABELS,
	BARANGAY_LABELS,
} from '@/types';
import type { CydaoProgram } from '@/types';

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

const categoryBadge: Record<number, string> = {
	[ProgramCategory.Leadership]: 'bg-blue-50 text-blue-700 border-blue-200',
	[ProgramCategory.Environment]: 'bg-green-50 text-green-700 border-green-200',
	[ProgramCategory.Sports]: 'bg-orange-50 text-orange-700 border-orange-200',
	[ProgramCategory.ArtsAndCulture]: 'bg-purple-50 text-purple-700 border-purple-200',
	[ProgramCategory.Livelihood]: 'bg-yellow-50 text-yellow-700 border-yellow-200',
	[ProgramCategory.MentalHealth]: 'bg-pink-50 text-pink-700 border-pink-200',
	[ProgramCategory.Scholarship]: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

const statusBadge: Record<ApplicationStatus, string> = {
	[ApplicationStatus.Pending]: 'bg-[#f5f5f5] text-[#aaaaaa] border-[#e0e0e0]',
	[ApplicationStatus.UnderReview]: 'bg-yellow-50 text-yellow-700 border-yellow-200',
	[ApplicationStatus.Approved]: 'bg-green-50 text-green-700 border-green-200',
	[ApplicationStatus.Rejected]: 'bg-red-50 text-[#d42b2b] border-red-200',
};

const labelClass = "text-[11px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-[#0d0d0d]";
const inputClass =
	"border border-[#e0e0e0] px-3 py-2.5 text-sm font-['Instrument_Sans'] text-[#0d0d0d] placeholder:text-[#aaaaaa] focus:outline-none focus:border-[#0d0d0d] transition-colors bg-white";

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

	// Applicants panel state
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

	function closeApplicants() {
		setApplicantsProgramId(null);
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

	const appStatusTabs: Array<{ key: ApplicationStatus | 'all'; label: string }> = [
		{ key: 'all', label: 'All' },
		{ key: ApplicationStatus.Pending, label: 'Pending' },
		{ key: ApplicationStatus.UnderReview, label: 'Under Review' },
		{ key: ApplicationStatus.Approved, label: 'Approved' },
		{ key: ApplicationStatus.Rejected, label: 'Rejected' },
	];

	return (
		<AdminLayout title="Programs" description="Create and manage CYDAO youth programs." noScroll>
			<div className="flex flex-col h-full gap-4 min-h-0">
				{/* Toolbar */}
				<div className="shrink-0 flex items-center gap-3 flex-wrap">
					<div className="relative">
						<Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaaaaa]" />
						<input
							value={search}
							onChange={e => setSearch(e.target.value)}
							placeholder="Search programs..."
							className="pl-9 pr-4 py-2 text-sm border border-[#e0e0e0] bg-white font-['Instrument_Sans'] text-[#0d0d0d] placeholder:text-[#aaaaaa] focus:outline-none focus:border-[#0d0d0d] transition-colors w-56"
						/>
					</div>

					<select
						value={categoryFilter}
						onChange={e => setCategoryFilter(Number(e.target.value))}
						className="py-2 px-3 text-sm border border-[#e0e0e0] bg-white font-['Instrument_Sans'] text-[#0d0d0d] focus:outline-none focus:border-[#0d0d0d] transition-colors cursor-pointer"
					>
						<option value={ALL}>All Categories</option>
						{Object.entries(PROGRAM_CATEGORY_LABELS).map(([value, label]) => (
							<option key={value} value={value}>
								{label}
							</option>
						))}
					</select>

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
						<Plus size={14} /> New Program
					</button>
				</div>

				{/* Table */}
				<div className="flex-1 flex flex-col min-h-0 bg-white border border-[#e0e0e0]">
					{/* Scrollable area — header is sticky inside so widths always match */}
					<div className="flex-1 overflow-y-scroll">
						{/* Sticky header */}
						<div className="sticky top-0 z-10 grid grid-cols-[2fr_1fr_1fr_1fr_100px_120px] border-b border-[#e0e0e0] bg-[#fafafa]">
							{(
								[
									{ label: 'Title', center: false },
									{ label: 'Category', center: true },
									{ label: 'Deadline', center: true },
									{ label: 'Status', center: true },
									{ label: 'Applicants', center: true },
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
								<p className="text-sm text-[#aaaaaa] font-['Instrument_Sans']">No programs match your filters.</p>
							</div>
						) : (
							filtered.map((program, i) => {
								const count = appCountFor(program.id);
								return (
									<div
										key={program.id}
										className={`grid grid-cols-[2fr_1fr_1fr_1fr_100px_120px] border-b border-[#f5f5f5] last:border-0 ${
											i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'
										}`}
									>
										<div className="px-5 py-3.5">
											<p className="text-sm font-semibold text-[#0d0d0d] font-['Instrument_Sans'] leading-tight">
												{program.title}
											</p>
											<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans'] mt-0.5 line-clamp-1">
												{program.description}
											</p>
										</div>

										<div className="px-5 py-3.5 flex items-center">
											<span
												className={`text-[10px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] px-2 py-0.5 border ${categoryBadge[program.category]}`}
											>
												{PROGRAM_CATEGORY_LABELS[program.category]}
											</span>
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
													className="flex items-center gap-1.5 text-[#0d0d0d] hover:text-[#d42b2b] transition-colors ml-5"
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
													<button
														onClick={() => handleDelete(program.id)}
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
														onClick={() => openEdit(program)}
														title="Edit"
														className="text-[#aaaaaa] hover:text-[#0d0d0d] transition-colors"
													>
														<Pencil size={14} />
													</button>
													<button
														onClick={() => setConfirmDeleteId(program.id)}
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
							Showing {filtered.length} of {programs.length} programs
						</p>
					</div>
				</div>
			</div>

			{/* Applicants Panel Modal */}
			{applicantsProgramId !== null && applicantsProgram && (
				<div
					className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
					onClick={e => {
						if (e.target === e.currentTarget) closeApplicants();
					}}
				>
					<div className="bg-white w-full max-w-3xl h-[85vh] shadow-xl flex flex-col">
						{/* Header */}
						<div className="shrink-0 flex items-start justify-between px-6 py-4 border-b border-[#e0e0e0]">
							<div>
								<p className="text-[10px] font-bold tracking-[3px] uppercase font-['Instrument_Sans'] text-[#aaaaaa]">
									Applicants — {allPanelApps.length} total
								</p>
								<h2 className="font-['Syne'] font-bold text-lg text-[#0d0d0d] leading-tight mt-0.5">
									{applicantsProgram.title}
								</h2>
							</div>
							<button onClick={closeApplicants} className="text-[#aaaaaa] hover:text-[#0d0d0d] transition-colors mt-1">
								<X size={18} />
							</button>
						</div>

						{/* Status filter tabs */}
						<div className="shrink-0 flex border-b border-[#e0e0e0] px-6 gap-0">
							{appStatusTabs.map(tab => {
								const tabCount =
									tab.key === 'all' ? allPanelApps.length : allPanelApps.filter(a => a.status === tab.key).length;
								return (
									<button
										key={tab.key}
										onClick={() => setAppStatusFilter(tab.key)}
										className={`px-4 py-2.5 text-[10px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] border-b-2 transition-colors ${
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
											{/* Applicant info */}
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

											{/* Motivation */}
											<div className="flex-1 min-w-0">
												<p className="text-xs text-[#0d0d0d] font-['Instrument_Sans'] leading-relaxed line-clamp-2">
													{app.motivation}
												</p>
											</div>

											{/* Status dropdown */}
											<div className="shrink-0">
												<select
													value={app.status}
													onChange={e => updateAppStatus(app.id, Number(e.target.value) as ApplicationStatus)}
													className={`text-[10px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] px-2 py-1 border cursor-pointer focus:outline-none ${statusBadge[app.status]}`}
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

						{/* Footer */}
						<div className="shrink-0 border-t border-[#e0e0e0] px-6 py-2.5 bg-[#fafafa]">
							<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans']">
								Showing {panelApps.length} of {allPanelApps.length} applicants
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
									{editingId !== null ? 'Edit Program' : 'Create Program'}
								</h2>
							</div>
							<button onClick={closeModal} className="text-[#aaaaaa] hover:text-[#0d0d0d] transition-colors">
								<X size={18} />
							</button>
						</div>

						{/* Modal form */}
						<div className="px-6 py-5 flex flex-col gap-4">
							<div className="flex flex-col gap-1.5">
								<label className={labelClass}>Title</label>
								<input
									value={form.title}
									onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
									placeholder="e.g. Leadership Development Program"
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
									placeholder="Describe the program objectives and target participants..."
									rows={3}
									className={inputClass + ' w-full resize-none'}
								/>
								{formErrors.description && (
									<p className="text-xs text-[#d42b2b] font-['Instrument_Sans']">{formErrors.description}</p>
								)}
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="flex flex-col gap-1.5">
									<label className={labelClass}>Category</label>
									<select
										value={form.category}
										onChange={e => setForm(f => ({ ...f, category: Number(e.target.value) }))}
										className={inputClass + ' w-full cursor-pointer'}
									>
										{Object.entries(PROGRAM_CATEGORY_LABELS).map(([value, label]) => (
											<option key={value} value={value}>
												{label}
											</option>
										))}
									</select>
								</div>

								<div className="flex flex-col gap-1.5">
									<label className={labelClass}>Application Deadline</label>
									<input
										type="date"
										value={form.applicationDeadline}
										onChange={e => setForm(f => ({ ...f, applicationDeadline: e.target.value }))}
										className={inputClass + ' w-full'}
									/>
									{formErrors.applicationDeadline && (
										<p className="text-xs text-[#d42b2b] font-['Instrument_Sans']">{formErrors.applicationDeadline}</p>
									)}
								</div>
							</div>

							{/* Open/Closed toggle */}
							<div className="flex items-center justify-between py-1">
								<div>
									<p className={labelClass}>Accept Applications</p>
									<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans'] mt-0.5">
										Toggle to open or close this program
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
								{editingId !== null ? 'Save Changes' : 'Create Program'}
							</button>
						</div>
					</div>
				</div>
			)}
		</AdminLayout>
	);
}
