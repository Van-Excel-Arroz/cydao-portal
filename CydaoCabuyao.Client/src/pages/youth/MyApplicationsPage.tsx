import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { YouthLayout } from '@/components/layout/YouthLayout';
import { ProgramCategory } from '@/types';
import type { Application } from '@/types';
import { CategoryBadge, StatusBadge } from '@/components/shared/Badge';
import { Btn } from '@/components/shared/Btn';
import { DataTable, tableRowClass } from '@/components/shared/DataTable';
import { Modal, ModalCover, ModalHeader, ModalBody, ModalFooter } from '@/components/shared/Modal';
import api from '@/lib/api';

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
	const { data: applications = [], isLoading } = useQuery({
		queryKey: ['my-applications'],
		queryFn: () => api.get<Application[]>('/applications/user').then(r => r.data),
	});

	const [selectedApp, setSelectedApp] = useState<Application | null>(null);

	function handleCloseModal() {
		setSelectedApp(null);
	}

	return (
		<YouthLayout title="My Applications" noScroll>
			<div className="flex flex-col h-full min-h-0">
				<DataTable
					columns={[...COLS]}
					colsClass="grid-cols-[2fr_1fr_1fr_1fr]"
					empty={!isLoading && applications.length === 0}
					emptyMessage="You have not submitted any applications yet."
					footer={isLoading ? 'Loading...' : `${applications.length} application${applications.length !== 1 ? 's' : ''}`}
				>
					{applications.map((app, i) => (
						<button
							key={app.id}
							onClick={() => setSelectedApp(app)}
							className={`w-full text-left grid grid-cols-[2fr_1fr_1fr_1fr] hover:bg-[#fafafa] transition-colors cursor-pointer ${tableRowClass(i)}`}
						>
							<div className="px-5 py-3.5">
								<p className="text-sm font-semibold text-[#0d0d0d] font-['Instrument_Sans'] leading-tight">
									{app.program.title}
								</p>
							</div>
							<div className="px-5 py-3.5 flex items-center justify-center">
								<CategoryBadge category={app.program.category} />
							</div>
							<div className="px-5 py-3.5 flex items-center justify-center">
								<p className="text-sm text-[#0d0d0d] font-['Instrument_Sans']">{formatDate(app.createdAt)}</p>
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
							src={categoryImage[selectedApp.program.category]}
							alt={selectedApp.program.title}
							onClose={handleCloseModal}
						>
							<CategoryBadge category={selectedApp.program.category} />
							<StatusBadge status={selectedApp.status} />
						</ModalCover>

						<ModalHeader title={selectedApp.program.title}>
							<p className="text-xs text-[#aaaaaa] font-['Instrument_Sans'] mt-1">
								Submitted {formatDate(selectedApp.createdAt)}
							</p>
						</ModalHeader>

						<ModalBody>
							<p className="text-[11px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-[#aaaaaa] mb-3">
								About this Program
							</p>
							<p className="text-sm font-['Instrument_Sans'] text-[#0d0d0d] leading-relaxed">
								{selectedApp.program.description}
							</p>
						</ModalBody>

						<ModalFooter>
							<div />
							<Btn variant="ghost" onClick={handleCloseModal} className="px-4 py-2 text-sm">Close</Btn>
						</ModalFooter>
					</>
				)}
			</Modal>
		</YouthLayout>
	);
}
