import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, X, ImageIcon } from 'lucide-react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AnnouncementCategory, ANNOUNCEMENT_CATEGORY_LABELS } from '@/types';
import type { Announcement, CreateAnnouncementDto } from '@/types';
import { AnnouncementBadge } from '@/components/shared/Badge';
import { Btn } from '@/components/shared/Btn';
import { DataTable, tableRowClass } from '@/components/shared/DataTable';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/shared/Modal';
import { FormField, FieldInput, FieldTextarea, FieldSelect } from '@/components/shared/FormField';
import { SearchInput } from '@/components/shared/SearchInput';
import api from '@/lib/api';

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
	const queryClient = useQueryClient();
	const [search, setSearch] = useState('');
	const [categoryFilter, setCategoryFilter] = useState<number>(ALL);
	const [modalOpen, setModalOpen] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [form, setForm] = useState<AnnouncementForm>(emptyForm);
	const [formErrors, setFormErrors] = useState<Partial<Record<keyof AnnouncementForm, string>>>({});
	const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	const { data: announcements = [], isLoading } = useQuery({
		queryKey: ['announcements'],
		queryFn: () => api.get<Announcement[]>('/announcements').then(r => r.data),
	});

	const createMutation = useMutation({
		mutationFn: (dto: CreateAnnouncementDto) => api.post('/announcements', dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['announcements'] });
			closeModal();
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, dto }: { id: number; dto: CreateAnnouncementDto }) => api.put(`/announcements/${id}`, dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['announcements'] });
			closeModal();
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: number) => api.delete(`/announcements/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['announcements'] });
			setConfirmDeleteId(null);
		},
	});

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
		setImagePreview(URL.createObjectURL(file));
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
		const dto: CreateAnnouncementDto = {
			title: form.title,
			body: form.body,
			category: Number(form.category) as AnnouncementCategory,
		};
		if (editingId !== null) {
			updateMutation.mutate({ id: editingId, dto });
		} else {
			createMutation.mutate(dto);
		}
	}

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('en-PH', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	}

	const isSaving = createMutation.isPending || updateMutation.isPending;

	return (
		<AdminLayout title="Announcements" description="Post and manage CYDAO announcements." noScroll>
			<div className="flex flex-col h-full gap-4 min-h-0">
				{/* Toolbar */}
				<div className="shrink-0 flex items-center gap-3">
					<SearchInput
						value={search}
						onChange={e => setSearch(e.target.value)}
						placeholder="Search announcements..."
						containerClassName="w-56"
					/>

					<FieldSelect
						value={categoryFilter}
						onChange={e => setCategoryFilter(Number(e.target.value))}
						className="w-44! py-2 text-[11px] font-bold uppercase tracking-[1px]"
					>
						<option value={ALL}>All Categories</option>
						{Object.entries(ANNOUNCEMENT_CATEGORY_LABELS).map(([value, label]) => (
							<option key={value} value={value}>
								{label}
							</option>
						))}
					</FieldSelect>

					<div className="flex-1" />

					<Btn variant="primary" size="md" onClick={openCreate} className="flex items-center gap-2 shrink-0">
						<Plus size={14} /> New Announcement
					</Btn>
				</div>

				{/* Table */}
				<DataTable
					columns={[
						{ label: 'Title' },
						{ label: 'Category', center: true },
						{ label: 'Date', center: true },
						{ label: 'Actions', center: true },
					]}
					colsClass="grid-cols-[2fr_1fr_1fr_120px]"
					empty={!isLoading && filtered.length === 0}
					emptyMessage={isLoading ? 'Loading...' : 'No announcements match your filters.'}
					footer={`Showing ${filtered.length} of ${announcements.length} announcements`}
				>
					{filtered.map((announcement, i) => (
						<div key={announcement.id} className={`grid grid-cols-[2fr_1fr_1fr_120px] ${tableRowClass(i)}`}>
							<div className="px-5 py-3.5">
								<p className="text-sm font-semibold text-[#0d0d0d] font-['Instrument_Sans'] leading-tight">
									{announcement.title}
								</p>
								<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans'] mt-0.5 line-clamp-1">
									{announcement.body}
								</p>
							</div>

							<div className="px-5 py-3.5 flex items-center justify-center">
								<AnnouncementBadge category={announcement.category} />
							</div>

							<div className="px-5 py-3.5 flex items-center justify-center">
								<p className="text-sm text-[#0d0d0d] font-['Instrument_Sans']">{formatDate(announcement.createdAt)}</p>
							</div>

							<div className="px-5 py-3.5 flex items-center justify-center gap-3">
								{confirmDeleteId === announcement.id ? (
									<>
										<Btn
											variant="danger"
											size="sm"
											onClick={() => deleteMutation.mutate(announcement.id)}
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
										<Btn variant="icon" onClick={() => openEdit(announcement)} title="Edit">
											<Pencil size={14} />
										</Btn>
										<Btn
											variant="icon"
											onClick={() => setConfirmDeleteId(announcement.id)}
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

			{/* Create / Edit Modal */}
			<Modal open={modalOpen} onClose={closeModal}>
				<ModalHeader
					title={editingId !== null ? 'Edit Announcement' : 'Create Announcement'}
					eyebrow={editingId !== null ? 'Edit' : 'New'}
					onClose={closeModal}
				/>

				<ModalBody scroll className="flex flex-col gap-4 max-h-[70vh]">
					<FormField label="Title" error={formErrors.title}>
						<FieldInput
							value={form.title}
							onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
							placeholder="e.g. Application Period Now Open for Leadership Program"
						/>
					</FormField>

					<FormField label="Body" error={formErrors.body}>
						<FieldTextarea
							value={form.body}
							onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
							placeholder="Write the announcement content here..."
							rows={5}
						/>
					</FormField>

					<FormField label="Cover Image">
						{imagePreview ? (
							<div className="relative">
								<img src={imagePreview} alt="Preview" className="w-full h-40 object-cover border border-[#e0e0e0]" />
								<button
									type="button"
									onClick={() => setImagePreview(null)}
									className="absolute top-2 right-2 bg-white border border-[#e0e0e0] p-1 text-[#aaaaaa] hover:text-[#d42b2b] transition-colors cursor-pointer"
								>
									<X size={13} />
								</button>
							</div>
						) : (
							<label className="flex flex-col items-center justify-center gap-2 h-28 border border-dashed border-[#e0e0e0] bg-[#fafafa] hover:border-[#0d0d0d] transition-colors cursor-pointer">
								<ImageIcon size={20} className="text-[#aaaaaa]" />
								<span className="text-xs text-[#aaaaaa] font-['Instrument_Sans']">Click to upload an image</span>
								<input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
							</label>
						)}
					</FormField>

					<FormField label="Category">
						<FieldSelect
							value={form.category}
							onChange={e => setForm(f => ({ ...f, category: Number(e.target.value) }))}
						>
							{Object.entries(ANNOUNCEMENT_CATEGORY_LABELS).map(([value, label]) => (
								<option key={value} value={value}>
									{label}
								</option>
							))}
						</FieldSelect>
					</FormField>
				</ModalBody>

				<ModalFooter>
					<div />
					<div className="flex items-center gap-3">
						<Btn variant="ghost" onClick={closeModal} className="px-4 py-2 text-sm">
							Cancel
						</Btn>
						<Btn variant="primary" size="lg" onClick={handleSave} disabled={isSaving}>
							{isSaving ? 'Saving...' : editingId !== null ? 'Save Changes' : 'Create Announcement'}
						</Btn>
					</div>
				</ModalFooter>
			</Modal>
		</AdminLayout>
	);
}
