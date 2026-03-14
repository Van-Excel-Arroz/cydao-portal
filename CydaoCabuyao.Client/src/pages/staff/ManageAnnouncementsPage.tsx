import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, X, ImageIcon } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AnnouncementCategory, ANNOUNCEMENT_CATEGORY_LABELS } from '@/types';
import type { Announcement } from '@/types';

// --- Mock data (replace with API calls once backend is ready) ---
const initialAnnouncements: Announcement[] = [
	{
		id: 1,
		title: 'Application Period Now Open for Leadership Program',
		body: 'Youth members aged 15–30 from all barangays are encouraged to apply for the Q2 Leadership Development Program. The program runs for 12 weeks and covers civic leadership, public speaking, and community organizing. Deadline is April 30, 2026.',
		category: AnnouncementCategory.New,
		createdAt: '2026-03-10',
	},
	{
		id: 2,
		title: 'YORP Registration for 2026 Now Accepting Applications',
		body: 'Youth organizations seeking accreditation under the Youth Organizations Registration Program may now submit their documentary requirements at the CYDAO office. Accreditation grants access to funding, technical assistance, and official recognition.',
		category: AnnouncementCategory.YORP,
		createdAt: '2026-03-08',
	},
	{
		id: 3,
		title: 'Kabataan Summit Registration Closes April 1',
		body: 'Only 20 slots remaining for the Kabataan Leadership Summit. Register via the portal before April 1 to secure your slot. The summit will be held at the Cabuyao City Hall Auditorium from April 10–12.',
		category: AnnouncementCategory.Event,
		createdAt: '2026-03-05',
	},
	{
		id: 4,
		title: 'Portal Now Live — Register Your Account',
		body: 'The CYDAO Cabuyao online portal is now fully operational. Youth members may create accounts, apply for programs, and register for events. Staff may access the admin panel to manage submissions and content.',
		category: AnnouncementCategory.Update,
		createdAt: '2026-03-01',
	},
	{
		id: 5,
		title: 'Livelihood Training Grant Available for Q2 2026',
		body: 'CYDAO is partnering with TESDA to offer free skills training for youth aged 18–30. Limited slots per barangay are available for welding, bread & pastry production, and computer hardware servicing.',
		category: AnnouncementCategory.New,
		createdAt: '2026-02-25',
	},
];

const categoryBadge: Record<AnnouncementCategory, string> = {
	[AnnouncementCategory.New]: 'bg-[#d42b2b] text-white',
	[AnnouncementCategory.Event]: 'bg-[#0d0d0d] text-white',
	[AnnouncementCategory.YORP]: 'bg-[#f5f5f5] text-[#0d0d0d] border border-[#e0e0e0]',
	[AnnouncementCategory.Update]: 'bg-[#f5f5f5] text-[#0d0d0d] border border-[#e0e0e0]',
};

const labelClass = "text-[11px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-[#0d0d0d]";
const inputClass =
	"border border-[#e0e0e0] px-3 py-2.5 text-sm font-['Instrument_Sans'] text-[#0d0d0d] placeholder:text-[#aaaaaa] focus:outline-none focus:border-[#0d0d0d] transition-colors bg-white";

interface AnnouncementForm {
	title: string;
	body: string;
	category: number;
}

const emptyForm: AnnouncementForm = {
	title: '',
	body: '',
	category: AnnouncementCategory.New,
};

const ALL = -1;

