import { createServerClient } from '@/lib/supabase-server';
import { toDataURL } from '@/lib/utils';
import NavLinks from './nav-links';
import Logo from './logo';

const getUser = async () => {
	const supabase = createServerClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();
	const { data: profile } = await supabase
		.from('profiles')
		.select()
		.eq('id', user.id)
		.limit(1)
		.single();
	const { data: blob } = await supabase.storage
		.from('avatars')
		.download(profile.avatar_url);
	const avatar = await toDataURL(blob);

	return { ...user, ...profile, avatar };
};

export default async function Navbar() {
	const user = await getUser();

	return (
		<nav className="min-w-[80px] lg:basis-20 lg:border-r-2 lg:border-gray-300">
			<div className="flex p-4 lg:p-0 lg:h-full lg:flex-col items-center justify-between">
				<Logo />

				<NavLinks user={user} />
			</div>
		</nav>
	);
}
