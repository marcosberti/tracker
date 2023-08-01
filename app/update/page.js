'use client';
import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase-browser';

const STATUS = {
	idle: 'idle',
	loading: 'loading',
	error: 'error',
	sent: 'sent',
};

export default function Update() {
	const [state, setState] = useState({ status: STATUS.idle });
	const supabase = createBrowserClient();
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const isPending = state.status === STATUS.loading;

	const onSubmit = async values => {
		const { password } = values;

		const { error } = await supabase.auth.updateUser({
			password,
		});

		if (error) {
			setState({
				status: STATUS.error,
				error: 'Invalid credentials',
			});
			resetField('password');
		} else {
			router.push('/');
		}
	};

	return (
		<Dialog open>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update your password</DialogTitle>
				</DialogHeader>

				<form
					id="update"
					className="flex w-full flex-col gap-2 px-8"
					noValidate
					onSubmit={handleSubmit(onSubmit)}
				>
					<div className="relative basis-1/2">
						<Label>
							new password
							<Input
								name="password"
								type="password"
								className={errors.password ? 'border-red-600' : ''}
								{...register('password', { required: 'Password is required' })}
							/>
						</Label>
						{errors.password ? (
							<small className="absolute -bottom-5 text-xs text-red-600">
								{errors.password.message}
							</small>
						) : null}
					</div>
				</form>
				<DialogFooter>
					<Button
						type="submit"
						form="update"
						disabled={isPending}
						// onClick={onConfirm}
					>
						{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Update password
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
