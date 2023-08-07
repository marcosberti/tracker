'use client';
import { Check, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SwitchFilter from '@/app/components/switch-filter';
import List from './list';
import { useState } from 'react';
import Sheet from './sheet';
import useMutation from '@/hooks/useMutation';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

export default function Installments({
	accounts,
	categories,
	installments,
	page,
	size,
	count,
}) {
	const router = useRouter();
	const { toast } = useToast();
	const { mutate, isPending } = useMutation('installments', 'DELETE');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [installment, setInstallment] = useState(null);

	const handleCreate = () => {
		setIsModalOpen(true);
	};

	const handleEdit = installment => {
		setInstallment(installment);
		setIsModalOpen(true);
	};

	const handleDelete = installment => {
		const data = {
			installmentId: installment.id,
		};
		mutate({
			data,
			onSuccess: () => {
				toast({
					title: (
						<div className="border-se flex items-center gap-2">
							<Check className="h-4 w-4" />
							Installment deleted successfully!
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

	const handleClose = () => {
		setIsModalOpen(false);
		setInstallment(null);
	};

	const data = installments.map(i => ({
		...i,
		isPending,
		handleEdit,
		handleDelete,
	}));

	return (
		<>
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold">Installments</h2>
					<div className="flex gap-2">
						<SwitchFilter
							label="show inactive"
							paramKey="showInactiveInstallments"
						/>
						<Button onClick={handleCreate}>
							<span className="sr-only">Create installment expense</span>
							<Plus className="h-4 w-4" />
						</Button>
					</div>
				</div>
				<List data={data} count={count} page={page} size={size} />
			</div>
			{isModalOpen ? (
				<Sheet
					isOpen={isModalOpen}
					installment={installment}
					accounts={accounts}
					categories={categories}
					onClose={handleClose}
				/>
			) : null}
		</>
	);
}
