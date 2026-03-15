import { create } from 'zustand';

export interface StoredRegistration {
	id: number;
	eventId: number;
	eventTitle: string;
	eventDescription: string;
	startDate: string;
	endDate: string;
	venue: string;
	availableSlots: number;
	registeredAt: string;
}

interface RegistrationsStore {
	registrations: StoredRegistration[];
	addRegistration: (reg: Omit<StoredRegistration, 'id' | 'registeredAt'>) => void;
	cancelRegistration: (id: number) => void;
}

const initialRegistrations: StoredRegistration[] = [
	{
		id: 1,
		eventId: 1,
		eventTitle: 'Kabataan Leadership Summit 2026',
		eventDescription:
			'A two-day summit gathering youth leaders from all 18 barangays to discuss governance, advocacy, and community action plans. Participants will work in barangay clusters to draft local youth development proposals, which will be presented to CYDAO staff and city officials on the final day.',
		startDate: '2026-04-10T08:00:00Z',
		endDate: '2026-04-12T17:00:00Z',
		venue: 'Cabuyao City Hall Auditorium',
		availableSlots: 80,
		registeredAt: '2026-03-02T09:00:00Z',
	},
	{
		id: 2,
		eventId: 5,
		eventTitle: 'Livelihood Skills Training Fair',
		eventDescription:
			'A two-day fair featuring TESDA-accredited training booths, livelihood exhibits, and on-the-spot enrollment for free skills programs. Participants may visit all booths and receive certificates of attendance. Skills covered include cooking, welding, dressmaking, and basic electronics repair.',
		startDate: '2026-05-17T09:00:00Z',
		endDate: '2026-05-18T17:00:00Z',
		venue: 'Cabuyao Sports Complex',
		availableSlots: 200,
		registeredAt: '2026-03-06T14:30:00Z',
	},
	{
		id: 3,
		eventId: 6,
		eventTitle: 'Kabataang Artista: Arts Festival',
		eventDescription:
			'An inter-barangay arts showcase featuring visual art, spoken word, dance, and live music performances celebrating Cabuyao youth talent. Registered participants may join as performers or volunteers. All performers must submit their entry form and materials to CYDAO at least two weeks before the event.',
		startDate: '2026-05-24T08:00:00Z',
		endDate: '2026-05-25T20:00:00Z',
		venue: 'Cabuyao Town Plaza',
		availableSlots: 500,
		registeredAt: '2026-03-10T11:00:00Z',
	},
];

export const useRegistrationsStore = create<RegistrationsStore>(set => ({
	registrations: initialRegistrations,
	addRegistration: reg =>
		set(state => ({
			registrations: [
				{
					...reg,
					id: Date.now(),
					registeredAt: new Date().toISOString(),
				},
				...state.registrations,
			],
		})),
	cancelRegistration: id =>
		set(state => ({
			registrations: state.registrations.filter(r => r.id !== id),
		})),
}));
