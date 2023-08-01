'use client';
import MovementSheet from '../Movements/Sheet';
import { Button } from '@/components/ui/button';
import { DollarSign } from 'lucide-react';
import { useState } from 'react';

const SHEETS = {
	movement: 'movement',
};

export default function PayOptions({ account, currencies, categories }) {
	const [openSheet, setOpenSheet] = useState();

	const handleNewMovement = () => {
		setOpenSheet(SHEETS.movement);
	};

	const handleSheetClose = () => {
		setOpenSheet(null);
	};

	return (
		<>
			<Button onClick={handleNewMovement}>
				<span className="sr-only">Create payment</span>
				<DollarSign className="h-4 w-4 text-white " />
			</Button>
			{openSheet === SHEETS.movement ? (
				<MovementSheet
					isOpen
					account={account}
					currencies={currencies}
					categories={categories}
					onClose={handleSheetClose}
				/>
			) : null}
		</>
	);
}