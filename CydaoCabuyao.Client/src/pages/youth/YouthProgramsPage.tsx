import { useState, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { YouthLayout } from '@/components/layout/YouthLayout';
import { ProgramCategory, PROGRAM_CATEGORY_LABELS } from '@/types';
import { useApplicationsStore } from '@/stores/applicationsStore';
import { CategoryBadge, OpenBadge, Badge } from '@/components/shared/Badge';
import { Btn } from '@/components/shared/Btn';
import { EmptyState } from '@/components/shared/EmptyState';
import { Modal, ModalCover, ModalHeader, ModalBody, ModalFooter } from '@/components/shared/Modal';
import { SearchInput } from '@/components/shared/SearchInput';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { FieldSelect } from '@/components/shared/FormField';

interface Program {
	id: number;
	title: string;
	description: string;
	category: ProgramCategory;
	applicationDeadline: string;
	isOpen: boolean;
}

const mockPrograms: Program[] = [
	{
		id: 1,
		title: 'Leadership Development Program',
		description:
			'A structured program designed to cultivate leadership skills, civic responsibility, and community awareness among Cabuyao youth aged 15–30. Participants undergo workshops on public speaking, community organizing, project management, and ethical leadership, culminating in a barangay-level capstone project.',
		category: ProgramCategory.Leadership,
		applicationDeadline: '2026-04-30',
		isOpen: true,
	},
	{
		id: 2,
		title: 'Environmental Youth Camp',
		description:
			"A multi-day immersive camp focused on environmental stewardship, sustainability practices, and ecological awareness across Cabuyao's watersheds and barangays. Participants join cleanup drives, tree-planting activities, and attend sessions on solid waste management and climate action.",
		category: ProgramCategory.Environment,
		applicationDeadline: '2026-05-15',
		isOpen: true,
	},
	{
		id: 3,
		title: 'Youth Sports League 2026',
		description:
			'Citywide inter-barangay sports competition covering basketball, volleyball, and athletics. Open to youth aged 15–25 from all 18 barangays. Teams must be registered by barangay youth councils. Medals and certificates awarded to top finishers.',
		category: ProgramCategory.Sports,
		applicationDeadline: '2026-04-10',
		isOpen: false,
	},
	{
		id: 4,
		title: 'Arts & Culture Workshop Series',
		description:
			"A series of workshops covering visual arts, traditional dance, music production, and digital media — celebrating Cabuyao's cultural heritage. The program runs over eight weekends and culminates in a showcase at the annual CYDAO Cultural Festival at Cabuyao City Plaza.",
		category: ProgramCategory.ArtsAndCulture,
		applicationDeadline: '2026-05-20',
		isOpen: true,
	},
	{
		id: 5,
		title: 'Livelihood Skills Training (TESDA)',
		description:
			'Free TESDA-accredited skills training for youth aged 18–30, covering welding, bread & pastry production, and computer hardware servicing. Participants who complete the program receive a National Certificate and are connected to local employment and enterprise partners.',
		category: ProgramCategory.Livelihood,
		applicationDeadline: '2026-04-25',
		isOpen: true,
	},
	{
		id: 6,
		title: 'Mental Wellness Support Program',
		description:
			'A peer-support and counseling program addressing youth mental health, stress management, and emotional resilience — facilitated by licensed professionals. Includes weekly group sessions, one-on-one consultations, and a community helpline staffed by trained youth volunteers.',
		category: ProgramCategory.MentalHealth,
		applicationDeadline: '2026-06-01',
		isOpen: true,
	},
	{
		id: 7,
		title: 'Academic Scholarship Grant',
		description:
			'Financial assistance for qualified youth enrolled in tertiary education, prioritizing students from low-income households across all 18 barangays. Awardees receive a semestral stipend and are expected to render community service hours in their home barangay.',
		category: ProgramCategory.Scholarship,
		applicationDeadline: '2026-03-31',
		isOpen: false,
	},
	{
		id: 8,
		title: 'Community Organizing Seminar',
		description:
			'Hands-on training on barangay-level youth organizing, advocacy writing, and participatory governance for aspiring youth leaders. Participants draft a real community action plan reviewed by CYDAO staff, with the best plans presented at the Cabuyao Youth Assembly.',
		category: ProgramCategory.Leadership,
		applicationDeadline: '2026-05-10',
		isOpen: true,
	},
];

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
	const [selected, setSelected] = useState<Program | null>(null);

	const { applications, addApplication } = useApplicationsStore();
	const appliedIds = new Set(applications.map(a => a.programId));

	const filtered = useMemo(() => {
		let list = [...mockPrograms];
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
	}, [search, category, status]);

	function handleApply(program: Program) {
		addApplication({
			programId: program.id,
			programTitle: program.title,
			programCategory: program.category,
			programDescription: program.description,
		});
		setSelected(null);
	}

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
				{filtered.length} program{filtered.length !== 1 ? 's' : ''}
			</p>

			{/* Program grid */}
			{filtered.length === 0 ? (
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
									<Btn variant="primary" size="sm" onClick={() => handleApply(selected)}>
										Apply Now
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
