'use client';
import { useState } from 'react';
import Sheet from './Sheet';
import List from './List';
import useMutation from '@/hooks/useMutation';
import { useToast } from '@/components/ui/use-toast';
import { Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const MODALS = {
	edit: 'edit',
	delete: 'delete',
};

const INITIAL_STATE = {
	modal: null,
	movement: null,
};

export default function Movements({ data, account, currencies, categories }) {
	const router = useRouter();
	const { toast } = useToast();
	const { mutate, isPending } = useMutation('movements', 'DELETE');
	const [state, setState] = useState(INITIAL_STATE);

	const handleEdit = movement => {
		setState({ modal: MODALS.edit, movement });
	};

	const handleDelete = movement => {
		const data = {
			accountId: account.id,
			movementId: movement.id,
		};
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

	const handleClose = () => {
		setState(INITIAL_STATE);
	};

	const _data = data.map(m => ({
		...m,
		isPending,
		handleEdit,
		handleDelete,
	}));

	return (
		<>
			<div className="rounded-md border">
				<List data={_data} />
			</div>
			{state.modal === MODALS.edit ? (
				<Sheet
					isOpen
					account={account}
					movement={state.movement}
					currencies={currencies}
					categories={categories}
					onClose={handleClose}
				/>
			) : null}
		</>
	);
}
