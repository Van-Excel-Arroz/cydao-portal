import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
	allowedRole: 'Youth' | 'Staff';
}

export function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
	const { token, role } = useAuthStore();

	if (!token || !role) {
		return <Navigate to="/login" replace />;
	}

	if (role !== allowedRole) {
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
}
