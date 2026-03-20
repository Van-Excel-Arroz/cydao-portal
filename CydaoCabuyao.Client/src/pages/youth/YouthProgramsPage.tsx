import { useState, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { YouthLayout } from '@/components/layout/YouthLayout';
import { ProgramCategory, PROGRAM_CATEGORY_LABELS } from '@/types';
import type { CydaoProgram, Application } from '@/types';
import { CategoryBadge, OpenBadge, Badge } from '@/components/shared/Badge';
import { Btn } from '@/components/shared/Btn';
import { EmptyState } from '@/components/shared/EmptyState';
import { Modal, ModalCover, ModalHeader, ModalBody, ModalFooter } from '@/components/shared/Modal';
import { SearchInput } from '@/components/shared/SearchInput';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { FieldSelect } from '@/components/shared/FormField';
import api from '@/lib/api';

const categoryOptions = [
	{ label: 'All', value: 'all' },
	...Object.entries(PROGRAM_CATEGORY_LABELS).map(([val, label]) => ({ label, value: val })),
];

const categoryImage: Record<ProgramCategory, string> = {
	[ProgramCategory.Leadership]: 'https://picsum.photos/seed/prog-leadership/800/300',
	[ProgramCategory.Environment]: 'https://picsum.photos/seed/prog-environment/800/300',
	[ProgramCategory.Sports]: 'https://picsum.photos/seed/prog-sports/800/300',
	[ProgramCategory.ArtsAndCulture]: 'https://picsum.photos/seed/prog-arts/800/300',
	[ProgramCategory.Livelihood]: 'https://picsum.photos/seed/prog-livelihood/800/300',
	[ProgramCategory.MentalHealth]: 'https://picsum.photos/seed/prog-mentalhealth/800/300',
	[ProgramCategory.Scholarship]: 'https://picsum.photos/seed/prog-scholarship/800/300',
};

const STATUS_OPTIONS = [
	{ label: 'All', value: 'all' },
	{ label: 'Open', value: 'open' },
	{ label: 'Closed', value: 'closed' },
] as const;

function formatDeadline(dateStr: string) {
	return new Date(dateStr).toLocaleDateString('en-PH', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
}

export default function YouthProgramsPage() {
	const [search, setSearch] = useState('');
	const [category, setCategory] = useState('all');
	const [status, setStatus] = useState<'all' | 'open' | 'closed'>('all');
	const [selected, setSelected] = useState<CydaoProgram | null>(null);

	const queryClient = useQueryClient();

	const { data: programs = [], isLoading } = useQuery({
		queryKey: ['programs'],
		queryFn: () => api.get<CydaoProgram[]>('/programs').then(r => r.data),
	});

	const { data: myApplications = [] } = useQuery({
		queryKey: ['my-applications'],
		queryFn: () => api.get<Application[]>('/applications/user').then(r => r.data),
	});

	const appliedIds = new Set(myApplications.map(a => a.programId));

	const applyMutation = useMutation({
		mutationFn: (programId: number) => api.post('/applications', { programId }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['my-applications'] });
			setSelected(null);
		},
	});

	const filtered = useMemo(() => {
		let list = [...programs];
		if (search.trim()) {
			const q = search.toLowerCase();
			list = list.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
		}
		if (category !== 'all') {
			list = list.filter(p => p.category === Number(category));
		}
		if (status !== 'all') {
			list = list.filter(p => (status === 'open' ? p.isOpen : !p.isOpen));
		}
		return list;
	}, [programs, search, category, status]);

	return (
		<YouthLayout title="Programs">
			{/* Toolbar */}
			<div className="flex flex-wrap items-center gap-3 mb-6">
				<FieldSelect
					value={category}
					onChange={e => setCategory(e.target.value)}
					className="w-44! py-2 text-[11px] font-bold uppercase tracking-[1px]"
				>
					{categoryOptions.map(opt => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</FieldSelect>

				<SegmentedControl
					options={[...STATUS_OPTIONS]}
					value={status}
					onChange={setStatus}
				/>

				<SearchInput
					placeholder="Search programs..."
					value={search}
					onChange={e => setSearch(e.target.value)}
					containerClassName="w-52 ml-auto"
				/>
			</div>

			{/* Results count */}
			<p className="text-xs uppercase tracking-[2px] text-[#aaaaaa] font-['Instrument_Sans'] mb-5">
				{isLoading ? 'Loading...' : `${filtered.length} program${filtered.length !== 1 ? 's' : ''}`}
			</p>

			{/* Program grid */}
			{isLoading ? (
				<EmptyState variant="page" title="Loading programs..." subtitle="Please wait." />
			) : filtered.length === 0 ? (
				<EmptyState variant="page" title="No programs found" subtitle="Try adjusting your filters or search term." />
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
					{filtered.map(program => (
						<button
							key={program.id}
							onClick={() => setSelected(program)}
							className="text-left flex flex-col bg-white border border-[#e0e0e0] hover:border-[#0d0d0d] transition-colors group cursor-pointer"
						>
							{/* Cover image */}
							<div className="overflow-hidden h-44 shrink-0 relative">
								<img
									src={categoryImage[program.category]}
									alt={program.title}
									className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
								/>
								<div className="absolute top-3 left-3 flex items-center gap-1.5">
									<OpenBadge isOpen={program.isOpen} />
									{appliedIds.has(program.id) && (
										<Badge className="bg-green-50 text-green-700 border-green-200">Applied</Badge>
									)}
								</div>
							</div>

							{/* Details */}
							<div className="p-4 flex flex-col flex-1">
								<div className="self-start mb-2">
									<CategoryBadge category={program.category} />
								</div>
								<h3 className="font-['Syne'] font-bold text-sm text-[#0d0d0d] leading-snug mb-2 group-hover:text-[#d42b2b] transition-colors line-clamp-2">
									{program.title}
								</h3>
								<p className="text-xs text-[#555] font-['Instrument_Sans'] leading-relaxed line-clamp-2 flex-1">
									{program.description}
								</p>
								<div className="flex items-center gap-1.5 mt-3 text-xs text-[#aaaaaa] font-['Instrument_Sans']">
									<Calendar size={11} className="shrink-0" />
									<span>Deadline: {formatDeadline(program.applicationDeadline)}</span>
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
							src={categoryImage[selected.category]}
							alt={selected.title}
							onClose={() => setSelected(null)}
						>
							<CategoryBadge category={selected.category} />
							<OpenBadge isOpen={selected.isOpen} variant="outline" />
						</ModalCover>

						<ModalHeader title={selected.title}>
							<div className="flex items-center gap-1.5 mt-1 text-xs text-[#aaaaaa] font-['Instrument_Sans']">
								<Calendar size={11} />
								<span>Deadline: {formatDeadline(selected.applicationDeadline)}</span>
							</div>
						</ModalHeader>

						<ModalBody>
							<p className="text-[11px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-[#aaaaaa] mb-3">
								About this Program
							</p>
							<p className="text-sm font-['Instrument_Sans'] text-[#0d0d0d] leading-relaxed">{selected.description}</p>
						</ModalBody>

						<ModalFooter>
							<div>
								{appliedIds.has(selected.id) ? (
									<Badge className="bg-green-50 text-green-700 border-green-200 px-4 py-2 text-[10px] tracking-[1px]">
										Already Applied
									</Badge>
								) : selected.isOpen ? (
									<Btn
										variant="primary"
										size="sm"
										onClick={() => applyMutation.mutate(selected.id)}
										disabled={applyMutation.isPending}
									>
										{applyMutation.isPending ? 'Applying...' : 'Apply Now'}
									</Btn>
								) : (
									<span className="text-[10px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] text-[#aaaaaa]">
										Applications Closed
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
