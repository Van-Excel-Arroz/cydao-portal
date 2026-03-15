import { create } from 'zustand';
import { ApplicationStatus, ProgramCategory } from '@/types';

export interface StoredApplication {
	id: number;
	programId: number;
	programTitle: string;
	programCategory: ProgramCategory;
	programDescription: string;
	status: ApplicationStatus;
	submittedAt: string;
}

interface ApplicationsStore {
	applications: StoredApplication[];
	addApplication: (app: Omit<StoredApplication, 'id' | 'status' | 'submittedAt'>) => void;
	cancelApplication: (id: number) => void;
}

const initialApplications: StoredApplication[] = [
	{
		id: 1,
		programId: 1,
		programTitle: 'Leadership Development Program',
		programCategory: ProgramCategory.Leadership,
		programDescription:
			'A structured program designed to cultivate leadership skills, civic responsibility, and community awareness among Cabuyao youth aged 15–30. Participants undergo workshops on public speaking, community organizing, project management, and ethical leadership, culminating in a barangay-level capstone project.',
		status: ApplicationStatus.Approved,
		submittedAt: '2026-03-01T10:00:00Z',
	},
	{
		id: 2,
		programId: 2,
		programTitle: 'Environmental Youth Camp',
		programCategory: ProgramCategory.Environment,
		programDescription:
			"A multi-day immersive camp focused on environmental stewardship, sustainability practices, and ecological awareness across Cabuyao's watersheds and barangays. Participants join cleanup drives, tree-planting activities, and attend sessions on solid waste management and climate action.",
		status: ApplicationStatus.UnderReview,
		submittedAt: '2026-03-05T08:00:00Z',
	},
	{
		id: 3,
		programId: 4,
		programTitle: 'Arts & Culture Workshop Series',
		programCategory: ProgramCategory.ArtsAndCulture,
		programDescription:
			"A series of workshops covering visual arts, traditional dance, music production, and digital media — celebrating Cabuyao's cultural heritage. The program runs over eight weekends and culminates in a showcase at the annual CYDAO Cultural Festival at Cabuyao City Plaza.",
		status: ApplicationStatus.Pending,
		submittedAt: '2026-03-08T11:00:00Z',
	},
];

export const useApplicationsStore = create<ApplicationsStore>(set => ({
	applications: initialApplications,
	addApplication: app =>
		set(state => ({
			applications: [
				{
					...app,
					id: Date.now(),
					status: ApplicationStatus.Pending,
					submittedAt: new Date().toISOString(),
				},
				...state.applications,
			],
		})),
	cancelApplication: id =>
		set(state => ({
			applications: state.applications.filter(a => a.id !== id),
		})),
}));