export default function ManageAnnouncementsPage() {
	const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
	const [search, setSearch] = useState('');
	const [categoryFilter, setCategoryFilter] = useState<number>(ALL);
	const [modalOpen, setModalOpen] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [form, setForm] = useState<AnnouncementForm>(emptyForm);
	const [formErrors, setFormErrors] = useState<Partial<Record<keyof AnnouncementForm, string>>>({});
	const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	const filtered = announcements.filter(a => {
		const matchSearch =
			a.title.toLowerCase().includes(search.toLowerCase()) || a.body.toLowerCase().includes(search.toLowerCase());
		const matchCategory = categoryFilter === ALL || a.category === categoryFilter;
		return matchSearch && matchCategory;
	});

	function openCreate() {
		setForm(emptyForm);
		setEditingId(null);
		setFormErrors({});
		setImagePreview(null);
		setModalOpen(true);
	}

	function openEdit(announcement: Announcement) {
		setForm({
			title: announcement.title,
			body: announcement.body,
			category: announcement.category,
		});
		setEditingId(announcement.id);
		setFormErrors({});
		setImagePreview(null);
		setModalOpen(true);
	}

	function closeModal() {
		setModalOpen(false);
		setFormErrors({});
		setImagePreview(null);
	}

	function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		const url = URL.createObjectURL(file);
		setImagePreview(url);
	}

	function validate(): boolean {
		const e: Partial<Record<keyof AnnouncementForm, string>> = {};
		if (!form.title.trim()) e.title = 'Title is required';
		if (!form.body.trim()) e.body = 'Body is required';
		setFormErrors(e);
		return Object.keys(e).length === 0;
	}

	function handleSave() {
		if (!validate()) return;
		const category = Number(form.category) as AnnouncementCategory;
		if (editingId !== null) {
			setAnnouncements(prev => prev.map(a => (a.id === editingId ? { ...a, ...form, category } : a)));
		} else {
			setAnnouncements(prev => [
				{
					id: Date.now(),
					...form,
					category,
					createdAt: new Date().toISOString().split('T')[0],
				},
				...prev,
			]);
		}
		closeModal();
	}

	function handleDelete(id: number) {
		setAnnouncements(prev => prev.filter(a => a.id !== id));
		setConfirmDeleteId(null);
	}

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('en-PH', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	}

	return (
		<AdminLayout title="Announcements" description="Post and manage CYDAO announcements." noScroll>
			<div className="flex flex-col h-full gap-4 min-h-0">
				{/* Toolbar */}
				<div className="shrink-0 flex items-center gap-3 flex-wrap">
					<div className="relative">
						<Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaaaaa]" />
						<input
							value={search}
							onChange={e => setSearch(e.target.value)}
							placeholder="Search announcements..."
							className="pl-9 pr-4 py-2 text-sm border border-[#e0e0e0] bg-white font-['Instrument_Sans'] text-[#0d0d0d] placeholder:text-[#aaaaaa] focus:outline-none focus:border-[#0d0d0d] transition-colors w-56"
						/>
					</div>

					<select
						value={categoryFilter}
						onChange={e => setCategoryFilter(Number(e.target.value))}
						className="py-2 px-3 text-sm border border-[#e0e0e0] bg-white font-['Instrument_Sans'] text-[#0d0d0d] focus:outline-none focus:border-[#0d0d0d] transition-colors cursor-pointer"
					>
						<option value={ALL}>All Categories</option>
						{Object.entries(ANNOUNCEMENT_CATEGORY_LABELS).map(([value, label]) => (
							<option key={value} value={value}>
								{label}
							</option>
						))}
					</select>

					<div className="flex-1" />

					<button
						onClick={openCreate}
						className="flex items-center gap-2 bg-[#d42b2b] text-white text-[11px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] px-4 py-2 hover:bg-[#b82424] transition-colors shrink-0"
					>
						<Plus size={14} /> New Announcement
					</button>
				</div>

				{/* Table */}
				<div className="flex-1 flex flex-col min-h-0 bg-white border border-[#e0e0e0]">
					{/* Scrollable area — header is sticky inside so widths always match */}
					<div className="flex-1 overflow-y-scroll">
						{/* Sticky header */}
						<div className="sticky top-0 z-10 grid grid-cols-[2fr_1fr_1fr_120px] border-b border-[#e0e0e0] bg-[#fafafa]">
							{(
								[
									{ label: 'Title', center: false },
									{ label: 'Category', center: true },
									{ label: 'Date', center: true },
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
								<p className="text-sm text-[#aaaaaa] font-['Instrument_Sans']">No announcements match your filters.</p>
							</div>
						) : (
							filtered.map((announcement, i) => (
								<div
									key={announcement.id}
									className={`grid grid-cols-[2fr_1fr_1fr_120px] border-b border-[#f5f5f5] last:border-0 ${
										i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'
									}`}
								>
									<div className="px-5 py-3.5">
										<p className="text-sm font-semibold text-[#0d0d0d] font-['Instrument_Sans'] leading-tight">
											{announcement.title}
										</p>
										<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans'] mt-0.5 line-clamp-1">
											{announcement.body}
										</p>
									</div>

									<div className="px-5 py-3.5 flex items-center justify-center">
										<span
											className={`text-[10px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] px-2 py-0.5 ${categoryBadge[announcement.category]}`}
										>
											{ANNOUNCEMENT_CATEGORY_LABELS[announcement.category]}
										</span>
									</div>

									<div className="px-5 py-3.5 flex items-center justify-center">
										<p className="text-sm text-[#0d0d0d] font-['Instrument_Sans']">
											{formatDate(announcement.createdAt)}
										</p>
									</div>

									<div className="px-5 py-3.5 flex items-center justify-center gap-3">
										{confirmDeleteId === announcement.id ? (
											<>
												<button
													onClick={() => handleDelete(announcement.id)}
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
													onClick={() => openEdit(announcement)}
													title="Edit"
													className="text-[#aaaaaa] hover:text-[#0d0d0d] transition-colors"
												>
													<Pencil size={14} />
												</button>
												<button
													onClick={() => setConfirmDeleteId(announcement.id)}
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
							Showing {filtered.length} of {announcements.length} announcements
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
									{editingId !== null ? 'Edit Announcement' : 'Create Announcement'}
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
									placeholder="e.g. Application Period Now Open for Leadership Program"
									className={inputClass + ' w-full'}
								/>
								{formErrors.title && (
									<p className="text-xs text-[#d42b2b] font-['Instrument_Sans']">{formErrors.title}</p>
								)}
							</div>

							<div className="flex flex-col gap-1.5">
								<label className={labelClass}>Body</label>
								<textarea
									value={form.body}
									onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
									placeholder="Write the announcement content here..."
									rows={5}
									className={inputClass + ' w-full resize-none'}
								/>
								{formErrors.body && (
									<p className="text-xs text-[#d42b2b] font-['Instrument_Sans']">{formErrors.body}</p>
								)}
							</div>

							<div className="flex flex-col gap-1.5">
								<label className={labelClass}>Cover Image</label>
								{imagePreview ? (
									<div className="relative">
										<img
											src={imagePreview}
											alt="Preview"
											className="w-full h-40 object-cover border border-[#e0e0e0]"
										/>
										<button
											type="button"
											onClick={() => setImagePreview(null)}
											className="absolute top-2 right-2 bg-white border border-[#e0e0e0] p-1 text-[#aaaaaa] hover:text-[#d42b2b] transition-colors"
										>
											<X size={13} />
										</button>
									</div>
								) : (
									<label className="flex flex-col items-center justify-center gap-2 h-28 border border-dashed border-[#e0e0e0] bg-[#fafafa] hover:border-[#0d0d0d] transition-colors cursor-pointer">
										<ImageIcon size={20} className="text-[#aaaaaa]" />
										<span className="text-xs text-[#aaaaaa] font-['Instrument_Sans']">
											Click to upload an image
										</span>
										<input
											type="file"
											accept="image/*"
											className="hidden"
											onChange={handleImageChange}
										/>
									</label>
								)}
							</div>

							<div className="flex flex-col gap-1.5">
								<label className={labelClass}>Category</label>
								<select
									value={form.category}
									onChange={e => setForm(f => ({ ...f, category: Number(e.target.value) }))}
									className={inputClass + ' w-full cursor-pointer'}
								>
									{Object.entries(ANNOUNCEMENT_CATEGORY_LABELS).map(([value, label]) => (
										<option key={value} value={value}>
											{label}
										</option>
									))}
								</select>
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
								{editingId !== null ? 'Save Changes' : 'Create Announcement'}
							</button>
						</div>
					</div>
				</div>
			)}
		</AdminLayout>
	);
}
