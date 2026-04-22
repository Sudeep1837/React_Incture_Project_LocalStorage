export default function UnauthorizedPage() {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <div className="rounded-xl border bg-white p-6 text-center dark:border-slate-700 dark:bg-slate-800">
        <h1 className="text-xl font-semibold">Unauthorized</h1>
        <p className="mt-2 text-sm text-slate-500">You do not have permission to access this route.</p>
      </div>
    </div>
  );
}
