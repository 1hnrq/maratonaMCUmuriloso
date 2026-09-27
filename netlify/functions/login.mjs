import handler from "./api.mjs";

export default handler;
export const config = {
  path: "/api/login",
  rateLimit: {
    action: "rate_limit",
    aggregateBy: ["ip", "domain"],
    windowLimit: 10,
    windowSize: 60,
  },
};
