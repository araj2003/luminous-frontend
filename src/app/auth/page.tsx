'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Icons } from "@/components/ui/icons"

export default function AuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function onDemoLogin() {
    setIsLoading(true)
    try {
      // Simulate a login request
      await new Promise((resolve) => setTimeout(resolve, 500))
      const email = 'demo@demo.com'
      const password = 'demo@1234'
      const username = 'Demo User'
      localStorage.setItem('user', JSON.stringify({ username, email, password }))
      router.push('/home')
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    const form = event.target as HTMLFormElement
    const formData = new FormData(form)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const username = formData.get('username') as string
    const isLogin = form.getAttribute('data-form-type') === 'login'

    try {
      if (isLogin) {
        // Handle login logic
        const storedUser = localStorage.getItem(email)
        if (storedUser) {
          const user = JSON.parse(storedUser)
          if (user.password === password) {
            router.push('/home')
          } else {
            throw new Error('Invalid password')
          }
        } else {
          throw new Error('User not found')
        }
      } else {
        // Handle registration logic
        localStorage.setItem('user', JSON.stringify({ username, email, password }))
        router.push('/home')
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }

      // Here you would typically show an error message to the user
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      router.push('/home')
    }
  } , [])


  return (
    <div className='w-screen h-screen grid place-content-center '>
      <Card className="w-[350px] mx-auto ">
        <CardHeader>
          <CardTitle>Smart Power Management</CardTitle>
          <CardDescription>Login or create an account to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={onSubmit} data-form-type="login">
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      placeholder="********"
                      type="password"
                      autoCapitalize="none"
                      autoComplete="current-password"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isLoading}>

                    Sign In
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={onSubmit} data-form-type="register">
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      placeholder="johndoe"
                      type="text"
                      autoCapitalize="none"
                      autoCorrect="off"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      placeholder="********"
                      type="password"
                      autoCapitalize="none"
                      autoComplete="new-password"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isLoading}>

                    Create Account
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={onDemoLogin}>
            Demo Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}