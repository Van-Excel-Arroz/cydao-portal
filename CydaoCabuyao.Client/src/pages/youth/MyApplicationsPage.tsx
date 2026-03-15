import { useState } from 'react';
import { X } from 'lucide-react';
import { YouthLayout } from '@/components/layout/YouthLayout';
import { ApplicationStatus, APPLICATION_STATUS_LABELS, ProgramCategory, PROGRAM_CATEGORY_LABELS } from '@/types';

interface MyApplication {
	id: number;
	programTitle: string;
	programCategory: ProgramCategory;
	programDescription: string;
	motivation: string;
	status: ApplicationStatus;
	submittedAt: string;
}

const categoryImage: Record<ProgramCategory, string> = {
	[ProgramCategory.Leadership]: 'https://picsum.photos/seed/prog-leadership/800/300',
	[ProgramCategory.Environment]: 'https://picsum.photos/seed/prog-environment/800/300',
	[ProgramCategory.Sports]: 'https://picsum.photos/seed/prog-sports/800/300',
	[ProgramCategory.ArtsAndCulture]: 'https://picsum.photos/seed/prog-arts/800/300',
	[ProgramCategory.Livelihood]: 'https://picsum.photos/seed/prog-livelihood/800/300',
	[ProgramCategory.MentalHealth]: 'https://picsum.photos/seed/prog-mentalhealth/800/300',
	[ProgramCategory.Scholarship]: 'https://picsum.photos/seed/prog-scholarship/800/300',
};

const initialApplications: MyApplication[] = [
	{
		id: 1,
		programTitle: 'Leadership Development Program',
		programCategory: ProgramCategory.Leadership,
		programDescription:
			'A comprehensive leadership training program for youth aged 15–30 from all barangays of Cabuyao. Participants will undergo workshops on public speaking, community organizing, project management, and ethical leadership. The program culminates in a capstone project where participants implement a community initiative in their own barangay.',
		motivation:
			'I want to develop my leadership skills to serve my community better and become a role model for other youth in Cabuyao.',
		status: ApplicationStatus.Approved,
		submittedAt: '2026-03-01T10:00:00Z',
	},
	{
		id: 2,
		programTitle: 'Environmental Awareness Campaign',
		programCategory: ProgramCategory.Environment,
		programDescription:
			'Community-based environmental program focusing on waste segregation, tree planting, and river cleanup across all barangays of Cabuyao. Volunteers will participate in monthly cleanup drives, attend environmental education sessions, and help facilitate awareness campaigns in local schools and barangay halls.',
		motivation:
			'Environmental protection is close to my heart. I want to make a tangible impact in keeping Cabuyao clean and green.',
		status: ApplicationStatus.UnderReview,
		submittedAt: '2026-03-05T08:00:00Z',
	},
	{
		id: 3,
		programTitle: 'Sining at Kultura Workshop',
		programCategory: ProgramCategory.ArtsAndCulture,
		programDescription:
			'Arts and cultural workshop celebrating Filipino heritage through visual arts, dance, and music. The program runs over eight weekends and covers traditional Filipino folk dances, indigenous visual art forms, and musical instruments. Participants will showcase their work in the annual CYDAO Cultural Festival held at the Cabuyao City Plaza.',
		motivation:
			'Art is my passion. I want to use this workshop to hone my skills and represent our barangay in cultural activities.',
		status: ApplicationStatus.Pending,
		submittedAt: '2026-03-08T11:00:00Z',
	},
];

