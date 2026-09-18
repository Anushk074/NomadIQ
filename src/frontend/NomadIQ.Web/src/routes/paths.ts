// Centralized route paths so components never hardcode route strings.
export const paths = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  trips: "/trips",
  discovery: "/discovery",
  assistant: "/assistant",
} as const;
