import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ANNOUNCEMENT_CATEGORY_LABELS } from '@/types';
import type { Announcement } from '@/types';
import { AnnouncementBadge } from '@/components/shared/Badge';
import { EmptyState } from '@/components/shared/EmptyState';
import { SearchInput } from '@/components/shared/SearchInput';
import { FieldSelect } from '@/components/shared/FormField';
import api from '@/lib/api';

const ALL = 'all';

const categoryOptions = [
	{ label: 'All Categories', value: ALL },
	...Object.entries(ANNOUNCEMENT_CATEGORY_LABELS).map(([val, label]) => ({ label, value: val })),
];

function formatDate(dateStr: string) {
	return new Date(dateStr).toLocaleDateString('en-PH', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	});
}

export default function AnnouncementsPage() {
	const [search, setSearch] = useState('');
	const [category, setCategory] = useState(ALL);

	const { data: announcements = [], isLoading } = useQuery({
		queryKey: ['announcements'],
		queryFn: () => api.get<Announcement[]>('/announcements').then(r => r.data),
	});

	const filtered = useMemo(() => {
		let list = [...announcements];
		if (search.trim()) {
			const q = search.toLowerCase();
			list = list.filter(a => a.title.toLowerCase().includes(q) || a.body.toLowerCase().includes(q));
		}
		if (category !== ALL) {
			list = list.filter(a => a.category === Number(category));
		}
		return list;
	}, [announcements, search, category]);

	const isFiltered = search.trim() !== '' || category !== ALL;
	const [featured, ...rest] = isFiltered ? [] : announcements;
	const restList = isFiltered ? filtered : rest;

	return (
		<>
			{/* Page header — newspaper masthead style */}
			<section>
				<div className="max-w-7xl mx-auto px-6 pt-10 pb-0">
					<h1 className="text-center font-['Syne'] font-extrabold text-[clamp(3.5rem,10vw,2rem)] leading-[0.85] text-[#0d0d0d] tracking-tight mt-5 mb-15">
						ANNOUNCEMENTS
					</h1>
					<div className="text-xs flex items-center justify-between gap-4 mt-4 pb-6 border-t border-[#e0e0e0] pt-4">
						<p className="text-sm text-[#555] font-['Instrument_Sans'] tracking-wide">
							Updates, notices, and news from the City Youth Development Affairs Office
						</p>
						<p className="text-sm text-[#555] font-['Instrument_Sans']">
							{new Date().toLocaleDateString('en-PH', {
								weekday: 'long',
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</p>
					</div>
				</div>
			</section>

			{/* Filter bar */}
			<section className="border-b border-[#e0e0e0] bg-[#f5f5f5] sticky top-16 z-40">
				<div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-3">
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
					<div className="flex-1" />
					<SearchInput
						placeholder="Search announcements..."
						value={search}
						onChange={e => setSearch(e.target.value)}
						containerClassName="w-64"
					/>
				</div>
			</section>

			<div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
				{isLoading ? (
					<EmptyState variant="page" title="Loading announcements..." subtitle="Please wait." />
				) : filtered.length === 0 ? (
					<EmptyState variant="page" title="No announcements found" subtitle="Try a different search or category." />
				) : (
					<>
						{/* Featured — full-width editorial card (only when unfiltered) */}
						{featured && (
							<div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] border border-[#e0e0e0]">
								<div className="overflow-hidden">
									<img
										src="https://picsum.photos/seed/ann-page-feat/900/500"
										alt={featured.title}
										className="w-full h-64 lg:h-full object-cover"
									/>
								</div>
								<div className="p-10 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#e0e0e0]">
									<div>
										<div className="flex items-center gap-2 mb-5">
											<AnnouncementBadge category={featured.category} />
											<span className="text-xs text-[#aaa] font-['Instrument_Sans']">
												{formatDate(featured.createdAt)}
											</span>
										</div>
										<h2 className="font-['Syne'] font-bold text-2xl lg:text-3xl text-[#0d0d0d] leading-snug mb-4">
											{featured.title}
										</h2>
										<p className="text-sm text-[#555] font-['Instrument_Sans'] leading-relaxed">{featured.body}</p>
									</div>
									<div className="mt-8 pt-6 border-t border-[#f0f0f0]">
										<p className="text-[10px] uppercase tracking-[2px] text-[#aaa] font-['Instrument_Sans']">
											Posted by CYDAO Cabuyao
										</p>
									</div>
								</div>
							</div>
						)}

						{/* Remaining — mixed editorial layout */}
						{restList.length > 0 && (
							<div>
								{!isFiltered && (
									<div className="flex items-center gap-4 mb-8">
										<p className="text-[11px] uppercase tracking-[3px] text-[#aaa] font-['Instrument_Sans'] shrink-0">
											More Announcements
										</p>
										<div className="h-px flex-1 bg-[#e0e0e0]" />
										<p className="text-[11px] text-[#aaa] font-['Instrument_Sans'] shrink-0">
											{restList.length} item{restList.length !== 1 ? 's' : ''}
										</p>
									</div>
								)}

								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									{restList.map((ann, idx) => (
										<div
											key={ann.id}
											className={`bg-white border border-[#e0e0e0] flex flex-col ${
												!isFiltered && idx === 0 ? 'md:col-span-2 md:row-span-2' : ''
											}`}
										>
											<div className="overflow-hidden">
												<img
													src={`https://picsum.photos/seed/ann-page${ann.id}/700/320`}
													alt={ann.title}
													className={`w-full object-cover ${!isFiltered && idx === 0 ? 'h-56' : 'h-36'}`}
												/>
											</div>
											<div className={`flex flex-col flex-1 ${!isFiltered && idx === 0 ? 'p-8' : 'p-5'}`}>
												<div className="flex items-center gap-2 mb-3">
													<AnnouncementBadge category={ann.category} />
													<span className="text-[10px] text-[#aaa] font-['Instrument_Sans']">
														{formatDate(ann.createdAt)}
													</span>
												</div>
												<h3
													className={`font-['Syne'] font-bold text-[#0d0d0d] leading-snug mb-2 ${!isFiltered && idx === 0 ? 'text-xl' : 'text-sm'}`}
												>
													{ann.title}
												</h3>
												<p
													className={`text-[#555] font-['Instrument_Sans'] leading-relaxed ${!isFiltered && idx === 0 ? 'text-sm' : 'text-xs line-clamp-3'}`}
												>
													{ann.body}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</>
				)}
			</div>
		</>
	);
}
