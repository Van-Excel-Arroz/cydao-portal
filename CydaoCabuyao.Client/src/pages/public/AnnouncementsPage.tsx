import { AnnouncementCategory, ANNOUNCEMENT_CATEGORY_LABELS } from '@/types';

const mockAnnouncements = [
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
	{
		id: 6,
		title: 'Environmental Youth Camp: Call for Participants',
		body: "The Environmental Youth Camp is open for registration. Join 3 days of immersive activities on sustainability, watershed management, and ecological advocacy at Cabuyao's forests. Limited to 60 participants.",
		category: AnnouncementCategory.Event,
		createdAt: '2026-02-20',
	},
	{
		id: 7,
		title: 'YORP Accredited Orgs for 2025 — Official List Released',
		body: 'The official list of YORP-accredited youth organizations for 2025 has been released. Organizations not on the list are encouraged to apply for the 2026 accreditation cycle which opens in March.',
		category: AnnouncementCategory.YORP,
		createdAt: '2026-02-15',
	},
	{
		id: 8,
		title: 'Academic Scholarship Grant Deadline Extended',
		body: "The deadline for the CYDAO Academic Scholarship Grant has been extended to March 31, 2026. Applicants must be enrolled in a tertiary institution and residing in any of Cabuyao's 18 barangays.",
		category: AnnouncementCategory.Update,
		createdAt: '2026-02-10',
	},
	{
		id: 9,
		title: 'Mental Wellness Forum Recap — Key Takeaways',
		body: 'The Youth Mental Health Forum held last February drew 55 participants and featured three licensed psychologists. A summary of key takeaways and available mental health resources has been posted on our Facebook page.',
		category: AnnouncementCategory.Update,
		createdAt: '2026-02-05',
	},
];

const categoryColors: Record<AnnouncementCategory, string> = {
	[AnnouncementCategory.New]: 'bg-[#d42b2b] text-white',
	[AnnouncementCategory.Event]: 'bg-[#0d0d0d] text-white',
	[AnnouncementCategory.YORP]: 'bg-[#f5f5f5] text-[#0d0d0d] border border-[#e0e0e0]',
	[AnnouncementCategory.Update]: 'bg-[#f5f5f5] text-[#0d0d0d] border border-[#e0e0e0]',
};

function formatDate(dateStr: string) {
	return new Date(dateStr).toLocaleDateString('en-PH', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	});
}

export default function AnnouncementsPage() {
	const [featured, ...rest] = mockAnnouncements;

	return (
		<>
			{/* Page header — newspaper masthead style */}
			<section>
				<div className="max-w-7xl mx-auto px-6 pt-10 pb-0">
					{/* Big headline */}
					<h1 className="text-center font-['Syne'] font-extrabold text-[clamp(3.5rem,10vw,2rem)] leading-[0.85] text-[#0d0d0d] tracking-tight mt-5 mb-15">
						ANNOUNCEMENTS
					</h1>

					{/* Tagline strip */}
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

			<div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
				{/* Featured — full-width editorial card */}
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
									<span
										className={`text-[9px] font-bold uppercase tracking-[2px] px-2 py-0.5 font-['Instrument_Sans'] ${categoryColors[featured.category]}`}
									>
										{ANNOUNCEMENT_CATEGORY_LABELS[featured.category]}
									</span>
									<span className="text-xs text-[#aaa] font-['Instrument_Sans']">{formatDate(featured.createdAt)}</span>
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
				{rest.length > 0 && (
					<div>
						<div className="flex items-center gap-4 mb-8">
							<p className="text-[11px] uppercase tracking-[3px] text-[#aaa] font-['Instrument_Sans'] shrink-0">
								More Announcements
							</p>
							<div className="h-px flex-1 bg-[#e0e0e0]" />
							<p className="text-[11px] text-[#aaa] font-['Instrument_Sans'] shrink-0">
								{rest.length} item{rest.length !== 1 ? 's' : ''}
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{rest.map((ann, idx) => (
								<div
									key={ann.id}
									className={`bg-white border border-[#e0e0e0] flex flex-col ${
										idx === 0 ? 'md:col-span-2 md:row-span-2' : ''
									}`}
								>
									<div className="overflow-hidden">
										<img
											src={`https://picsum.photos/seed/ann-page${ann.id}/700/320`}
											alt={ann.title}
											className={`w-full object-cover ${idx === 0 ? 'h-56' : 'h-36'}`}
										/>
									</div>
									<div className={`flex flex-col flex-1 ${idx === 0 ? 'p-8' : 'p-5'}`}>
										<div className="flex items-center gap-2 mb-3">
											<span
												className={`text-[9px] font-bold uppercase tracking-[2px] px-2 py-0.5 font-['Instrument_Sans'] ${categoryColors[ann.category]}`}
											>
												{ANNOUNCEMENT_CATEGORY_LABELS[ann.category]}
											</span>
											<span className="text-[10px] text-[#aaa] font-['Instrument_Sans']">
												{formatDate(ann.createdAt)}
											</span>
										</div>
										<h3
											className={`font-['Syne'] font-bold text-[#0d0d0d] leading-snug mb-2 ${idx === 0 ? 'text-xl' : 'text-sm'}`}
										>
											{ann.title}
										</h3>
										<p
											className={`text-[#555] font-['Instrument_Sans'] leading-relaxed ${idx === 0 ? 'text-sm' : 'text-xs line-clamp-3'}`}
										>
											{ann.body}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</>
	);
}
