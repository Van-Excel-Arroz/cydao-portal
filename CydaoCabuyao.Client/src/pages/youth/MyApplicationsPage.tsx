import { useState } from 'react';
import { YouthLayout } from '@/components/layout/YouthLayout';
import { ApplicationStatus, ProgramCategory } from '@/types';
import { useApplicationsStore } from '@/stores/applicationsStore';
import type { StoredApplication } from '@/stores/applicationsStore';
import { CategoryBadge, StatusBadge } from '@/components/shared/Badge';
import { Btn } from '@/components/shared/Btn';
import { DataTable, tableRowClass } from '@/components/shared/DataTable';
import { Modal, ModalCover, ModalHeader, ModalBody, ModalFooter } from '@/components/shared/Modal';

const categoryImage: Record<ProgramCategory, string> = {
	[ProgramCategory.Leadership]: 'https://picsum.photos/seed/prog-leadership/800/300',
	[ProgramCategory.Environment]: 'https://picsum.photos/seed/prog-environment/800/300',
	[ProgramCategory.Sports]: 'https://picsum.photos/seed/prog-sports/800/300',
	[ProgramCategory.ArtsAndCulture]: 'https://picsum.photos/seed/prog-arts/800/300',
	[ProgramCategory.Livelihood]: 'https://picsum.photos/seed/prog-livelihood/800/300',
	[ProgramCategory.MentalHealth]: 'https://picsum.photos/seed/prog-mentalhealth/800/300',
	[ProgramCategory.Scholarship]: 'https://picsum.photos/seed/prog-scholarship/800/300',
};

function formatDate(dateStr: string) {
	return new Date(dateStr).toLocaleDateString('en-PH', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
}

const COLS = [
	{ label: 'Program' },
	{ label: 'Category', center: true },
	{ label: 'Submitted', center: true },
	{ label: 'Status', center: true },
] as const;

export default function MyApplicationsPage() {
	const { applications, cancelApplication } = useApplicationsStore();
	const [selectedApp, setSelectedApp] = useState<StoredApplication | null>(null);
	const [confirmCancel, setConfirmCancel] = useState(false);

	function handleCancel() {
		if (!selectedApp) return;
		cancelApplication(selectedApp.id);
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
				<DataTable
					columns={[...COLS]}
					colsClass="grid-cols-[2fr_1fr_1fr_1fr]"
					empty={applications.length === 0}
					emptyMessage="You have not submitted any applications yet."
					footer={`${applications.length} application${applications.length !== 1 ? 's' : ''}`}
				>
					{applications.map((app, i) => (
						<button
							key={app.id}
							onClick={() => { setSelectedApp(app); setConfirmCancel(false); }}
							className={`w-full text-left grid grid-cols-[2fr_1fr_1fr_1fr] hover:bg-[#fafafa] transition-colors cursor-pointer ${tableRowClass(i)}`}
						>
							<div className="px-5 py-3.5">
								<p className="text-sm font-semibold text-[#0d0d0d] font-['Instrument_Sans'] leading-tight">
									{app.programTitle}
								</p>
							</div>
							<div className="px-5 py-3.5 flex items-center justify-center">
								<CategoryBadge category={app.programCategory} />
							</div>
							<div className="px-5 py-3.5 flex items-center justify-center">
								<p className="text-sm text-[#0d0d0d] font-['Instrument_Sans']">{formatDate(app.submittedAt)}</p>
							</div>
							<div className="px-5 py-3.5 flex items-center justify-center">
								<StatusBadge status={app.status} />
							</div>
						</button>
					))}
				</DataTable>
			</div>

			{/* Detail modal */}
			<Modal open={!!selectedApp} onClose={handleCloseModal}>
				{selectedApp && (
					<>
						<ModalCover
							src={categoryImage[selectedApp.programCategory]}
							alt={selectedApp.programTitle}
							onClose={handleCloseModal}
						>
							<CategoryBadge category={selectedApp.programCategory} />
							<StatusBadge status={selectedApp.status} />
						</ModalCover>

						<ModalHeader title={selectedApp.programTitle}>
							<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans'] mt-1">
								Submitted {formatDate(selectedApp.submittedAt)}
							</p>
						</ModalHeader>

						<ModalBody>
							<p className="text-[11px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-[#aaaaaa] mb-3">
								About this Program
							</p>
							<p className="text-sm font-['Instrument_Sans'] text-[#0d0d0d] leading-relaxed">
								{selectedApp.programDescription}
							</p>
						</ModalBody>

						<ModalFooter>
							<div>
								{selectedApp.status === ApplicationStatus.Pending &&
									(confirmCancel ? (
										<div className="flex items-center gap-3">
											<p className="text-xs text-[#0d0d0d] font-['Instrument_Sans']">Cancel this application?</p>
											<Btn variant="danger" size="sm" onClick={handleCancel}>Yes, Cancel</Btn>
											<Btn variant="ghost" size="sm" onClick={() => setConfirmCancel(false)}>No</Btn>
										</div>
									) : (
										<Btn variant="danger-outline" size="sm" onClick={() => setConfirmCancel(true)}>
											Cancel Application
										</Btn>
									))}
							</div>
							<Btn variant="ghost" onClick={handleCloseModal} className="px-4 py-2 text-sm">Close</Btn>
						</ModalFooter>
					</>
				)}
			</Modal>
		</YouthLayout>
	);
}
