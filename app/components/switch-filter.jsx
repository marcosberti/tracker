'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function SwitchFilter({ label, paramKey }) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();

	const checked = searchParams.get(paramKey);

	const handleChange = value => {
		const params = new URLSearchParams(searchParams);

		if (value) {
			params.append(paramKey, value);
		} else {
			params.delete(paramKey);
		}

		const urlParams = params.toString();
		let path = pathname;
		if (urlParams) path = `${path}?${urlParams}`;

		router.push(path);
	};

	return (
		<div className="flex items-center space-x-2">
			<Label>{label}</Label>
			<Switch checked={checked} onCheckedChange={handleChange} />
		</div>
	);
}
