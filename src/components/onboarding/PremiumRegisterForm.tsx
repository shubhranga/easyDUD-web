import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { MapPin, Star } from "lucide-react";
import { StepWizard } from "./StepWizard";
import { ImageUploader } from "./ImageUploader";

const PREMIUM_STEPS = ["Onboarding Form", "Review Details", "Payment"];
const AMENITY_OPTIONS = ["WiFi", "Pool", "Gym", "Restaurant", "Parking", "Spa"];

const schema = z.object({
  hotelName: z.string().trim().min(2, "Required").max(120),
  address: z.string().trim().min(10, "Please enter a complete address").max(500),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
  manualLocation: z.string().trim().max(200).optional(),
  images: z.array(z.instanceof(File)).min(1, "Add at least one image"),
  roomPricing: z.coerce.number().min(1, "Required").max(1_000_000),
  details: z.string().trim().min(20, "Tell us a bit more").max(2000),
  starRating: z.coerce.number().min(1).max(5),
  numRooms: z.coerce.number().min(1, "Required").max(10_000),
  amenities: z.array(z.string()).min(1, "Select at least one amenity"),
  websiteUrl: z
    .string()
    .trim()
    .max(255)
    .optional()
    .refine(
      (v) => !v || /^https?:\/\/.+/.test(v),
      "Must start with http:// or https://",
    ),
  gst: z.string().trim().regex(/^[0-9A-Z]{15}$/, "Enter a valid 15-char GSTIN"),
  bankAccount: z.string().trim().regex(/^[0-9]{9,18}$/, "9–18 digit account number"),
  ifsc: z.string().trim().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC"),
  paymentMethod: z.enum(["upi", "card", "netbanking"]),
});

type FormValues = z.infer<typeof schema>;

