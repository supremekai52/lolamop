import { KolamPlatform } from '@/components/KolamPlatform';
import { Suspense } from 'react';

export default function Home() {
	return (
		<div className="min-h-screen bg-gray-50">
			<Suspense fallback={
				<div className="flex items-center justify-center min-h-screen">
					<div className="text-lg">Loading Zen Kolam platform...</div>
				</div>
			}>
				<KolamPlatform />
			</Suspense>
		</div>
	);
}
