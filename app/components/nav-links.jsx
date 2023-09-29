'use client';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { BarChart2, Banknote, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname, useSelectedLayoutSegment } from 'next/navigation';
import { useState } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';

const ROUTES = [
	{ path: '/', icon: BarChart2, title: 'Dashboard' },
	{
		path: '/accounts',
		icon: Banknote,
		title: 'Accounts',
	},
	{
		path: '/expenses',
		icon: CreditCard,
		title: 'Expenses',
	},
];

function Routes({ onClick = () => {} }) {
	const pathname = usePathname();
	const segment = useSelectedLayoutSegment();

	return ROUTES.map(({ path, icon: Icon, title }) => (
		<div
			key={path}
			className="group relative w-full text-gray-700 transition-all hover:bg-green-100"
		>
			<Link
				href={path}
				className="flex w-full justify-center py-3"
				title={title}
				onClick={onClick}
			>
				<Icon className="group-active:translate-y-[1px]" />
			</Link>
			<div
				className={`absolute -right-[2px] top-0 h-full w-[2px] transition-all group-hover:bg-green-700 ${
					path === pathname || path === `/${segment}`
						? 'lg:bg-green-700'
						: 'lg:bg-transparent'
				}`}
			/>
		</div>
	));
}

function MobileNav({ user }) {
	const [isOpen, setIsOpen] = useState(false);

	const handleToggle = () => {
		setIsOpen(value => !value);
	};

	const handleNavigation = () => {
		setIsOpen(false);
	};

	return (
		<div className="lg:hidden">
			<Button variant="ghost" onClick={handleToggle}>
				<Menu className="h-4 w-4" />
			</Button>

			<Sheet open={isOpen} onOpenChange={handleToggle}>
				<SheetContent size="full">
					<div className="flex flex-col justify-center h-full relative">
						<Routes onClick={handleNavigation} />
						<div className="absolute bottom-4 flex justify-center w-full">
							<UserAvatar user={user} />
						</div>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
}

const UserAvatar = ({ user }) => {
	return (
		<Image
			width={64}
			height={64}
			className="rounded-full"
			src={user.avatar}
			alt="user profile"
		/>
	);
};

function DesktopNav({ user }) {
	return (
		<>
			<div className="hidden lg:block w-full">
				<Routes />
			</div>
			<div className="hidden lg:block mb-8">
				<UserAvatar user={user} />
			</div>
		</>
	);
}

export default function Links({ user }) {
	return (
		<>
			<MobileNav user={user} />
			<DesktopNav user={user} />
		</>
	);
}
