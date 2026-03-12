export const UserRole = {
	Youth: 0,
	Staff: 1,
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const ApplicationStatus = {
	Pending: 0,
	UnderReview: 1,
	Approved: 2,
	Rejected: 3,
} as const;
export type ApplicationStatus = (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

export const ProgramCategory = {
	Leadership: 0,
	Environment: 1,
	Sports: 2,
	ArtsAndCulture: 3,
	Livelihood: 4,
	MentalHealth: 5,
	Scholarship: 6,
} as const;
export type ProgramCategory = (typeof ProgramCategory)[keyof typeof ProgramCategory];

export const AnnouncementCategory = {
	New: 0,
	Event: 1,
	YORP: 2,
	Update: 3,
} as const;
export type AnnouncementCategory = (typeof AnnouncementCategory)[keyof typeof AnnouncementCategory];

export const Barangay = {
	Baclaran: 0,
	BanayBanay: 1,
	Banlic: 2,
	Bigaa: 3,
	Butong: 4,
	Casile: 5,
	Diezmo: 6,
	Gulod: 7,
	Mamatid: 8,
	Marinig: 9,
	Niugan: 10,
	Pittland: 11,
	PoblacionUno: 12,
	PoblacionDos: 13,
	PoblacionTres: 14,
	Pulo: 15,
	Sala: 16,
	SanIsidro: 17,
} as const;
export type Barangay = (typeof Barangay)[keyof typeof Barangay];

export const BARANGAY_LABELS: Record<Barangay, string> = {
	0: 'Baclaran',
	1: 'Banay-Banay',
	2: 'Banlic',
	3: 'Bigaa',
	4: 'Butong',
	5: 'Casile',
	6: 'Diezmo',
	7: 'Gulod',
	8: 'Mamatid',
	9: 'Marinig',
	10: 'Niugan',
	11: 'Pittland',
	12: 'Barangay Uno (Poblacion I)',
	13: 'Barangay Dos (Poblacion II)',
	14: 'Barangay Tres (Poblacion III)',
	15: 'Pulo',
	16: 'Sala',
	17: 'San Isidro',
};

export const PROGRAM_CATEGORY_LABELS: Record<ProgramCategory, string> = {
	0: 'Leadership',
	1: 'Environment',
	2: 'Sports',
	3: 'Arts & Culture',
	4: 'Livelihood',
	5: 'Mental Health',
	6: 'Scholarship',
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
	0: 'Pending',
	1: 'Under Review',
	2: 'Approved',
	3: 'Rejected',
};

export const ANNOUNCEMENT_CATEGORY_LABELS: Record<AnnouncementCategory, string> = {
	0: 'New',
	1: 'Event',
	2: 'YORP',
	3: 'Update',
};

export interface User {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	mobileNumber: string;
	dateOfBirth: string;
	barangay: Barangay;
	role: UserRole;
	createdAt: string;
}

export interface CydaoProgram {
	id: number;
	title: string;
	description: string;
	category: ProgramCategory;
	applicationDeadline: string;
	isOpen: boolean;
	createdAt: string;
}

export interface CydaoEvent {
	id: number;
	title: string;
	description: string;
	startDate: string;
	endDate: string;
	venue: string;
	availableSlots: number;
	isOpen: boolean;
	createdAt: string;
}

export interface Application {
	id: number;
	userId: number;
	user: User;
	programId: number;
	program: CydaoProgram;
	motivation: string;
	status: ApplicationStatus;
	createdAt: string;
}

export interface EventRegistration {
	id: number;
	userId: number;
	user: User;
	eventId: number;
	event: CydaoEvent;
	createdAt: string;
}

export interface Announcement {
	id: number;
	title: string;
	body: string;
	category: AnnouncementCategory;
	createdAt: string;
}

// DTOs
export interface LoginDto {
	email: string;
	password: string;
}

export interface RegisterDto {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	mobileNumber: string;
	dateOfBirth: string;
	barangay: Barangay;
}

export interface AuthResponse {
	token: string;
	user: User;
}

export interface CreateProgramDto {
	title: string;
	description: string;
	category: ProgramCategory;
	applicationDeadline: string;
	isOpen: boolean;
}

export interface CreateEventDto {
	title: string;
	description: string;
	startDate: string;
	endDate: string;
	venue: string;
	availableSlots: number;
	isOpen: boolean;
}

export interface CreateAnnouncementDto {
	title: string;
	body: string;
	category: AnnouncementCategory;
}

export interface ApplyToProgramDto {
	programId: number;
	motivation: string;
}