const PAYMENT_OPTIONS: { id: FormValues["paymentMethod"]; label: string; sub: string }[] = [
  { id: "upi", label: "UPI", sub: "GPay, PhonePe, Paytm" },
  { id: "card", label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net Banking", sub: "All major Indian banks" },
];

export function PremiumRegisterForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [locationError, setLocationError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      hotelName: "",
      address: "",
      lat: null,
      lng: null,
      manualLocation: "",
      images: [],
      roomPricing: 0,
      details: "",
      starRating: 3,
      numRooms: 0,
      amenities: [],
      websiteUrl: "",
      gst: "",
      bankAccount: "",
      ifsc: "",
      paymentMethod: "upi",
    },
  });

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not available in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setValue("lat", pos.coords.latitude);
        setValue("lng", pos.coords.longitude);
        setLocationError(null);
        toast.success("Location captured");
      },
      () => setLocationError("Could not fetch location. Please enter manually."),
    );
  };

  const next = async () => {
    const stepFields: (keyof FormValues)[][] = [
      [
        "hotelName",
        "address",
        "images",
        "roomPricing",
        "details",
        "starRating",
        "numRooms",
        "amenities",
        "websiteUrl",
        "gst",
        "bankAccount",
        "ifsc",
      ],
      [],
      ["paymentMethod"],
    ];
    const valid = await trigger(stepFields[step]);
    if (valid) setStep((s) => Math.min(s + 1, PREMIUM_STEPS.length - 1));
  };

  const onSubmit = async (values: FormValues) => {
    const submission = {
      tier: "premium",
      ...values,
      images: values.images.map((f) => f.name),
      submittedAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem("hotel_registrations") ?? "[]");
    localStorage.setItem(
      "hotel_registrations",
      JSON.stringify([...existing, submission]),
    );
    toast.success("Premium registration submitted! Our team will reach out within 24 hours.");
    navigate({ to: "/hotel-onboarding" });
  };

  const stars = watch("starRating");
  const amenities = watch("amenities");
  const lat = watch("lat");
  const lng = watch("lng");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <StepWizard steps={PREMIUM_STEPS} currentStep={step}>
        {step === 0 && (
          <div className="space-y-5">
            <Field label="Hotel Name" error={errors.hotelName?.message}>
              <input {...register("hotelName")} className="input" />
            </Field>
            <Field label="Complete Address" error={errors.address?.message}>
              <textarea {...register("address")} rows={3} className="input" />
            </Field>

            <Field label="Location">
              <button
                type="button"
                onClick={captureLocation}
                className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
              >
                <MapPin className="h-4 w-4" />
                Use my location
              </button>
              {lat && lng && (
                <p className="mt-2 text-xs text-muted-foreground">
                  GPS: {lat.toFixed(4)}, {lng.toFixed(4)}
                </p>
              )}
              {locationError && (
                <p className="mt-2 text-xs text-rose-600">{locationError}</p>
              )}
              <input
                {...register("manualLocation")}
                className="input mt-2"
                placeholder="Or enter landmark / city manually"
              />
            </Field>

            <Field label="Property Images" error={errors.images?.message as string}>
              <Controller
                control={control}
                name="images"
                render={({ field }) => (
                  <ImageUploader value={field.value} onChange={field.onChange} />
                )}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Star Rating" error={errors.starRating?.message}>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setValue("starRating", n)}
                      className="rounded p-1"
                      aria-label={`${n} stars`}
                    >
                      <Star
                        className={`h-6 w-6 ${
                          n <= stars
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Number of Rooms" error={errors.numRooms?.message}>
                <input type="number" {...register("numRooms")} className="input" />
              </Field>
            </div>

            <Field label="Amenities" error={errors.amenities?.message as string}>
              <div className="flex flex-wrap gap-2">
                {AMENITY_OPTIONS.map((a) => {
                  const checked = amenities.includes(a);
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() =>
                        setValue(
                          "amenities",
                          checked
                            ? amenities.filter((x) => x !== a)
                            : [...amenities, a],
                          { shouldValidate: true },
                        )
                      }
                      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        checked
                          ? "border-indigo-500 bg-indigo-600 text-white"
                          : "border-slate-300 bg-white text-foreground hover:border-slate-400"
                      }`}
                    >
                      {a}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field
              label="Website URL (optional — we'll build one if blank)"
              error={errors.websiteUrl?.message}
            >
              <input
                {...register("websiteUrl")}
                className="input"
                placeholder="https://yourhotel.com"
              />
            </Field>

            <Field label="Room Pricing (₹/night)" error={errors.roomPricing?.message}>
              <input type="number" {...register("roomPricing")} className="input" />
            </Field>

            <Field label="Hotel Details" error={errors.details?.message}>
              <textarea {...register("details")} rows={4} className="input" />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="GST Number" error={errors.gst?.message}>
                <input
                  {...register("gst")}
                  className="input uppercase"
                  placeholder="22AAAAA0000A1Z5"
                />
              </Field>
              <Field label="Bank Account Number" error={errors.bankAccount?.message}>
                <input {...register("bankAccount")} className="input" />
              </Field>
            </div>
            <Field label="IFSC Code" error={errors.ifsc?.message}>
              <input
                {...register("ifsc")}
                className="input uppercase"
                placeholder="HDFC0001234"
              />
            </Field>
          </div>
        )}

        {step === 1 && <ReviewCard values={getValues()} onEdit={() => setStep(0)} />}

        {step === 2 && (
          <div className="space-y-5">
            <fieldset className="space-y-3">
              <legend className="mb-2 text-base font-semibold">
                Choose your payment method
              </legend>
              {PAYMENT_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                    watch("paymentMethod") === opt.id
                      ? "border-indigo-500 bg-indigo-50/60"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    value={opt.id}
                    {...register("paymentMethod")}
                    className="h-4 w-4 text-indigo-600"
                  />
                  <div>
                    <p className="text-sm font-semibold">{opt.label}</p>
                    <p className="text-xs text-muted-foreground">{opt.sub}</p>
                  </div>
                </label>
              ))}
            </fieldset>

            <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-5">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-indigo-700">
                Order Summary
              </h4>
              <div className="mt-3 space-y-2 text-sm">
                <Row label="Premium Onboarding" value="₹2,99,999" strike />
                <Row label="Promotional discount" value="− ₹50,000" />
                <Row label="GST (18%)" value="₹44,999" />
                <div className="my-2 border-t border-indigo-200" />
                <Row label="Total payable" value="₹2,94,998" bold />
              </div>
              <p className="mt-3 rounded-lg bg-amber-50 p-2 text-xs text-amber-800">
                Payment gateway is in stub mode — your selection is recorded but
                no charge is made.
              </p>
            </div>
          </div>
        )}
      </StepWizard>

      <div className="flex items-center justify-between border-t border-slate-200 pt-6">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Back
          </button>
        ) : (
          <span />
        )}
        {step < PREMIUM_STEPS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            Complete Registration
          </button>
        )}
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

function Row({ label, value, strike, bold }: { label: string; value: string; strike?: boolean; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-foreground/70">{label}</span>
      <span
        className={`${strike ? "text-slate-400 line-through" : "text-foreground"} ${
          bold ? "text-base font-bold" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function ReviewCard({ values, onEdit }: { values: FormValues; onEdit: () => void }) {
  const rows: [string, string][] = [
    ["Hotel Name", values.hotelName],
    ["Star Rating", "★".repeat(values.starRating)],
    ["Rooms", String(values.numRooms)],
    ["Address", values.address],
    ["Amenities", values.amenities.join(", ")],
    ["Website", values.websiteUrl || "(we'll build one)"],
    ["Room Pricing", `₹${Number(values.roomPricing).toLocaleString("en-IN")} / night`],
    ["GSTIN", values.gst.toUpperCase()],
    ["Bank Account", values.bankAccount],
    ["IFSC", values.ifsc.toUpperCase()],
    ["Images", `${values.images.length} uploaded`],
    ["Details", values.details],
  ];
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold">Review your details</h3>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs font-medium text-indigo-600 hover:underline"
        >
          Edit
        </button>
      </div>
      <dl className="space-y-2 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-3 gap-4 border-b border-slate-200 pb-2 last:border-0">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="col-span-2 text-foreground">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
