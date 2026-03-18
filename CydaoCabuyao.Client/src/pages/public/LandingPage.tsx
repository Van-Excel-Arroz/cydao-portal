import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar, Users } from 'lucide-react';
import { PROGRAM_CATEGORY_LABELS, ProgramCategory, AnnouncementCategory } from '@/types';
import { OpenBadge, AnnouncementBadge } from '@/components/shared/Badge';

// --- Mock data (replace with API calls once backend controllers exist) ---

const mockEvents = [
	{
		id: 1,
		title: 'Kabataan Leadership Summit 2026',
		startDate: '2026-04-10',
		endDate: '2026-04-12',
		venue: 'Cabuyao City Hall Auditorium',
		availableSlots: 80,
		isOpen: true,
	},
	{
		id: 2,
		title: 'Environmental Awareness Day',
		startDate: '2026-04-22',
		endDate: '2026-04-22',
		venue: 'Bigaa Community Park',
		availableSlots: 150,
		isOpen: true,
	},
	{
		id: 3,
		title: 'Youth Mental Health Forum',
		startDate: '2026-05-03',
		endDate: '2026-05-03',
		venue: 'Cabuyao Public Library',
		availableSlots: 60,
		isOpen: false,
	},
	{
		id: 4,
		title: 'Livelihood Skills Training Fair',
		startDate: '2026-05-17',
		endDate: '2026-05-18',
		venue: 'Cabuyao Sports Complex',
		availableSlots: 200,
		isOpen: true,
	},
];

const mockAnnouncements = [
	{
		id: 1,
		title: 'Application Period Now Open for Leadership Program',
		body: 'Youth members aged 15–30 from all barangays are encouraged to apply for the Q2 Leadership Development Program. Deadline is April 30, 2026.',
		category: AnnouncementCategory.New,
		createdAt: '2026-03-10',
	},
	{
		id: 2,
		title: 'YORP Registration for 2026 Now Accepting Applications',
		body: 'Youth organizations seeking accreditation under the YORP program may now submit their documentary requirements at the CYDAO office.',
		category: AnnouncementCategory.YORP,
		createdAt: '2026-03-08',
	},
	{
		id: 3,
		title: 'Kabataan Summit Registration Closes April 1',
		body: 'Only 20 slots remaining for the Kabataan Leadership Summit. Register via the portal before April 1 to secure your slot.',
		category: AnnouncementCategory.Event,
		createdAt: '2026-03-05',
	},
	{
		id: 4,
		title: 'Portal Now Live — Register Your Account',
		body: 'The CYDAO Cabuyao online portal is now fully operational. Youth members may create accounts, apply for programs, and register for events.',
		category: AnnouncementCategory.Update,
		createdAt: '2026-03-01',
	},
];