const categoryBadge: Record<ProgramCategory, string> = {
	[ProgramCategory.Leadership]: 'bg-blue-50 text-blue-700 border-blue-200',
	[ProgramCategory.Environment]: 'bg-green-50 text-green-700 border-green-200',
	[ProgramCategory.Sports]: 'bg-orange-50 text-orange-700 border-orange-200',
	[ProgramCategory.ArtsAndCulture]: 'bg-purple-50 text-purple-700 border-purple-200',
	[ProgramCategory.Livelihood]: 'bg-yellow-50 text-yellow-700 border-yellow-200',
	[ProgramCategory.MentalHealth]: 'bg-pink-50 text-pink-700 border-pink-200',
	[ProgramCategory.Scholarship]: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

const statusBadge: Record<ApplicationStatus, string> = {
	[ApplicationStatus.Pending]: 'bg-[#f5f5f5] text-[#aaaaaa] border-[#e0e0e0]',
	[ApplicationStatus.UnderReview]: 'bg-yellow-50 text-yellow-700 border-yellow-200',
	[ApplicationStatus.Approved]: 'bg-green-50 text-green-700 border-green-200',
	[ApplicationStatus.Rejected]: 'bg-red-50 text-[#d42b2b] border-red-200',
};

function formatDate(dateStr: string) {
	return new Date(dateStr).toLocaleDateString('en-PH', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
}

export default function MyApplicationsPage() {
	const [applications, setApplications] = useState<MyApplication[]>(initialApplications);
	const [selectedApp, setSelectedApp] = useState<MyApplication | null>(null);
	const [confirmCancel, setConfirmCancel] = useState(false);

	function handleCancel() {
		if (!selectedApp) return;
		setApplications(prev => prev.filter(a => a.id !== selectedApp.id));
		setSelectedApp(null);
		setConfirmCancel(false);
	}

	function handleCloseModal() {
		setSelectedApp(null);
		setConfirmCancel(false);
	}

	return (
		<YouthLayout title="My Applications" noScroll>
			<div className="flex flex-col h-full min-h-0">
				<div className="flex-1 flex flex-col min-h-0 bg-white border border-[#e0e0e0]">
					{/* Scrollable area */}
					<div className="flex-1 overflow-y-scroll">
						{/* Sticky header */}
						<div className="sticky top-0 z-10 grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-[#e0e0e0] bg-[#fafafa]">
							{(
								[
									{ label: 'Program', center: false },
									{ label: 'Category', center: true },
									{ label: 'Submitted', center: true },
									{ label: 'Status', center: true },
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
						{applications.length === 0 ? (
							<div className="flex items-center justify-center h-40">
								<p className="text-sm text-[#aaaaaa] font-['Instrument_Sans']">
									You have not submitted any applications yet.
								</p>
							</div>
						) : (
							applications.map((app, i) => (
								<button
									key={app.id}
									onClick={() => {
										setSelectedApp(app);
										setConfirmCancel(false);
									}}
									className={`w-full text-left grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-[#f5f5f5] last:border-0 hover:bg-[#fafafa] transition-colors ${
										i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'
									}`}
								>
									<div className="px-5 py-3.5">
										<p className="text-sm font-semibold text-[#0d0d0d] font-['Instrument_Sans'] leading-tight">
											{app.programTitle}
										</p>
									</div>

									<div className="px-5 py-3.5 flex items-center justify-center">
										<span
											className={`text-[10px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] px-2 py-0.5 border ${categoryBadge[app.programCategory]}`}
										>
											{PROGRAM_CATEGORY_LABELS[app.programCategory]}
										</span>
									</div>

									<div className="px-5 py-3.5 flex items-center justify-center">
										<p className="text-sm text-[#0d0d0d] font-['Instrument_Sans']">{formatDate(app.submittedAt)}</p>
									</div>

									<div className="px-5 py-3.5 flex items-center justify-center">
										<span
											className={`text-[10px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] px-2 py-0.5 border ${statusBadge[app.status]}`}
										>
											{APPLICATION_STATUS_LABELS[app.status]}
										</span>
									</div>
								</button>
							))
						)}
					</div>

					{/* Footer */}
					<div className="shrink-0 border-t border-[#e0e0e0] px-5 py-2.5 bg-[#fafafa]">
						<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans']">
							{applications.length} application{applications.length !== 1 ? 's' : ''}
						</p>
					</div>
				</div>
			</div>

			{/* Detail modal */}
			{selectedApp && (
				<div
					className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
					onClick={e => {
						if (e.target === e.currentTarget) handleCloseModal();
					}}
				>
					<div className="bg-white w-full max-w-lg shadow-xl">
						{/* Cover image */}
						<div className="relative h-36 overflow-hidden">
							<img
								src={categoryImage[selectedApp.programCategory]}
								alt={selectedApp.programTitle}
								className="w-full h-full object-cover"
							/>
							<div className="absolute inset-0 bg-[#0d0d0d]/50" />
							<button
								onClick={handleCloseModal}
								className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
							>
								<X size={18} />
							</button>
							<div className="absolute bottom-3 left-5 flex items-center gap-2">
								<span
									className={`text-[10px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] px-2 py-0.5 border ${categoryBadge[selectedApp.programCategory]}`}
								>
									{PROGRAM_CATEGORY_LABELS[selectedApp.programCategory]}
								</span>
								<span
									className={`text-[10px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] px-2 py-0.5 border ${statusBadge[selectedApp.status]}`}
								>
									{APPLICATION_STATUS_LABELS[selectedApp.status]}
								</span>
							</div>
						</div>

						{/* Header */}
						<div className="px-6 py-4 border-b border-[#e0e0e0]">
							<h2 className="font-['Syne'] font-bold text-lg text-[#0d0d0d] leading-tight">
								{selectedApp.programTitle}
							</h2>
							<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans'] mt-1">
								Submitted {formatDate(selectedApp.submittedAt)}
							</p>
						</div>

						{/* Body */}
						<div className="px-6 py-5 flex flex-col gap-4">
							<p className="text-[11px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-[#aaaaaa]">
								About this Program
							</p>
							<div className="max-h-36 overflow-y-auto pr-1">
								<p className="text-sm font-['Instrument_Sans'] text-[#0d0d0d] leading-relaxed">
									{selectedApp.programDescription}
								</p>
							</div>
						</div>

						{/* Footer */}
						<div className="flex items-center justify-between px-6 py-4 border-t border-[#e0e0e0]">
							<div>
								{selectedApp.status === ApplicationStatus.Pending &&
									(confirmCancel ? (
										<div className="flex items-center gap-3">
											<p className="text-xs text-[#0d0d0d] font-['Instrument_Sans']">Cancel this application?</p>
											<button
												onClick={handleCancel}
												className="text-[10px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] text-white bg-[#d42b2b] px-3 py-1.5 hover:bg-[#b82424] transition-colors"
											>
												Yes, Cancel
											</button>
											<button
												onClick={() => setConfirmCancel(false)}
												className="text-[10px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] text-[#aaaaaa] hover:text-[#0d0d0d] transition-colors"
											>
												No
											</button>
										</div>
									) : (
										<button
											onClick={() => setConfirmCancel(true)}
											className="text-[10px] font-bold tracking-[1px] uppercase font-['Instrument_Sans'] text-[#d42b2b] border border-[#d42b2b] px-3 py-1.5 hover:bg-red-50 transition-colors"
										>
											Cancel Application
										</button>
									))}
							</div>
							<button
								onClick={handleCloseModal}
								className="text-sm font-['Instrument_Sans'] font-medium text-[#aaaaaa] hover:text-[#0d0d0d] transition-colors px-4 py-2"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</YouthLayout>
	);
}
