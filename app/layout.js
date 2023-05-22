import './globals.css';
import { Inter } from 'next/font/google';
import SupabaseListener from '@/components/providers/supabase-listener';
import SupabaseProvider from '@/components/providers/supabase-provider';
import { createServerClient } from '@/lib/supabase-server';
import Navbar from '@/app/components/Navbar';
import { Toaster } from '@/components/ui/toaster';

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
			<body className={`${inter.className} h-full text-gray-700`}>
				<SupabaseProvider session={session}>
					<SupabaseListener serverAccessToken={session?.access_token} />
					<div className="flex h-full">
						{session ? <Navbar /> : null}
						<main className={`w-full ${session ? 'p-8' : ''}`}>{children}</main>
					</div>
				</SupabaseProvider>
				<Toaster />
			</body>
		</html>
	);
}
