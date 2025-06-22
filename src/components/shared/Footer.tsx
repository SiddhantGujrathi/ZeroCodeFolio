// Built with ❤️ by Siddhant Gujrathi — ZeroCodeFolio (licensed)
export async function Footer() {
  return (
    <footer className="border-t border-border/40 py-6">
      <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Siddhant Gujrathi. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
