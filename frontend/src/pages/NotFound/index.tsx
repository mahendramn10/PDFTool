import { Link } from "react-router-dom";
import { SEO } from "@/components/common/SEO";
import { Button } from "@/components/ui/Button";

export function NotFoundPage() {
  return (
    <>
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist." path="/404" noindex />
      <section className="mx-auto flex max-w-lg flex-col items-center px-4 py-32 text-center sm:px-6 lg:px-8">
        <p className="font-display text-7xl font-semibold text-blueprint-500">404</p>
        <h1 className="mt-4 font-display text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-ink-soft dark:text-ink-soft-dark">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Link to="/" className="mt-6">
          <Button>Back to homepage</Button>
        </Link>
      </section>
    </>
  );
}
