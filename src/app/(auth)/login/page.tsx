import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">SupportMesh</h1>
            <Badge variant="secondary" className="text-xs">Beta</Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            AI-powered support operations for your team
          </p>
        </div>

        {/* Auth card */}
        <Card className="shadow-md">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your organization&apos;s workspace
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            <LoginLink postLoginRedirectURL="/dashboard" className="w-full">
              <Button className="w-full" size="lg">
                Sign in
              </Button>
            </LoginLink>

            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">or</span>
              <Separator className="flex-1" />
            </div>

            <RegisterLink postLoginRedirectURL="/dashboard" className="w-full">
              <Button variant="outline" className="w-full" size="lg">
                Create an account
              </Button>
            </RegisterLink>
          </CardContent>

          <CardFooter className="pt-0">
            <p className="text-xs text-muted-foreground text-center w-full">
              By continuing you agree to our terms of service and privacy policy.
            </p>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Secured by{" "}
          <span className="font-medium text-foreground">Kinde</span>
        </p>
      </div>
    </div>
  );
}
