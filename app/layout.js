import './globals.css';
import { Inter } from 'next/font/google';
import SupabaseListener from '@/components/providers/supabase-listener';
import SupabaseProvider from '@/components/providers/supabase-provider';
import { createServerClient } from '@/lib/supabase-server';
import { Toaster } from '@/components/ui/toaster';
import Navbar from './components/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'Tracker',
};

export default async function RootLayout({ children }) {
	const supabase = createServerClient();

	const {
		data: { session },
	} = await supabase.auth.getSession();

	return (
		<html lang="en" className="h-full">
			<body
				className={`${inter.className} h-full overflow-hidden text-gray-700`}
			>
				<SupabaseProvider session={session}>
					<SupabaseListener serverAccessToken={session?.access_token} />
					<div className="flex h-full flex-col lg:flex-row overflow-hidden relative">
						{session ? <Navbar /> : null}
						<main
							className={`w-full h-full ${
								session ? 'p-4 lg:p-8' : ''
							} overflow-y-auto`}
						>
							{children}
						</main>
					</div>
				</SupabaseProvider>
				<Toaster />
			</body>
		</html>
	);
}
