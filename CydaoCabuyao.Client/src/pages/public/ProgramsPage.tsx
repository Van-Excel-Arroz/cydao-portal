import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { PROGRAM_CATEGORY_LABELS } from '@/types';
import type { CydaoProgram } from '@/types';
import { CategoryBadge, OpenBadge, Badge } from '@/components/shared/Badge';
import { EmptyState } from '@/components/shared/EmptyState';
import { SearchInput } from '@/components/shared/SearchInput';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import api from '@/lib/api';

const categoryOptions = [
	{ label: 'All', value: 'all' },
	...Object.entries(PROGRAM_CATEGORY_LABELS).map(([val, label]) => ({ label, value: val })),
];

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

export default function ProgramsPage() {
	const [search, setSearch] = useState('');
	const [category, setCategory] = useState('all');
	const [status, setStatus] = useState<'all' | 'open' | 'closed'>('all');

	const { data: programs = [], isLoading } = useQuery({
		queryKey: ['programs'],
		queryFn: () => api.get<CydaoProgram[]>('/programs').then(r => r.data),
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

	const featured = programs.find(p => p.isOpen);

	return (
		<>
			{/* Page header */}
			<section className="relative overflow-hidden bg-[#0d0d0d] h-[40vh] min-h-72">
				<img
					src="https://picsum.photos/seed/programs-header/1600/600"
					alt=""
					aria-hidden="true"
					className="absolute inset-0 w-full h-full object-cover opacity-30"
				/>
				<div className="relative h-full flex flex-col justify-end max-w-7xl mx-auto px-6 pb-10">
					<p className="text-[11px] font-bold tracking-[3px] uppercase text-white/40 font-['Instrument_Sans'] mb-3">
						CYDAO Cabuyao
					</p>
					<h1 className="font-['Syne'] font-extrabold text-[clamp(2.5rem,5vw,4rem)] leading-none text-white">
						Programs
					</h1>
				</div>
			</section>

			{/* Filters bar */}
			<section className="border-b border-[#e0e0e0] bg-[#f5f5f5] sticky top-16 z-40">
				<div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center gap-3">
					<select
						value={category}
						onChange={e => setCategory(e.target.value)}
						className="border border-[#e0e0e0] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[1px] text-[#555] font-['Instrument_Sans'] focus:outline-none focus:border-[#0d0d0d] bg-white cursor-pointer"
					>
						{categoryOptions.map(opt => (
							<option key={opt.value} value={opt.value}>
								{opt.label}
							</option>
						))}
					</select>

					<SegmentedControl options={[...STATUS_OPTIONS]} value={status} onChange={setStatus} />

					<SearchInput
						placeholder="Search programs..."
						value={search}
						onChange={e => setSearch(e.target.value)}
						containerClassName="w-52 ml-auto"
					/>
				</div>
			</section>

			<div className="max-w-7xl mx-auto px-6 py-16">
				{/* Featured program — full-width banner */}
				{!isLoading && featured && category === 'all' && status !== 'closed' && !search && (
					<div className="grid grid-cols-1 lg:grid-cols-2 border border-[#e0e0e0] mb-14">
						<div className="overflow-hidden">
							<img
								src="https://picsum.photos/seed/prog-featured/800/480"
								alt={featured.title}
								className="w-full h-64 lg:h-full object-cover"
							/>
						</div>
						<div className="p-10 flex flex-col justify-between bg-white">
							<div>
								<div className="flex items-center gap-3 mb-4">
									<Badge className="bg-[#d42b2b] text-white border-[#d42b2b]">Featured</Badge>
									<OpenBadge isOpen variant="outline" />
								</div>
								<p className="text-[10px] uppercase tracking-[2px] text-[#aaa] mb-2 font-['Instrument_Sans']">
									{PROGRAM_CATEGORY_LABELS[featured.category]}
								</p>
								<h2 className="font-['Syne'] font-bold text-3xl text-[#0d0d0d] mb-4 leading-tight">{featured.title}</h2>
								<p className="text-sm text-[#555] font-['Instrument_Sans'] leading-relaxed mb-6">
									{featured.description}
								</p>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-[10px] uppercase tracking-[2px] text-[#aaa] font-['Instrument_Sans']">Deadline</p>
									<p className="font-['Syne'] font-bold text-sm text-[#0d0d0d]">
										{formatDeadline(featured.applicationDeadline)}
									</p>
								</div>
								<Link
									to="/register"
									className="inline-flex items-center gap-2 bg-[#d42b2b] text-white px-6 py-3 text-sm font-semibold font-['Instrument_Sans'] hover:bg-[#b82424] transition-colors"
								>
									Apply Now <ArrowRight size={14} />
								</Link>
							</div>
						</div>
					</div>
				)}

				{/* Results count */}
				<div className="flex items-center justify-between mb-8">
					<p className="text-xs uppercase tracking-[2px] text-[#aaa] font-['Instrument_Sans']">
						{isLoading ? 'Loading...' : `${filtered.length} program${filtered.length !== 1 ? 's' : ''} found`}
					</p>
				</div>

				{/* Program grid */}
				{isLoading ? (
					<EmptyState variant="page" title="Loading programs..." subtitle="Please wait." />
				) : filtered.length === 0 ? (
					<EmptyState variant="page" title="No programs found" subtitle="Try adjusting your filters or search term." />
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filtered.map(program => (
							<div key={program.id} className="bg-white border border-[#e0e0e0] p-7 flex flex-col gap-4">
								<div className="flex items-start justify-between">
									<CategoryBadge category={program.category} />
									<OpenBadge isOpen={program.isOpen} variant="outline" />
								</div>

								<div>
									<h3 className="font-['Syne'] font-bold text-lg text-[#0d0d0d] leading-snug mb-2">{program.title}</h3>
									<p className="text-sm text-[#555] font-['Instrument_Sans'] leading-relaxed line-clamp-3">
										{program.description}
									</p>
								</div>

								<div className="mt-auto pt-4 border-t border-[#f0f0f0] flex items-center justify-between">
									<div className="flex items-center gap-1.5 text-xs text-[#aaa] font-['Instrument_Sans']">
										<Calendar size={11} />
										<span>Deadline: {formatDeadline(program.applicationDeadline)}</span>
									</div>
									{program.isOpen && (
										<Link
											to="/register"
											className="text-xs font-semibold font-['Instrument_Sans'] text-[#d42b2b] hover:underline flex items-center gap-1"
										>
											Apply <ArrowRight size={11} />
										</Link>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</>
	);
}
