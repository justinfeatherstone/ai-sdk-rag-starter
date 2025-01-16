import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-center">
          NutriAI Assistant
        </h1>
        <p className="text-center max-w-xl text-lg">
          Your personal AI nutritionist helping underserved communities in Andover, Massachusetts achieve better health through personalized nutrition plans.
        </p>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="default">Login</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline">Register</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
