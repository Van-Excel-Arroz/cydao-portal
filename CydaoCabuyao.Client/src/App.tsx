import { Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';

import LandingPage from '@/pages/public/LandingPage';
import ProgramsPage from '@/pages/public/ProgramsPage';
import EventsPage from '@/pages/public/EventsPage';
import AnnouncementsPage from '@/pages/public/AnnouncementsPage';
import AboutPage from '@/pages/public/AboutPage';

import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

import DashboardPage from '@/pages/youth/DashboardPage';
import MyApplicationsPage from '@/pages/youth/MyApplicationsPage';
import MyRegistrationsPage from '@/pages/youth/MyRegistrationsPage';
import ProfilePage from '@/pages/youth/ProfilePage';

import AdminDashboardPage from '@/pages/staff/AdminDashboardPage';
import ManageProgramsPage from '@/pages/staff/ManageProgramsPage';
import ManageEventsPage from '@/pages/staff/ManageEventsPage';
import ManageApplicationsPage from '@/pages/staff/ManageApplicationsPage';
import ManageAnnouncementsPage from '@/pages/staff/ManageAnnouncementsPage';

import { UserRole } from '@/types';

function App() {
	return (
		<div className="min-h-screen flex flex-col bg-white">
			<Navbar />
			<main className="flex-1">
				<Routes>
					{/* Public routes */}
					<Route path="/" element={<LandingPage />} />
					<Route path="/programs" element={<ProgramsPage />} />
					<Route path="/events" element={<EventsPage />} />
					<Route path="/announcements" element={<AnnouncementsPage />} />
					<Route path="/about" element={<AboutPage />} />

					{/* Auth routes */}
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />

					{/* Youth routes */}
					<Route element={<ProtectedRoute allowedRole={UserRole.Youth} />}>
						<Route path="/dashboard" element={<DashboardPage />} />
						<Route path="/my-applications" element={<MyApplicationsPage />} />
						<Route path="/my-registrations" element={<MyRegistrationsPage />} />
						<Route path="/profile" element={<ProfilePage />} />
					</Route>

					{/* Staff routes */}
					<Route element={<ProtectedRoute allowedRole={UserRole.Staff} />}>
						<Route path="/admin" element={<AdminDashboardPage />} />
						<Route path="/admin/programs" element={<ManageProgramsPage />} />
						<Route path="/admin/events" element={<ManageEventsPage />} />
						<Route path="/admin/applications" element={<ManageApplicationsPage />} />
						<Route path="/admin/announcements" element={<ManageAnnouncementsPage />} />
					</Route>
				</Routes>
			</main>
			<Footer />
		</div>
	);
}

export default App;
