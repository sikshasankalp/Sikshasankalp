export default function PlaceholderAdminPage({ title }: { title: string }) {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center bg-background border border-border/50 rounded-xl">
      <h2 className="text-2xl font-bold text-content-primary mb-2">{title}</h2>
      <p className="text-content-secondary max-w-md">
        This section is part of the CMS architecture and will be implemented in a future task.
      </p>
    </div>
  );
}
