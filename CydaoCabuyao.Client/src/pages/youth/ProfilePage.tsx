import { useQuery } from '@tanstack/react-query';
import { YouthLayout } from '@/components/layout/YouthLayout';
import { BARANGAY_LABELS } from '@/types';
import type { User } from '@/types';
import api from '@/lib/api';

function formatDate(dateStr: string) {
	return new Date(dateStr).toLocaleDateString('en-PH', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

interface ProfileFieldProps {
	label: string;
	value: string;
}

function ProfileField({ label, value }: ProfileFieldProps) {
	return (
		<div className="border-b border-[#e0e0e0] py-4 flex items-start gap-8">
			<span className="text-[11px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-[#aaaaaa] w-36 shrink-0 pt-0.5">
				{label}
			</span>
			<span className="text-sm font-['Instrument_Sans'] font-medium text-[#0d0d0d]">{value}</span>
		</div>
	);
}

export default function ProfilePage() {
	const { data: user, isLoading, isError } = useQuery<User>({
		queryKey: ['me'],
		queryFn: () => api.get<User>('/users/me').then(r => r.data),
	});

	return (
		<YouthLayout title="My Profile">
			{isLoading && (
				<p className="text-sm font-['Instrument_Sans'] text-[#aaaaaa]">Loading profile...</p>
			)}

			{isError && (
				<p className="text-sm font-['Instrument_Sans'] text-[#d42b2b]">Failed to load profile. Please refresh.</p>
			)}

			{user && (
				<div className="max-w-2xl">
					{/* Identity block */}
					<div className="flex items-center gap-6 mb-10 pb-8 border-b-2 border-[#0d0d0d]">
						<div className="w-16 h-16 rounded-full bg-[#d42b2b] flex items-center justify-center shrink-0">
							<span className="text-xl font-bold text-white font-['Instrument_Sans']">
								{`${user.firstName[0]}${user.lastName[0]}`.toUpperCase()}
							</span>
						</div>
						<div>
							<h2 className="font-['Syne'] font-bold text-2xl text-[#0d0d0d] leading-tight">
								{user.firstName} {user.lastName}
							</h2>
							<span className="inline-block mt-1 text-[10px] font-bold tracking-[2px] uppercase font-['Instrument_Sans'] text-white bg-[#d42b2b] px-2 py-0.5">
								Youth Member
							</span>
						</div>
					</div>

					{/* Details */}
					<div className="flex flex-col">
						<ProfileField label="Email" value={user.email} />
						<ProfileField label="Mobile" value={user.mobileNumber} />
						<ProfileField label="Date of Birth" value={formatDate(user.dateOfBirth)} />
						<ProfileField label="Barangay" value={BARANGAY_LABELS[user.barangay]} />
						<ProfileField label="Member Since" value={formatDate(user.createdAt)} />
					</div>
				</div>
			)}
		</YouthLayout>
	);
}
