export default function Footer() {
  return (
    <footer className="bg-[var(--secundarius)] text-[var(--neuter)] py-8">
      <div className="container mx-auto px-6 text-center">
        <p>
          &copy; {new Date().getFullYear()} Clear Feed. All Rights Reserved.
        </p>
        <p className="text-sm opacity-70 mt-2">
          Built for people who value their focus.
        </p>
      </div>
    </footer>
  );
}
