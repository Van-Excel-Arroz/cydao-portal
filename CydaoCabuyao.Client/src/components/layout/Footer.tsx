import { Link } from 'react-router-dom';
import { Facebook, Phone, Mail, MapPin } from 'lucide-react';
import logo from '@/assets/images/logo.svg';

export function Footer() {
	return (
		<footer className="bg-white border-t border-[#e0e0e0]">
			{/* Main footer grid */}
			<div className="max-w-7xl mx-auto px-6 py-14">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

					{/* Brand — spans 2 cols on lg */}
					<div className="lg:col-span-2">
						<Link to="/" className="inline-block mb-4">
							<img src={logo} alt="CYDAO Cabuyao" className="h-28 w-auto" />
						</Link>
						<p className="text-sm text-[#555] leading-relaxed mb-6 max-w-xs">
							City Youth Development Affairs Office — empowering Cabuyao's youth through
							programs, leadership, and community engagement.
						</p>

						{/* Facebook */}
						<a
							href="https://www.facebook.com/BagongCYDAO/"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2.5 border border-[#e0e0e0] px-4 py-2 text-sm font-['Instrument_Sans'] font-medium text-[#0d0d0d] hover:border-[#d42b2b] hover:text-[#d42b2b] transition-colors"
						>
							<Facebook size={15} />
							Follow us on Facebook
						</a>
					</div>

					{/* Portal */}
					<div>
						<p className="text-[11px] font-bold tracking-[2px] uppercase mb-5 text-[#0d0d0d]">
							Portal
						</p>
						<ul className="space-y-3">
							{[
								{ to: '/programs', label: 'Programs' },
								{ to: '/events', label: 'Events' },
								{ to: '/announcements', label: 'Announcements' },
								{ to: '/login', label: 'Login' },
								{ to: '/register', label: 'Register' },
							].map(({ to, label }) => (
								<li key={to}>
									<Link
										to={to}
										className="text-sm text-[#555] hover:text-[#d42b2b] transition-colors font-['Instrument_Sans']"
									>
										{label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Contact */}
					<div>
						<p className="text-[11px] font-bold tracking-[2px] uppercase mb-5 text-[#0d0d0d]">
							Contact
						</p>
						<ul className="space-y-4">
							<li>
								<a
									href="tel:+96728120150"
									className="flex items-start gap-2.5 text-sm text-[#555] hover:text-[#d42b2b] transition-colors font-['Instrument_Sans']"
								>
									<Phone size={14} className="mt-0.5 shrink-0" />
									+9672 812 015
								</a>
							</li>
							<li>
								<a
									href="mailto:cysdo2023@gmail.com"
									className="flex items-start gap-2.5 text-sm text-[#555] hover:text-[#d42b2b] transition-colors font-['Instrument_Sans']"
								>
									<Mail size={14} className="mt-0.5 shrink-0" />
									cysdo2023@gmail.com
								</a>
							</li>
							<li>
								<div className="flex items-start gap-2.5 text-sm text-[#555] font-['Instrument_Sans']">
									<MapPin size={14} className="mt-0.5 shrink-0 text-[#d42b2b]" />
									<span>
										Cabuyao Town Plaza,
										<br />
										Cabuyao, Philippines 4025
									</span>
								</div>
							</li>
						</ul>
					</div>

					{/* Legal */}
					<div>
						<p className="text-[11px] font-bold tracking-[2px] uppercase mb-5 text-[#0d0d0d]">
							Legal
						</p>
						<ul className="space-y-3">
							{[
								{ to: '/about', label: 'About Us' },
								{ to: '/privacy-policy', label: 'Privacy Policy' },
								{ to: '/terms-of-service', label: 'Terms of Service' },
							].map(({ to, label }) => (
								<li key={to}>
									<Link
										to={to}
										className="text-sm text-[#555] hover:text-[#d42b2b] transition-colors font-['Instrument_Sans']"
									>
										{label}
									</Link>
								</li>
							))}
						</ul>

						<div className="mt-8 pt-6 border-t border-[#e0e0e0]">
							<p className="text-[10px] uppercase tracking-[2px] text-[#aaa] mb-1 font-['Instrument_Sans']">
								YORP Accredited
							</p>
							<p className="text-xs text-[#aaa] font-['Instrument_Sans']">
								Registered under the Youth Organizations Registration Program
							</p>
						</div>
					</div>

				</div>
			</div>

			{/* Bottom bar */}
			<div className="border-t border-[#e0e0e0]">
				<div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
					<p className="text-xs text-[#aaa] font-['Instrument_Sans']">
						&copy; {new Date().getFullYear()} CYDAO Cabuyao. All rights reserved.
					</p>
					<div className="flex items-center gap-5">
						<Link
							to="/privacy-policy"
							className="text-xs text-[#aaa] hover:text-[#d42b2b] transition-colors font-['Instrument_Sans']"
						>
							Privacy Policy
						</Link>
						<span className="text-[#e0e0e0]">|</span>
						<Link
							to="/terms-of-service"
							className="text-xs text-[#aaa] hover:text-[#d42b2b] transition-colors font-['Instrument_Sans']"
						>
							Terms of Service
						</Link>
						<span className="text-[#e0e0e0]">|</span>
						<p className="text-xs text-[#aaa] font-['Instrument_Sans']">
							City of Cabuyao, Laguna, Philippines
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
