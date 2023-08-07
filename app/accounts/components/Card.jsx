import { COLORS, formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import CardOptions from './card-options';
import Icon from '@/app/components/icon';
import { Badge } from '@/components/ui/badge';

const RULES = [
	'group-hover:shadow-color-100',
	'bg-color-300/[.4]',
	'text-color-700',
];

const COLOR_CLASES = COLORS.reduce((acc, color) => {
	const [container, circle, icon] = RULES.map(rule =>
		rule.replace('color', color),
	);

	acc[color] = {
		container,
		circle,
		icon,
	};

	return acc;
}, {});

export default function Item({ account, isPending, onEdit, onDelete }) {
	const canDelete = account.latest_movement === null;

	return (
		<div className="group relative w-[250px] cursor-pointer opacity-70 transition-all hover:opacity-100">
			<Link href={`/accounts/${account.id}`}>
				<div
					className={`drop-shadow-2xl" rounded-lg p-4 shadow-lg ${
						COLOR_CLASES[account.color].container
					}`}
				>
					<div className="flex items-center gap-2">
						<p className="text-md ">{account.name}</p>
						{account.main ? <Badge variant="secondary">main</Badge> : null}
					</div>
					<p className="text-xl font-semibold">
						{formatCurrency(account.balance, account.currencies.code)}
					</p>
					<p className="mt-2 text-xs font-light">
						{account.latest_movement
							? `Latest activity: ${formatDate(account.latest_movement)}`
							: 'No activity yet'}
					</p>
					<div
						className={`absolute right-4 top-4 ${
							COLOR_CLASES[account.color].circle
						} rounded-full p-3`}
					>
						<Icon
							icon={account.icon}
							className={`${COLOR_CLASES[account.color].icon}`}
						/>
					</div>
				</div>
			</Link>
			<CardOptions
				isPending={isPending}
				canDelete={canDelete}
				onEdit={onEdit}
				onDelete={onDelete}
			/>
		</div>
	);
}
