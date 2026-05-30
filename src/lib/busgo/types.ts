export interface City { id: string; name: string; state: string; popular: boolean; }
export interface Bus {
  id: string;
  operator_name: string;
  is_government: boolean;
  bus_type: string;
  amenities: string[];
  rating: number;
  total_rating_count: number;
}
export interface RouteRow {
  id: string;
  bus_id: string;
  from_city_id: string;
  to_city_id: string;
  departure_time: string;
  arrival_time: string;
  duration_mins: number;
  price: number;
  seats_total: number;
  buses?: Bus;
  from_city?: City;
  to_city?: City;
}

export interface PendingBooking {
  routeId: string;
  date: string;
  seats: string[];
  totalFare: number;
  boardingPoint: string;
  droppingPoint: string;
  // snapshot for display
  operator: string;
  busType: string;
  isGovt: boolean;
  from: string;
  to: string;
  departure: string;
  arrival: string;
}
