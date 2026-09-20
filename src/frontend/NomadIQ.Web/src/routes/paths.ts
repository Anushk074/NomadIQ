// Centralized route paths so components never hardcode route strings.
export const paths = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  trips: "/trips",
  newTrip: "/trips/new",
  tripDetailsPattern: "/trips/:tripId",
  tripDetails: (tripId: string) => `/trips/${tripId}`,
  discovery: "/discovery",
  destinationDetailsPattern: "/discovery/:destinationId",
  destinationDetails: (destinationId: string) => `/discovery/${destinationId}`,
  assistant: "/assistant",
} as const;
