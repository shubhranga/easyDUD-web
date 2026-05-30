export type Hotel = {
  id: string;
  name: string;
  city: string;
  country: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  tags: string[];
  amenities: string[];
};

export const HOTELS: Hotel[] = [
  {
    id: "h1",
    name: "Aurora Skyline Suites",
    city: "Mumbai",
    country: "India",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    price: 184,
    rating: 4.8,
    reviews: 1284,
    tags: ["Luxury", "City View"],
    amenities: ["Pool", "Spa", "WiFi"],
  },
  {
    id: "h2",
    name: "Maison Verde Boutique",
    city: "Goa",
    country: "India",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    price: 142,
    rating: 4.7,
    reviews: 982,
    tags: ["Boutique", "Beach"],
    amenities: ["Pool", "Breakfast", "WiFi"],
  },
  {
    id: "h3",
    name: "The Grand Aurelia",
    city: "Jaipur",
    country: "India",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80",
    price: 226,
    rating: 4.9,
    reviews: 2104,
    tags: ["Heritage", "Luxury"],
    amenities: ["Spa", "Restaurant", "WiFi"],
  },
  {
    id: "h4",
    name: "Cedarwood Mountain Lodge",
    city: "Manali",
    country: "India",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    price: 118,
    rating: 4.6,
    reviews: 612,
    tags: ["Mountain", "Cozy"],
    amenities: ["Fireplace", "Breakfast", "WiFi"],
  },
  {
    id: "h5",
    name: "Lumière Lakeside Resort",
    city: "Udaipur",
    country: "India",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
    price: 268,
    rating: 4.9,
    reviews: 1740,
    tags: ["Lake", "Luxury"],
    amenities: ["Pool", "Spa", "Restaurant"],
  },
  {
    id: "h6",
    name: "Riverstone Wellness Retreat",
    city: "Rishikesh",
    country: "India",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    price: 98,
    rating: 4.5,
    reviews: 488,
    tags: ["Wellness", "Yoga"],
    amenities: ["Spa", "Yoga", "WiFi"],
  },
  {
    id: "h7",
    name: "Atlas Urban Hotel",
    city: "Bangalore",
    country: "India",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
    price: 156,
    rating: 4.7,
    reviews: 1102,
    tags: ["Business", "City"],
    amenities: ["Gym", "WiFi", "Breakfast"],
  },
  {
    id: "h8",
    name: "Coral Bay Beach Villas",
    city: "Goa",
    country: "India",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
    price: 312,
    rating: 4.8,
    reviews: 1320,
    tags: ["Villa", "Beach"],
    amenities: ["Private Pool", "Beach", "WiFi"],
  },
];

export const POPULAR_CITIES = [
  "Mumbai",
  "Delhi",
  "Goa",
  "Jaipur",
  "Bangalore",
  "Manali",
  "Udaipur",
  "Rishikesh",
];
