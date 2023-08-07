'use client';
import { useState } from 'react';
import Card from './card';
import Sheet from './sheet';
import useMutation from '@/hooks/useMutation';
import { Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

export default function Account({ account, currencies }) {
	const router = useRouter();
	const { toast } = useToast();
	const [isOpen, setIsOpen] = useState(false);
	const { mutate, isPending } = useMutation(
		'accounts',
		'DELETE',
	);

	const handleEdit = () => {
		setIsOpen(true);
	};

	const handleClose = () => {
		setIsOpen(false);
	};

	const handleDelete = () => {
		const data = {
			accountId: account.id
		}
		mutate({
			data,
			onSuccess: () => {
				toast({
					title: (
						<div className="border-se flex items-center gap-2">
							<Check className="h-4 w-4" />
							Movement deleted successfully!
						</div>
					),
					variant: 'success',
				});
				handleClose();
				router.refresh();
			},
			onError: e => {
				toast({
					title: (
						<div className="border-se flex items-center gap-2">
							<X className="h-4 w-4" />
							Oops, there's been an error!
						</div>
					),
					variant: 'error',
				});
			},
		});
	};

	return (
		<>
			<Card
				account={account}
				isPending={isPending}
				onEdit={handleEdit}
				onDelete={handleDelete}
			/>
			{isOpen ? (
				<Sheet
					isOpen={isOpen}
					account={account}
					currencies={currencies}
					onClose={handleClose}
				/>
			) : null}
		</>
	);
}
