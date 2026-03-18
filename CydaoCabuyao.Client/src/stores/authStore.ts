import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthResponse } from '@/types';

interface AuthStore {
	token: string | null;
	userId: number | null;
	fullName: string | null;
	role: string | null;
	setAuth: (response: AuthResponse) => void;
	clearAuth: () => void;
	isStaff: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
	persist(
		(set, get) => ({
			token: null,
			userId: null,
			fullName: null,
			role: null,
			setAuth: (response) =>
				set({
					token: response.token,
					userId: response.userId,
					fullName: response.fullName,
					role: response.role,
				}),
			clearAuth: () => set({ token: null, userId: null, fullName: null, role: null }),
			isStaff: () => get().role === 'Staff',
		}),
		{
			name: 'cydao-auth',
		}
	)
);
