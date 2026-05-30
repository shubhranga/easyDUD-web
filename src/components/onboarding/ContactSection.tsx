import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { exportToExcel } from "@/lib/exportToExcel";
import { sendAckEmail } from "@/lib/sendAckEmail";

const schema = z.object({
  name: z.string().trim().min(2, "Required").max(100),
  company: z.string().trim().min(2, "Required").max(150),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9\s-]{7,20}$/, "Enter a valid phone number"),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(10, "Tell us a bit more").max(1000),
});

type FormValues = z.infer<typeof schema>;

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: "onTouched" });

  const onSubmit = async (values: FormValues) => {
    try {
      exportToExcel(values);
      const r = await sendAckEmail(values.email, values.name);
      if (r.skipped) {
        toast.message("Lead saved & Excel downloaded", {
          description:
            "Acknowledgment email skipped — EmailJS credentials not configured.",
        });
      } else {
        toast.success("Lead saved & acknowledgment email sent.");
      }
      setSubmitted(true);
      reset();
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-emerald-200 bg-emerald-50 p-10 text-center"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Check className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-emerald-900">Thank you!</h3>
        <p className="mt-2 text-sm text-emerald-800">
          We'll get back to you within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 text-sm font-medium text-emerald-700 underline-offset-4 hover:underline"
        >
          Submit another inquiry
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 sm:grid-cols-2">
      <Field label="Your Name" error={errors.name?.message}>
        <input {...register("name")} className="input" />
      </Field>
      <Field label="Hotel / Company Name" error={errors.company?.message}>
        <input {...register("company")} className="input" />
      </Field>
      <Field label="Phone Number" error={errors.phone?.message}>
        <input type="tel" {...register("phone")} className="input" />
      </Field>
      <Field label="Email Address" error={errors.email?.message}>
        <input type="email" {...register("email")} className="input" />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Message" error={errors.message?.message}>
          <textarea rows={4} {...register("message")} className="input" />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 sm:w-auto sm:px-8"
        >
          {isSubmitting ? "Submitting…" : "Send Inquiry"}
        </button>
      </div>

      <style>{`
        .input { width: 100%; border: 1px solid rgb(203 213 225); border-radius: 0.5rem; padding: 0.5rem 0.75rem; font-size: 0.875rem; background: white; outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
        .input:focus { border-color: rgb(99 102 241); box-shadow: 0 0 0 3px rgb(199 210 254 / 0.5); }
      `}</style>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-foreground">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
