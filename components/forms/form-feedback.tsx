import { CheckCircle2 } from "lucide-react";

export function FormSuccess({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <CheckCircle2 className="h-12 w-12 text-emerald-400" />
      <h3 className="font-display text-xl font-bold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-400">{message}</p>;
}
