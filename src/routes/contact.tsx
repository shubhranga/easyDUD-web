import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — easyDUD" },
      { name: "description", content: "Get in touch with the easyDUD team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all fields.");
      return;
    }
    toast.success("Thanks! We'll be in touch soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="mx-auto max-w-[1320px] px-6 pt-32 pb-16 grid gap-10 lg:grid-cols-2 items-start">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Let's <span className="italic" style={{ color: "#C5703F" }}>talk</span>
          </h1>
          <p className="mt-3 text-foreground/70 max-w-md">Questions, partnerships, or feedback — drop us a line.</p>
          <div className="mt-8 space-y-4 text-sm">
            <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-[#2563EB]" /> hello@dudtravel.com</div>
            <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-[#2563EB]" /> +91 98765 43210</div>
            <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-[#2563EB]" /> Mumbai, India</div>
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={submit}
          className="bg-white rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] space-y-3"
        >
          <input
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-secondary/50 rounded-full px-4 py-3 text-sm focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-secondary/50 rounded-full px-4 py-3 text-sm focus:outline-none"
          />
          <textarea
            placeholder="Message"
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full bg-secondary/50 rounded-2xl px-4 py-3 text-sm focus:outline-none resize-none"
          />
          <button
            type="submit"
            className="w-full h-12 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold transition-colors"
          >
            Send message
          </button>
        </motion.form>
      </section>
      <Footer />
    </div>
  );
}