function formatDate(dateStr: string) {
	return new Date(dateStr).toLocaleDateString('en-PH', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
}

function formatEventDate(start: string, end: string) {
	const s = new Date(start);
	const e = new Date(end);
	if (start === end) {
		return s.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
	}
	return `${s.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })} – ${e.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}`;
}

const programCategories = Object.values(ProgramCategory).filter(v => typeof v === 'number') as ProgramCategory[];

// --- Page Sections ---

function HeroSection() {
	return (
		<section className="relative flex flex-col overflow-hidden bg-white h-[calc(100vh-64px)] border-b border-[#e0e0e0]">
			{/* Diagonal red block */}
			<div
				className="absolute right-0 top-0 bottom-0 w-[45%] bg-[#d42b2b]"
				style={{ clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0% 100%)' }}
			/>

			{/* Hero image clipped to the red panel shape */}
			<div
				className="absolute right-0 top-0 bottom-0 w-[45%] overflow-hidden"
				style={{ clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0% 100%)' }}
			>
				<img
					src="https://picsum.photos/seed/cydao-hero/900/1200"
					alt="Cabuyao youth"
					className="w-full h-full object-cover mix-blend-multiply opacity-50"
				/>
			</div>

			{/* Main content */}
			<div className="relative flex-1 flex items-center overflow-hidden">
				<div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* Left: text + stats */}
					<div>
						<p className="eyebrow text-[#aaa] mb-6">CYDAO Cabuyao — Est. Portal 2026</p>

						<h1 className="font-['Syne'] font-extrabold text-[clamp(3rem,6vw,3.5rem)] leading-[0.95] text-[#0d0d0d] mb-8">
							EMPOWERING
							<br />
							<span className="text-[#d42b2b]">CABUYAO</span>
							<br />
							YOUTH
						</h1>

						<p className="font-['Instrument_Sans'] text-base text-[#555] max-w-sm leading-relaxed mb-10">
							Join programs, attend events, and connect with the City Youth Development Affairs Office — all in one
							place.
						</p>

						<div className="flex flex-wrap gap-4 mb-10">
							<Link
								to="/register"
								className="inline-flex items-center gap-2 bg-[#d42b2b] text-white px-7 py-3 text-sm font-semibold font-['Instrument_Sans'] hover:bg-[#b82424] transition-colors"
							>
								Join Now <ArrowRight size={15} />
							</Link>
							<Link
								to="/programs"
								className="inline-flex items-center gap-2 border border-[#0d0d0d] text-[#0d0d0d] px-7 py-3 text-sm font-semibold font-['Instrument_Sans'] hover:bg-[#0d0d0d] hover:text-white transition-colors"
							>
								Explore Programs
							</Link>
						</div>

						{/* Stats — F-pattern, tucked under buttons */}
						<div className="flex items-start gap-8 pt-8 border-t border-[#e0e0e0]">
							{[
								{ value: '18', label: 'Barangays Reached' },
								{ value: '50+', label: 'Registered Orgs' },
								{ value: '15,000+', label: 'Youth Empowered' },
							].map(({ value, label }) => (
								<div key={label} className="text-center">
									<p className="font-['Syne'] font-bold text-4xl text-[#0d0d0d] leading-none">{value}</p>
									<p className="text-[10px] text-[#aaa] uppercase tracking-[2px] mt-1 font-['Instrument_Sans']">
										{label}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function ProgramsBandSection() {
	return (
		<section className="bg-[#0d0d0d] py-16 overflow-hidden">
			<div className="max-w-7xl mx-auto px-6 mb-8 flex items-center justify-between">
				<p className="eyebrow text-[#aaa]">Programs</p>
				<Link
					to="/programs"
					className="text-sm font-['Instrument_Sans'] text-[#aaa] hover:text-white transition-colors flex items-center gap-1"
				>
					View All <ArrowRight size={13} />
				</Link>
			</div>

			<div className="overflow-hidden">
				<div
					className="flex"
					style={{
						animation: 'marquee 20s linear infinite',
						width: 'max-content',
					}}
				>
					{[...programCategories, ...programCategories, ...programCategories].map((cat, i) => (
						<Link
							key={i}
							to="/programs"
							className="flex-none border border-[#333] px-6 py-4 mr-3 group hover:border-[#d42b2b] transition-colors"
						>
							<p className="font-['Syne'] font-bold text-white text-xs tracking-widest uppercase group-hover:text-[#d42b2b] transition-colors whitespace-nowrap">
								{PROGRAM_CATEGORY_LABELS[cat]}
							</p>
						</Link>
					))}
				</div>
			</div>

			<style>{`
				@keyframes marquee {
					0%   { transform: translateX(0); }
					100% { transform: translateX(-33.333%); }
				}
			`}</style>
		</section>
	);
}

function KabataanSection() {
	return (
		<section className="py-28 border-b border-[#e0e0e0] bg-[#f5f5f5]">
			<div className="max-w-7xl mx-auto px-6">
				<p className="eyebrow text-[#aaa] mb-10">Featured Program</p>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
					{/* Left: text content */}
					<div className="flex flex-col justify-between">
						<div>
							<h2 className="font-['Syne'] font-bold text-5xl text-[#0d0d0d] mb-2">
								Kabataan
								<br />
								Caravan
							</h2>
							<div className="w-12 h-0.5 bg-[#d42b2b] mb-6" />
							<p className="font-['Instrument_Sans'] text-base text-[#555] leading-relaxed mb-8">
								A flagship CYDAO initiative that brings community programs directly to Cabuyao's 18 barangays — covering
								leadership development, livelihood training, mental health awareness, environmental advocacy, and youth
								organizing. Youth aged 15 to 30 are encouraged to join.
							</p>

							<div className="grid grid-cols-2 gap-6 mb-10">
								{[
									{ label: 'Age Range', value: '15 – 30 years old' },
									{ label: 'Coverage', value: 'All 18 Barangays' },
									{ label: 'Categories', value: '7 Program Types' },
									{ label: 'Registration', value: 'Free & Open' },
								].map(({ label, value }) => (
									<div key={label}>
										<p className="text-[10px] uppercase tracking-[2px] text-[#aaa] mb-1">{label}</p>
										<p className="font-['Instrument_Sans'] font-semibold text-sm text-[#0d0d0d]">{value}</p>
									</div>
								))}
							</div>
						</div>

						<Link
							to="/programs"
							className="inline-flex items-center gap-2 bg-[#d42b2b] text-white px-7 py-3 text-sm font-semibold font-['Instrument_Sans'] hover:bg-[#b82424] transition-colors w-fit"
						>
							Apply to a Program <ArrowRight size={15} />
						</Link>
					</div>

					{/* Right: image — same height as the left content */}
					<div className="relative overflow-hidden">
						<img
							src="https://picsum.photos/seed/cydao-caravan/800/600"
							alt="Kabataan Caravan"
							className="w-full h-full object-cover"
						/>
						<div className="absolute top-0 left-0 w-1 h-full bg-[#d42b2b]" />
						<div className="absolute bottom-4 left-5 right-5">
							<p className="text-[10px] uppercase tracking-[2px] text-white/70 font-['Instrument_Sans']">
								Kabataan Caravan — 2025 Edition
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function EventsSection() {
	return (
		<section className="py-24 border-b border-[#e0e0e0]">
			<div className="max-w-7xl mx-auto px-6">
				<div className="flex items-end justify-between mb-16">
					<div>
						<p className="eyebrow text-[#aaa] mb-3">Upcoming</p>
						<h2 className="font-['Syne'] font-bold text-4xl text-[#0d0d0d]">Events</h2>
					</div>
					<Link
						to="/events"
						className="text-sm font-['Instrument_Sans'] text-[#aaa] hover:text-[#d42b2b] transition-colors flex items-center gap-1"
					>
						All Events <ArrowRight size={13} />
					</Link>
				</div>

				{/* Zigzag layout — even cards shift down */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
					{mockEvents.map((event, idx) => (
						<div
							key={event.id}
							className={`flex flex-col h-105 border border-[#e0e0e0] bg-white group hover:border-[#d42b2b] transition-colors ${
								idx % 2 === 1 ? 'mt-10' : ''
							}`}
						>
							{/* Image */}
							<div className="overflow-hidden">
								<img
									src={`https://picsum.photos/seed/event${event.id}/400/260`}
									alt={event.title}
									className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
								/>
							</div>

							{/* Content */}
							<div className="p-5 flex flex-col flex-1">
								{/* Status badge */}
								<div className="mb-3">
									<OpenBadge isOpen={event.isOpen} />
								</div>

								<p className="font-['Syne'] font-bold text-sm text-[#0d0d0d] leading-snug mb-3 flex-1">{event.title}</p>

								<div className="space-y-1.5 mb-4">
									<p className="flex items-center gap-1.5 text-[11px] text-[#aaa] font-['Instrument_Sans']">
										<Calendar size={10} />
										{formatEventDate(event.startDate, event.endDate)}
									</p>
									<p className="flex items-center gap-1.5 text-[11px] text-[#aaa] font-['Instrument_Sans']">
										<MapPin size={10} />
										{event.venue}
									</p>
									<p className="flex items-center gap-1.5 text-[11px] text-[#aaa] font-['Instrument_Sans']">
										<Users size={10} />
										{event.availableSlots} slots available
									</p>
								</div>

								{event.isOpen && (
									<Link
										to="/events"
										className="inline-flex items-center gap-1 text-xs font-semibold font-['Instrument_Sans'] text-[#d42b2b] hover:underline mt-auto"
									>
										Register <ArrowRight size={11} />
									</Link>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function AnnouncementsSection() {
	const [featured, ...rest] = mockAnnouncements;

	return (
		<section className="py-24 bg-[#f5f5f5]">
			<div className="max-w-7xl mx-auto px-6">
				<div className="flex items-end justify-between mb-12">
					<div>
						<p className="eyebrow text-[#aaa] mb-3">Latest</p>
						<h2 className="font-['Syne'] font-bold text-4xl text-[#0d0d0d]">Announcements</h2>
					</div>
					<Link
						to="/announcements"
						className="text-sm font-['Instrument_Sans'] text-[#aaa] hover:text-[#d42b2b] transition-colors flex items-center gap-1"
					>
						View All <ArrowRight size={13} />
					</Link>
				</div>

				{/* Featured announcement — large image + text */}
				<div className="grid grid-cols-1 lg:grid-cols-2 border border-[#e0e0e0] bg-white mb-8">
					<div className="overflow-hidden">
						<img
							src="https://picsum.photos/seed/ann-featured/800/480"
							alt={featured.title}
							className="w-full h-64 lg:h-full object-cover"
						/>
					</div>
					<div className="p-8 flex flex-col justify-center">
						<div className="flex items-center gap-2 mb-4">
							<AnnouncementBadge category={featured.category} />
							<span className="text-[10px] text-[#aaa] font-['Instrument_Sans']">{formatDate(featured.createdAt)}</span>
						</div>
						<h3 className="font-['Syne'] font-bold text-2xl text-[#0d0d0d] mb-3 leading-snug">{featured.title}</h3>
						<p className="text-sm text-[#555] font-['Instrument_Sans'] leading-relaxed mb-6">{featured.body}</p>
						<Link
							to="/announcements"
							className="inline-flex items-center gap-1.5 text-sm font-semibold font-['Instrument_Sans'] text-[#d42b2b] hover:underline"
						>
							Read More <ArrowRight size={13} />
						</Link>
					</div>
				</div>

				{/* Remaining — 3-column newspaper grid with images */}
				<div className="columns-1 md:columns-2 lg:columns-3 gap-6">
					{rest.map(ann => (
						<div key={ann.id} className="break-inside-avoid mb-6 bg-white border border-[#e0e0e0]">
							<div className="overflow-hidden">
								<img
									src={`https://picsum.photos/seed/ann${ann.id}/600/280`}
									alt={ann.title}
									className="w-full h-36 object-cover"
								/>
							</div>
							<div className="p-5">
								<div className="flex items-center gap-2 mb-2">
									<AnnouncementBadge category={ann.category} />
									<span className="text-[10px] text-[#aaa] font-['Instrument_Sans']">{formatDate(ann.createdAt)}</span>
								</div>
								<h3 className="font-['Syne'] font-bold text-sm text-[#0d0d0d] mb-2 leading-snug">{ann.title}</h3>
								<p className="text-xs text-[#555] font-['Instrument_Sans'] leading-relaxed">{ann.body}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function CtaBannerSection() {
	return (
		<section className="relative overflow-hidden bg-[#d42b2b] py-24">
			<div className="absolute inset-0">
				<img
					src="https://picsum.photos/seed/cydao-cta/1400/600"
					alt=""
					aria-hidden="true"
					className="w-full h-full object-cover opacity-15 mix-blend-multiply"
				/>
			</div>

			<div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
				<div>
					<p className="eyebrow text-white/60 mb-3">Get Started</p>
					<h2 className="font-['Syne'] font-extrabold text-4xl text-white leading-tight">
						Ready to make
						<br />
						your mark?
					</h2>
				</div>
				<div className="flex flex-wrap gap-4 shrink-0">
					<Link
						to="/register"
						className="inline-flex items-center gap-2 bg-white text-[#d42b2b] px-8 py-3.5 text-sm font-bold font-['Instrument_Sans'] hover:bg-[#f5f5f5] transition-colors"
					>
						Create Account <ArrowRight size={15} />
					</Link>
					<Link
						to="/programs"
						className="inline-flex items-center gap-2 border border-white/50 text-white px-8 py-3.5 text-sm font-bold font-['Instrument_Sans'] hover:border-white hover:bg-white/10 transition-colors"
					>
						Browse Programs
					</Link>
				</div>
			</div>
		</section>
	);
}

export default function LandingPage() {
	return (
		<>
			<HeroSection />
			<KabataanSection />
			<ProgramsBandSection />
			<EventsSection />
			<AnnouncementsSection />
			<CtaBannerSection />
		</>
	);
}
