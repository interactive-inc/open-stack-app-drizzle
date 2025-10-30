import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { use, useState } from "react"
import { Label } from "recharts"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SessionContext } from "@/contexts/session-context"
import { client } from "@/lib/client"

/**
 * ログインページ
 */
export function LoginPage() {
  const navigate = useNavigate()

  const [, refreshSession] = use(SessionContext)

  const [email, setEmail] = useState("")

  const [password, setPassword] = useState("")

  const mutation = useMutation({
    async mutationFn() {
      const resp = await client.api.auth.sign.in.$post({
        json: { email, password },
      })
      return resp.json()
    },
  })

  const onLogin = async () => {
    try {
      await mutation.mutateAsync()
      // セッション情報を更新
      await refreshSession()
      toast.success("ログインしました")
      navigate({ to: "/" })
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }

  return (
    <div className={"flex h-svh w-full flex-col items-center justify-center"}>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{"-"}</CardTitle>
          <CardDescription>
            {"Enter your email below to login to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{"メールアドレス"}</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>{"パスワード"}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <div className="flex justify-end">
              <p className="text-secondary-foreground text-sm">
                {"Forgot your password?"}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            onClick={onLogin}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "ログイン中..." : "ログイン"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
