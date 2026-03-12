import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
	allowedRole: UserRole;
}

export function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
	const { user, token } = useAuthStore();

	if (!token || !user) {
		return <Navigate to="/login" replace />;
	}

	if (user.role !== allowedRole) {
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
}
