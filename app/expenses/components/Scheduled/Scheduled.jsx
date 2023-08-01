'use client';
import { Check, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SwitchFilter from '@/app/components/SwitchFilter';
import List from './List';
import { useState } from 'react';
import Sheet from './Sheet';
import useMutation from '@/hooks/useMutation';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

export default function Scheduled({
	accounts,
	categories,
	schedules,
	page,
	size,
	count,
}) {
	const router = useRouter();
	const { toast } = useToast();
	const { mutate, isPending } = useMutation('scheduled', 'DELETE');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [scheduled, setScheduled] = useState(null);

	const handleCreate = () => {
		setIsModalOpen(true);
	};

	const handleEdit = scheduled => {
		setScheduled(scheduled);
		setIsModalOpen(true);
	};

	const handleDelete = scheduled => {
		const data = {
			scheduledId: scheduled.id,
		};
		mutate({
			data,
			onSuccess: () => {
				toast({
					title: (
						<div className="border-se flex items-center gap-2">
							<Check className="h-4 w-4" />
							Scheduled deleted successfully!
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
		setScheduled(null);
	};

	const data = schedules.map(s => ({
		...s,
		isPending,
		handleEdit,
		handleDelete,
	}));

	return (
		<>
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold">Scheduled</h2>
					<div className="flex gap-2">
						<SwitchFilter
							label="show inactive"
							paramKey="showInactiveScheduled"
						/>
						<Button onClick={handleCreate}>
							<span className="sr-only">Create scheduled expense</span>
							<Plus className="h-4 w-4" />
						</Button>
					</div>
				</div>
				<List data={data} count={count} page={page} size={size} />
			</div>
			{isModalOpen ? (
				<Sheet
					isOpen={isModalOpen}
					scheduled={scheduled}
					accounts={accounts}
					categories={categories}
					onClose={handleClose}
				/>
			) : null}
		</>
	);
}
