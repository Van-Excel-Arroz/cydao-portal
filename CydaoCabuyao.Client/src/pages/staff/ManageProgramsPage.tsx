import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProgramCategory, PROGRAM_CATEGORY_LABELS } from '@/types';
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

const categoryBadge: Record<number, string> = {
	[ProgramCategory.Leadership]: 'bg-blue-50 text-blue-700 border-blue-200',
	[ProgramCategory.Environment]: 'bg-green-50 text-green-700 border-green-200',
	[ProgramCategory.Sports]: 'bg-orange-50 text-orange-700 border-orange-200',
	[ProgramCategory.ArtsAndCulture]: 'bg-purple-50 text-purple-700 border-purple-200',
	[ProgramCategory.Livelihood]: 'bg-yellow-50 text-yellow-700 border-yellow-200',
	[ProgramCategory.MentalHealth]: 'bg-pink-50 text-pink-700 border-pink-200',
	[ProgramCategory.Scholarship]: 'bg-indigo-50 text-indigo-700 border-indigo-200',
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
	const [search, setSearch] = useState('');
	const [categoryFilter, setCategoryFilter] = useState<number>(ALL);
	const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
	const [modalOpen, setModalOpen] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [form, setForm] = useState<ProgramForm>(emptyForm);
	const [formErrors, setFormErrors] = useState<Partial<Record<keyof ProgramForm, string>>>({});
	const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

	const filtered = programs.filter(p => {
		const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
		const matchCategory = categoryFilter === ALL || p.category === categoryFilter;
		const matchStatus = statusFilter === 'all' || (statusFilter === 'open' ? p.isOpen : !p.isOpen);
		return matchSearch && matchCategory && matchStatus;
	});

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
			setPrograms(prev => [
				{
					id: Date.now(),
					...form,
					category,
					createdAt: new Date().toISOString(),
				},
				...prev,
			]);
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
					{/* Header row */}
					<div className="shrink-0 grid grid-cols-[2fr_1fr_1fr_1fr_100px] border-b border-[#e0e0e0] bg-[#fafafa]">
						{['Title', 'Category', 'Deadline', 'Status', 'Actions'].map(h => (
							<div
								key={h}
								className="px-5 py-3 text-[10px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-[#aaaaaa]"
							>
								{h}
							</div>
						))}
					</div>

					{/* Scrollable rows */}
					<div className="flex-1 overflow-y-auto">
						{filtered.length === 0 ? (
							<div className="flex items-center justify-center h-40">
								<p className="text-sm text-[#aaaaaa] font-['Instrument_Sans']">No programs match your filters.</p>
							</div>
						) : (
							filtered.map((program, i) => (
								<div
									key={program.id}
									className={`grid grid-cols-[2fr_1fr_1fr_1fr_100px] border-b border-[#f5f5f5] last:border-0 ${
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

									<div className="px-5 py-3.5 flex items-center">
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

									<div className="px-5 py-3.5 flex items-center gap-3">
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
							))
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
