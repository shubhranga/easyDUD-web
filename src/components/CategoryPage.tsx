import { Navbar } from "@/components/Navbar";
import { FloatingSidebar } from "@/components/FloatingSidebar";
import { ServiceImage } from "@/components/ServiceImage";
import { SERVICE_IMAGES, CATEGORY_META, type ServiceCategory } from "@/lib/service-images";

interface CategoryPageProps {
  category: ServiceCategory;
}

export function CategoryPage({ category }: CategoryPageProps) {
  const meta = CATEGORY_META[category];
  const images = SERVICE_IMAGES[category];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <FloatingSidebar />
      <main className="mx-auto max-w-[1320px] px-6 pt-10 pb-16 md:pl-20">
        <p className="text-sm font-medium text-foreground/60">easyDUD</p>
        <h1 className="mt-3 text-4xl md:text-5xl font-light tracking-tight text-foreground/90">
          {meta.label}
        </h1>
        <p className="mt-2 max-w-xl text-foreground/60">{meta.tagline}</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <ServiceImage
            images={images}
            alt={meta.label}
            label={meta.label}
            eager
            className="aspect-[4/3] md:aspect-[16/10]"
          />
          <div className="rounded-[24px] bg-white shadow-[0_10px_40px_rgba(60,60,90,0.08)] p-6">
            <h2 className="text-xl font-medium text-foreground/85">
              Coming soon
            </h2>
            <p className="mt-2 text-sm text-foreground/60">
              We're putting the finishing touches on {meta.label.toLowerCase()} booking.
              Meanwhile, explore our other services from the dock on the left.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
