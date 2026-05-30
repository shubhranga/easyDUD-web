import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { MapPin } from "lucide-react";
import { StepWizard } from "./StepWizard";
import { ImageUploader } from "./ImageUploader";

const BASIC_STEPS = ["Payment Method", "Hotel Information", "Review & Submit"];

const schema = z.object({
  paymentMethod: z.enum(["upi", "card", "netbanking"]),
  hotelName: z.string().trim().min(2, "Hotel name is required").max(120),
  address: z.string().trim().min(10, "Please enter a complete address").max(500),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
  manualLocation: z.string().trim().max(200).optional(),
  images: z.array(z.instanceof(File)).min(1, "Add at least one image"),
  roomPricing: z.coerce.number().min(1, "Required").max(1_000_000),
  details: z.string().trim().min(20, "Tell us a bit more").max(2000),
});

type FormValues = z.infer<typeof schema>;

const PAYMENT_OPTIONS: { id: FormValues["paymentMethod"]; label: string; sub: string }[] = [
  { id: "upi", label: "UPI", sub: "GPay, PhonePe, Paytm" },
  { id: "card", label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net Banking", sub: "All major Indian banks" },
];

export function BasicRegisterForm() {
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
      paymentMethod: "upi",
      hotelName: "",
      address: "",
      lat: null,
      lng: null,
      manualLocation: "",
      images: [],
      roomPricing: 0,
      details: "",
    },
  });

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not available in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setValue("lat", pos.coords.latitude, { shouldDirty: true });
        setValue("lng", pos.coords.longitude, { shouldDirty: true });
        setLocationError(null);
        toast.success("Location captured");
      },
      () => setLocationError("Could not fetch location. Please enter manually."),
    );
  };

  const next = async () => {
    const fieldsByStep: (keyof FormValues)[][] = [
      ["paymentMethod"],
      ["hotelName", "address", "images", "roomPricing", "details"],
      [],
    ];
    const valid = await trigger(fieldsByStep[step]);
    if (valid) setStep((s) => Math.min(s + 1, BASIC_STEPS.length - 1));
  };

  const onSubmit = async (values: FormValues) => {
    const submission = {
      tier: "basic",
      ...values,
      images: values.images.map((f) => f.name),
      submittedAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem("hotel_registrations") ?? "[]");
    localStorage.setItem(
      "hotel_registrations",
      JSON.stringify([...existing, submission]),
    );
    toast.success("Registration submitted! Our team will reach out shortly.");
    navigate({ to: "/hotel-onboarding" });
  };

  const lat = watch("lat");
  const lng = watch("lng");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <StepWizard steps={BASIC_STEPS} currentStep={step}>
        {step === 0 && (
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
            <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
              Payment gateway is in stub mode — your choice is recorded but no
              charge is made.
            </p>
          </fieldset>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <Field label="Hotel Name" error={errors.hotelName?.message}>
              <input
                {...register("hotelName")}
                className="input"
                placeholder="The Grand Riverside"
              />
            </Field>

            <Field label="Complete Address" error={errors.address?.message}>
              <textarea
                {...register("address")}
                rows={3}
                className="input"
                placeholder="Building, street, area, city, state, PIN"
              />
            </Field>

            <Field label="Location" error={errors.manualLocation?.message}>
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

            <Field label="Room Pricing (₹/night)" error={errors.roomPricing?.message}>
              <input
                type="number"
                {...register("roomPricing")}
                className="input"
                placeholder="2500"
              />
            </Field>

            <Field label="Hotel Details" error={errors.details?.message}>
              <textarea
                {...register("details")}
                rows={4}
                className="input"
                placeholder="Highlight what makes your hotel special…"
              />
            </Field>
          </div>
        )}

        {step === 2 && (
          <ReviewCard values={getValues()} />
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
        {step < BASIC_STEPS.length - 1 ? (
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
            Confirm & Submit
          </button>
        )}
      </div>

      <style>{`
        .input {
          width: 100%;
          border: 1px solid rgb(203 213 225);
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          background: white;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
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
      <label className="mb-1 block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}

function ReviewCard({ values }: { values: FormValues }) {
  const rows: [string, string][] = [
    ["Payment Method", values.paymentMethod.toUpperCase()],
    ["Hotel Name", values.hotelName],
    ["Address", values.address],
    [
      "Location",
      values.lat && values.lng
        ? `${values.lat.toFixed(4)}, ${values.lng.toFixed(4)}`
        : values.manualLocation || "—",
    ],
    ["Images", `${values.images.length} uploaded`],
    ["Room Pricing", `₹${Number(values.roomPricing).toLocaleString("en-IN")} / night`],
    ["Details", values.details],
  ];
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
      <h3 className="mb-4 text-base font-semibold">Review your details</h3>
      <dl className="space-y-3 text-sm">
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
