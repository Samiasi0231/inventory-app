export function FormAlert({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-xs text-red-600">
      {message}
    </p>
  );
}