import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — easyDUD" },
      { name: "description", content: "The team and story behind easyDUD." },
    ],
  }),
  component: AboutPage,
});

const TEAM = [
  { 
    name: "Shekhar Pratap Singh Raghav", 
    role: "Founder, MD & CEO", 
    img: "/team/ceo.jpg" 
  },
  { 
    name: "Sanjeev Sharma", 
    role: "Executive Director", 
    img: "/team/executiveDirector.jpg" 
  },
  { 
    name: "Chetan", 
    role: "Executive Co-Founder & Marketing", 
    img: "/team/cfo2.jpg" 
  },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar overlay />
      <section className="relative h-[60vh] min-h-[440px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80"
          alt="travel"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />
        <div className="relative z-10 mx-auto max-w-[1320px] h-full px-6 flex flex-col justify-end pb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-5xl md:text-7xl font-bold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            We make travel <span className="italic" style={{ color: "#E8A87C" }}>effortless</span>
          </motion.h1>
          <p className="mt-4 max-w-xl text-white/85">
            easyDUD is on a mission to remove the friction from every trip — from your morning cab to a transcontinental flight.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-6 py-20 bg-[#F8FAFC]">
        <h2 className="text-3xl font-bold text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
          Meet the team
        </h2>
        <div className="mt-12 flex flex-col items-center gap-8">
          {/* CEO at top - centered */}
          <motion.div
            key={TEAM[0].name}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
            className="group relative bg-white border border-slate-100 p-8 shadow-sm flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 max-w-md w-full"
            style={{
              borderRadius: "24px 24px 24px 0",
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 15% 100%, 0 85%)",
            }}
          >
            <div className="mb-12">
              <h3 className="text-xl font-bold text-slate-900">{TEAM[0].name}</h3>
              <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">{TEAM[0].role}</p>
            </div>
            
            <div className="relative mt-auto mx-auto w-full aspect-square max-w-[240px]">
              <div className="absolute inset-0 bg-slate-50 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500" />
              <div className="absolute inset-0 bg-slate-100/50 rounded-2xl transform -rotate-3 group-hover:-rotate-2 transition-transform duration-500" />
              <img 
                src={TEAM[0].img} 
                alt={TEAM[0].name} 
                className="relative z-10 w-full h-full object-cover object-center rounded-2xl shadow-lg grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500" 
              />
            </div>
          </motion.div>

          {/* Other two at bottom - side by side */}
          <div className="grid gap-8 sm:grid-cols-2 w-full max-w-3xl">
            {TEAM.slice(1).map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (i + 1) * 0.1 }}
                className="group relative bg-white border border-slate-100 p-8 shadow-sm flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                style={{
                  borderRadius: "24px 24px 24px 0",
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 15% 100%, 0 85%)",
                }}
              >
                <div className="mb-12">
                  <h3 className="text-xl font-bold text-slate-900">{m.name}</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">{m.role}</p>
                </div>
                
                <div className="relative mt-auto mx-auto w-full aspect-square max-w-[240px]">
                  <div className="absolute inset-0 bg-slate-50 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-slate-100/50 rounded-2xl transform -rotate-3 group-hover:-rotate-2 transition-transform duration-500" />
                  <img 
                    src={m.img} 
                    alt={m.name} 
                    className="relative z-10 w-full h-full object-cover object-center rounded-2xl shadow-lg grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500" 
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <Link to="/" className="inline-block mt-8 text-[#2563EB] hover:underline">← Back home</Link>
      </section>

      <Footer />
    </div>
  );
}
