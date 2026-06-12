import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center py-32 text-center">
      <p className="section-eyebrow">404</p>
      <h1 className="section-heading">This Page Skipped Leg Day</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        The page you are looking for does not exist. Let us get you back on
        track.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
