import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type TabId = "flights" | "cab" | "bike" | "hotels";

const TABS: { id: TabId; label: string; emoji: string; disabled: boolean }[] = [
  { id: "flights", label: "Flights", emoji: "✈️", disabled: true },
  { id: "cab", label: "Cab", emoji: "🚕", disabled: true },
  { id: "bike", label: "Bike", emoji: "🏍️", disabled: true },
  { id: "hotels", label: "Hotels", emoji: "🏨", disabled: false },
];

const ROOM_TYPES = ["Standard", "Deluxe", "Suite"] as const;
type RoomType = (typeof ROOM_TYPES)[number];

const POPULAR_CITIES = [
  "Mumbai", "Delhi", "Goa", "Jaipur",
  "Bangalore", "Manali", "Udaipur", "Rishikesh",
];

const inputClass =
  "border border-white/10 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-amber-400/60 bg-white/5 text-white placeholder-white/30 text-sm transition-all duration-200";
const labelClass = "block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-widest";

function HotelsForm() {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);
  const [roomType, setRoomType] = useState<RoomType>("Standard");

  return (
    <motion.form
      onSubmit={(e) => e.preventDefault()}
      className="grid grid-cols-1 md:grid-cols-2 gap-5"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="md:col-span-2">
        <label htmlFor="destination" className={labelClass}>City / Destination</label>
        <input
          id="destination"
          type="text"
          placeholder="Where are you going?"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="checkin" className={labelClass}>Check-in</label>
        <input
          id="checkin"
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="checkout" className={labelClass}>Check-out</label>
        <input
          id="checkout"
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="md:col-span-2 border-t border-white/10 my-1" />

      <div>
        <label htmlFor="rooms" className={labelClass}>Rooms</label>
        <input
          id="rooms"
          type="number"
          min={1}
          max={10}
          value={rooms}
          onChange={(e) => setRooms(Number(e.target.value))}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="guests" className={labelClass}>Guests</label>
        <input
          id="guests"
          type="number"
          min={1}
          max={20}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className={inputClass}
        />
      </div>

      <div className="md:col-span-2">
        <label className={labelClass}>Room Type</label>
        <div className="flex gap-2">
          {ROOM_TYPES.map((type) => {
            const selected = roomType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setRoomType(type)}
                className={
                  "rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 " +
                  (selected
                    ? "bg-amber-400 text-[#0d1b2e] shadow-[0_0_16px_rgba(251,191,36,0.35)]"
                    : "bg-white/5 text-white/50 hover:bg-white/10 border border-white/10")
                }
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      <div className="md:col-span-2">
        <motion.button
          type="submit"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-amber-400 hover:bg-amber-300 text-[#0d1b2e] font-bold py-3.5 rounded-xl text-base transition-colors shadow-[0_4px_24px_rgba(251,191,36,0.25)]"
        >
          Search Hotels
        </motion.button>
      </div>

      <div className="md:col-span-2 mt-1">
        <p className="text-xs text-white/30 font-semibold uppercase tracking-widest mb-3">
          Popular destinations
        </p>
        <div className="flex flex-wrap gap-2 overflow-x-auto">
          {POPULAR_CITIES.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setDestination(city)}
              className="bg-white/5 border border-white/10 text-white/60 text-xs px-3 py-1.5 rounded-full cursor-pointer hover:bg-amber-400/10 hover:border-amber-400/40 hover:text-amber-300 transition-all duration-200 whitespace-nowrap"
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </motion.form>
  );
}

export function ServiceTabs() {
  const [active, setActive] = useState<TabId>("hotels");
  const activeTab = TABS.find((t) => t.id === active)!;

  return (
    <div
      className="w-full rounded-3xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #0d1b2e 0%, #112240 60%, #0a1628 100%)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Header strip */}
      <div className="px-6 pt-6 pb-4 border-b border-white/[0.07]">
        <p className="text-white/30 text-xs font-semibold uppercase tracking-[0.2em] mb-4">
          Our Services
        </p>

        {/* Tab bar */}
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const isActive = active === tab.id;
            return (
              <motion.button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                style={
                  isActive
                    ? {
                        background: "rgba(251,191,36,0.12)",
                        border: "1px solid rgba(251,191,36,0.35)",
                        color: "#fbbf24",
                        boxShadow: "0 0 20px rgba(251,191,36,0.12)",
                      }
                    : {
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.4)",
                      }
                }
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-200 cursor-pointer relative"
              >
                <span className="text-base leading-none">{tab.emoji}</span>
                <span>{tab.label}</span>
                {tab.disabled && (
                  <span className="text-[10px] bg-white/10 text-white/40 px-1.5 py-0.5 rounded-full leading-none">
                    Soon
                  </span>
                )}
                {isActive && (
                  <motion.span
                    layoutId="tab-indicator"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: "rgba(251,191,36,0.07)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Content panel */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab.disabled ? (
            <motion.div
              key={activeTab.id + "-disabled"}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center justify-center gap-4 py-14 text-center"
            >
              <div
                className="text-5xl mb-2 rounded-2xl flex items-center justify-center"
                style={{
                  width: 80,
                  height: 80,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {activeTab.emoji}
              </div>
              <h3 className="text-xl font-bold text-white">Coming Soon</h3>
              <p className="text-white/40 text-sm max-w-xs">
                We're crafting this experience. Check back soon!
              </p>
              <span className="mt-1 inline-block animate-pulse bg-amber-400/10 text-amber-400 text-xs px-3 py-1.5 rounded-full border border-amber-400/20">
                In Development 🚧
              </span>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab.id + "-form"}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <HotelsForm />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
