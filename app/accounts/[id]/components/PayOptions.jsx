'use client';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import MovementSheet from './MovementSheet';
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
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button className=" bg-green-600 hover:bg-green-600/90">
						<span className="sr-only">Open menu</span>
						<DollarSign className="h-4 w-4 text-white " />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onSelect={handleNewMovement}>
						<span className="ml-2">New movement</span>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<span className="ml-2">Pay installment expense</span>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<span className="ml-2">Pay scheduled expense</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
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
