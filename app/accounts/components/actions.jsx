'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Sheet from './sheet';

export default function Actions({ currencies }) {
	const [isModalOpen, setIsModalOpen] = React.useState(false);

	const handleCreate = () => {
		setIsModalOpen(true);
	};

	const handleClose = () => {
		setIsModalOpen(false);
	};

	return (
		<>
			<Button onClick={handleCreate}>
				<span className="sr-only">Create account</span>
				<Plus className="h-4 w-4" />
			</Button>
			{isModalOpen ? (
				<Sheet
					isOpen={isModalOpen}
					currencies={currencies}
					onClose={handleClose}
				/>
			) : null}
		</>
	);
}
