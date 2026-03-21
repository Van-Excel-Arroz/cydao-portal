import youthImg1 from '@/assets/images/youth-1.jpg';
import youthImg2 from '@/assets/images/youth-2.jpg';
import youthImg3 from '@/assets/images/youth-3.jpg';
import youthImg4 from '@/assets/images/youth-4.jpg';

const youthImages = [youthImg1, youthImg2, youthImg3, youthImg4];

const coreValues = [
	{
		key: 'INTEGRITY',
		body: 'We shall be honest and having strong moral principles. We shall be behaving ethically and does the right thing, even behind closed doors.',
	},
	{
		key: 'RESPECT',
		body: 'We shall seek an inclusive and welcoming environment for all through behavior that shows empathy and care for others.',
	},
	{
		key: 'EQUALITY',
		body: 'We shall create a society that is free, with equal opportunities and with responsible & compassionate citizens; you and I are equals.',
	},
	{
		key: 'DISCIPLINE',
		body: 'We shall practising self-restraint, being patient and tolerant despite demanding circumstances.',
	},
	{
		key: 'EXCELLENCE',
		body: 'We shall strive for excellence in everything we do; and we shall endeavour to make our fellow youth happy and satisfied.',
	},
	{
		key: 'TEAMWORK',
		body: "We shall recognise and value the contribution of individuals and teams in achieving the Office's mission, vision and goals.",
	},
	{
		key: 'GOD-CENTEREDNESS',
		body: 'We shall believe that everything comes from God and, therefore, our highest accountability is to Him.',
	},
];

export default function AboutPage() {
	return (
		<>
			{/* Hero */}
			<section className="relative overflow-hidden bg-[#0d0d0d] py-28">
				<div
					className="absolute right-0 top-0 bottom-0 w-[40%] bg-[#d42b2b] opacity-10"
					style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}
				/>
				<div className="relative max-w-7xl mx-auto px-6">
					<p className="eyebrow text-[#555] mb-6">Who We Are</p>
					<h1 className="font-['Syne'] font-extrabold text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] text-white max-w-2xl">
						BAGONG
						<br />
						CABUYAO
						<br />
						<span className="text-[#d42b2b]">CYDAO</span>
					</h1>
					<p className="mt-6 text-[#aaa] font-['Instrument_Sans'] text-base max-w-lg leading-relaxed">
						City Youth Development Affairs Office — serving the youth of Cabuyao, Laguna across all 18 barangays.
					</p>
				</div>
			</section>

			{/* Mission & Vision */}
			<section className="py-24 border-b border-[#e0e0e0]">
				<div className="max-w-7xl mx-auto px-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-[#e0e0e0]">
						{/* Mission */}
						<div className="p-12 border-b lg:border-b-0 lg:border-r border-[#e0e0e0]">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-1 h-8 bg-[#d42b2b]" />
								<p className="font-['Syne'] font-extrabold text-2xl text-[#0d0d0d]">Mission</p>
							</div>
							<p className="font-['Instrument_Sans'] text-base text-[#555] leading-relaxed">
								To develop a Bagong Cabuyao where youth actively participate in the sustainable developmental policies
								and programs and ensure that young people are{' '}
								<span className="font-semibold text-[#0d0d0d]">heard and valued</span>.
							</p>
						</div>

						{/* Vision */}
						<div className="p-12">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-1 h-8 bg-[#d42b2b]" />
								<p className="font-['Syne'] font-extrabold text-2xl text-[#0d0d0d]">Vision</p>
							</div>
							<p className="font-['Instrument_Sans'] text-base text-[#555] leading-relaxed">
								Cabuyao Youth Development Affairs Office envisions a future Bagong Cabuyao in which young people are
								valued as <span className="font-semibold text-[#0d0d0d]">empowered leaders, skilled local youth</span>{' '}
								and designers of communities that are built for all youth to thrive.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Core Values */}
			<section className="py-24 bg-[#f5f5f5]">
				<div className="max-w-7xl mx-auto px-6">
					<div className="mb-14">
						<p className="eyebrow text-[#aaa] mb-3">What We Stand For</p>
						<h2 className="font-['Syne'] font-bold text-4xl text-[#0d0d0d]">Core Values</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e0e0e0]">
						{coreValues.map((item, idx) => (
							<div key={item.key} className="bg-white p-8 flex flex-col gap-3">
								<div className="flex items-center gap-3">
									<span className="font-['Syne'] font-extrabold text-[13px] text-[#bbb]">
										{String(idx + 1).padStart(2, '0')}
									</span>
									<div className="h-px flex-1 bg-[#f0f0f0]" />
								</div>
								<h3 className="font-['Syne'] font-bold text-lg text-[#0d0d0d] tracking-wide">{item.key}</h3>
								<div className="w-8 h-0.5 bg-[#d42b2b]" />
								<p className="font-['Instrument_Sans'] text-sm text-[#555] leading-relaxed">{item.body}</p>
							</div>
						))}

						{/* Filler cell to complete the grid visually */}
						<div className="bg-[#d42b2b] p-8 flex items-end">
							<p
								className="font-['Syne'] font-extrabold text-white/20 text-[64px] leading-none select-none"
								style={{ writingMode: 'vertical-rl' }}
							>
								CYDAO
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Image strip */}
			<section className="grid grid-cols-2 lg:grid-cols-4 h-52">
				{youthImages.map((src, i) => (
					<div key={i} className="overflow-hidden">
						<img
							src={src}
							alt=""
							className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
						/>
					</div>
				))}
			</section>
		</>
	);
}
