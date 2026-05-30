import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Plane, CarTaxiFront, Bike, Hotel, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Our Services — easyDUD" },
      { name: "description", content: "Flights, cabs, bikes, and hotels — all from one app." },
    ],
  }),
  component: ServicesPage,
});

const SERVICES = [
  { Icon: Plane, name: "Flights", to: "/flights", img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&q=80", desc: "Compare 500+ airlines and book in seconds." },
  { Icon: CarTaxiFront, name: "Cabs", to: "/cab", img: "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?w=900&q=80", desc: "On-demand rides across the city." },
  { Icon: Bike, name: "Bikes", to: "/bike-pooling", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80", desc: "Pool a bike and beat the traffic." },
  { Icon: Hotel, name: "Hotels", to: "/hotels", img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&q=80", desc: "Hand-picked stays in 200+ cities." },
];

function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="mx-auto max-w-[1320px] px-6 pt-32 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Everything you need to <span className="italic" style={{ color: "#C5703F" }}>go</span>
        </motion.h1>
        <p className="mt-4 max-w-xl text-foreground/70">From your front door to your final destination — one app for it all.</p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="relative h-72 rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.1)] group"
            >
              <img src={s.img} alt={s.name} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="relative h-full p-6 flex flex-col justify-end text-white">
                <s.Icon className="h-7 w-7 mb-2 opacity-90" />
                <h3 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{s.name}</h3>
                <p className="text-sm text-white/80 mt-1">{s.desc}</p>
                <Link to={s.to} className="mt-3 inline-flex items-center gap-1 text-sm font-medium">
                  Explore <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
