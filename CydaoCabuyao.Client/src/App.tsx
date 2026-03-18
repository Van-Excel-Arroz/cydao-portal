import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { ScrollToTop } from '@/components/shared/ScrollToTop';

import LandingPage from '@/pages/public/LandingPage';
import ProgramsPage from '@/pages/public/ProgramsPage';
import EventsPage from '@/pages/public/EventsPage';
import AnnouncementsPage from '@/pages/public/AnnouncementsPage';
import AboutPage from '@/pages/public/AboutPage';

import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

import YouthProgramsPage from '@/pages/youth/YouthProgramsPage';
import YouthEventsPage from '@/pages/youth/YouthEventsPage';
import MyApplicationsPage from '@/pages/youth/MyApplicationsPage';
import MyRegistrationsPage from '@/pages/youth/MyRegistrationsPage';
import ProfilePage from '@/pages/youth/ProfilePage';

import ManageProgramsPage from '@/pages/staff/ManageProgramsPage';
import ManageEventsPage from '@/pages/staff/ManageEventsPage';
import ManageAnnouncementsPage from '@/pages/staff/ManageAnnouncementsPage';

function App() {
	return (
		<>
			<ScrollToTop />
			<Routes>
				{/* Public routes — wrapped with Navbar and Footer */}
				<Route element={<PublicLayout />}>
					<Route path="/" element={<LandingPage />} />
					<Route path="/programs" element={<ProgramsPage />} />
					<Route path="/events" element={<EventsPage />} />
					<Route path="/announcements" element={<AnnouncementsPage />} />
					<Route path="/about" element={<AboutPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
				</Route>

				{/* Youth routes */}
				<Route element={<ProtectedRoute allowedRole="Youth" />}>
					<Route path="/youth/profile" element={<ProfilePage />} />
					<Route path="/youth/programs" element={<YouthProgramsPage />} />
					<Route path="/youth/events" element={<YouthEventsPage />} />
					<Route path="/youth/my-applications" element={<MyApplicationsPage />} />
					<Route path="/youth/my-registrations" element={<MyRegistrationsPage />} />
				</Route>

				{/* Staff routes */}
				<Route element={<ProtectedRoute allowedRole="Staff" />}>
					<Route path="/admin/programs" element={<ManageProgramsPage />} />
					<Route path="/admin/events" element={<ManageEventsPage />} />
					<Route path="/admin/announcements" element={<ManageAnnouncementsPage />} />
				</Route>
			</Routes>
		</>
	);
}

export default App;
