'use client';
import { useState, useTransition } from 'react';
import Card from './Card';
import Sheet from './Sheet';
// import { deleteAction } from "../actions";

export default function Account({ account }) {
	const [isOpen, setIsOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const handleEdit = () => {
		setIsOpen(true);
	};

	const handleSheet = state => {
		setIsOpen(state);
	};

	const handleDelete = () => {
		// startTransition(() => deleteAction(account.id));
	};

	return (
		<>
			<Card
				account={account}
				isPending={isPending}
				onEdit={handleEdit}
				onDelete={handleDelete}
			/>
			<Sheet isOpen={isOpen} onOpenChange={handleSheet} account={account} />
		</>
	);
}
