'use client';
import { useState } from 'react';
import useMutation from '@/hooks/useMutation';
import { useToast } from '@/components/ui/use-toast';
import { Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import List from './list';
import MovementSheet from './movement-sheet';
import InstallmentSheet from './installment-sheet';
import ScheduledSheet from './scheduled-sheet';

const MODALS = {
	EDIT: 'edit',
	INSTALLMENT: 'installment',
	SCHEDULED: 'scheduled',
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
		setState({ modal: MODALS.EDIT, movement });
	};

	const handlePayment = item => {
		const modal = item.isInstallment ? MODALS.INSTALLMENT : MODALS.SCHEDULED;
		const key = item.isInstallment ? 'installment' : 'scheduled';

		setState({ modal, [key]: item });
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

	return (
		<>
			<div className="h-[calc(100vh-288px-4rem)] overflow-y-auto">
				<List
					isPending={isPending}
					data={data}
					accountCurrency={account.currencies}
					onPayment={handlePayment}
					onEdit={handleEdit}
					onDelete={handleDelete}
				/>
			</div>
			{state.modal === MODALS.EDIT ? (
				<MovementSheet
					isOpen
					account={account}
					movement={state.movement}
					movements={data}
					currencies={currencies}
					categories={categories}
					onClose={handleClose}
				/>
			) : null}
			{state.modal === MODALS.INSTALLMENT ? (
				<InstallmentSheet
					isOpen
					account={account}
					installment={state.installment}
					movements={data}
					currencies={currencies}
					onClose={handleClose}
				/>
			) : null}
			{state.modal === MODALS.SCHEDULED ? (
				<ScheduledSheet
					isOpen
					account={account}
					scheduled={state.scheduled}
					movements={data}
					currencies={currencies}
					onClose={handleClose}
				/>
			) : null}
		</>
	);
}
