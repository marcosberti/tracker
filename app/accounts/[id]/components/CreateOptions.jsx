'use client';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const SHEETS = {};

export default function CreateOptions({ account, currencies, categories }) {
	const [openSheet, setOpenSheet] = useState();

	const handleNewMovement = () => {};

	const handleSheetClose = () => {
		setOpenSheet(null);
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" className="group">
						<span className="sr-only">Open menu</span>
						<Plus className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem>
						<span className="ml-2">New installment expense</span>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<span className="ml-2">New scheduled expense</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
