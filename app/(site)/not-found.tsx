import Link from "next/link";
export default function NotFound() {
  return (
    <section className="container-x grid min-h-[80vh] place-items-center pt-24 text-center">
      <div>
        <p className="display text-[30vw] leading-none sun-text md:text-[14rem]">404</p>
        <p className="mt-4 text-xl text-muted">This page is in the shade.</p>
        <Link href="/" className="btn btn-ink mt-8">Back to sunlight</Link>
      </div>
    </section>
  );
}
