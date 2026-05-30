import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — easyDUD" },
      { name: "description", content: "Stories, guides, and travel inspiration from the DUD team." },
    ],
  }),
  component: BlogPage,
});

const POSTS = [
  { title: "10 hidden gems in Goa for 2026", img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&q=80", date: "May 12, 2026", excerpt: "Skip the crowds and discover the Goa locals love." },
  { title: "How to fly business class for less", img: "https://images.unsplash.com/photo-1540339832862-474599807836?w=900&q=80", date: "May 02, 2026", excerpt: "Real, repeatable tactics for upgrades and award flights." },
  { title: "A weekend in Udaipur — what we learned", img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=900&q=80", date: "Apr 27, 2026", excerpt: "Palaces, lakes, and a slower kind of luxury." },
];

function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="mx-auto max-w-[1320px] px-6 pt-32 pb-16">
        <h1 className="text-4xl md:text-6xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
          Field <span className="italic" style={{ color: "#C5703F" }}>notes</span>
        </h1>
        <p className="mt-3 text-foreground/70 max-w-xl">Stories and guides from the road.</p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {POSTS.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.06)] cursor-pointer"
            >
              <img src={p.img} alt={p.title} className="h-56 w-full object-cover" />
              <div className="p-5">
                <div className="text-xs text-foreground/50">{p.date}</div>
                <h3 className="mt-2 text-lg font-semibold leading-snug">{p.title}</h3>
                <p className="mt-2 text-sm text-foreground/60">{p.excerpt}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
