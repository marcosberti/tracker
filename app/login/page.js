'use client'

import { useState } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Loader2 } from "lucide-react"
import { createBrowserClient} from '@/lib/supabase-browser'

export default function Login() {
  const supabase = createBrowserClient();

  const [isLoading, setIsLoading] = useState(false);

  const  handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email')
    const password = formData.get('password')

    if (email && password) {
      setIsLoading(true);
      const {error} = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      console.log('>>>error', error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="mb-8 text-center">
        <h1 className="font-medium text-xl">tracker</h1>
        <small className="text-xs font-thin">donttheyalllookthesameinside</small>
      </div>

      <form
        className="w-full px-8 flex flex-col gap-2"
        noValidate
        onSubmit={handleSubmit}
      >
        <div>
          <Label htmlFor="email">email</Label>
          <Input id="email" name="email" type="email" />
        </div>

        <div>
          <Label htmlFor="password">password</Label>
          <Input id="password" name="password" type="password" />
        </div>

        <Button className="mt-4" disabled={isLoading} type='submit'>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Log in
        </Button>
      </form>
    </div>
  )
}