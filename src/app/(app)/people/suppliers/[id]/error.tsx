"use client";
export default function Error({ error }: { error: Error }) {
  console.error(error);
  return (
    <pre className="whitespace-pre-wrap p-6 text-xs text-red-600">
      {error.message}
      {"\n\n"}
      {error.stack}
    </pre>
  );
}
