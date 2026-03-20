import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export default function NotFoundPage() {
	const { role } = useAuthStore();

	const homeHref = role === 'Youth' ? '/youth/profile' : role === 'Staff' ? '/admin/programs' : '/';

	return (
		<div className="min-h-screen bg-white flex items-center justify-center px-6">
			<div className="flex flex-col items-center text-center">
				<p className="text-[11px] font-bold tracking-[3px] uppercase text-[#aaaaaa] font-['Instrument_Sans'] mb-6">
					Error
				</p>
				<h1 className="font-['Syne'] font-extrabold text-[clamp(6rem,20vw,12rem)] leading-none text-[#e0e0e0] select-none">
					404
				</h1>
				<div className="w-12 h-0.5 bg-[#d42b2b] my-6" />
				<p className="font-['Syne'] font-bold text-2xl text-[#0d0d0d] mb-2">Page not found</p>
				<p className="text-sm text-[#aaaaaa] font-['Instrument_Sans'] mb-10 max-w-sm">
					The page you're looking for doesn't exist or has been moved.
				</p>
				<Link
					to={homeHref}
					className="inline-flex items-center gap-2 border border-[#0d0d0d] px-6 py-3 text-sm font-semibold font-['Instrument_Sans'] text-[#0d0d0d] hover:bg-[#0d0d0d] hover:text-white transition-colors"
				>
					<ArrowLeft size={14} />
					Go back home
				</Link>
			</div>
		</div>
	);
}
