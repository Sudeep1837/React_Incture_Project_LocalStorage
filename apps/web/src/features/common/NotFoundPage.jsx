export default function NotFoundPage() {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <div className="rounded-xl border bg-white p-6 text-center dark:border-slate-700 dark:bg-slate-800">
        <h1 className="text-xl font-semibold">404</h1>
        <p className="mt-2 text-sm text-slate-500">The page you requested does not exist.</p>
      </div>
    </div>
  );
}
