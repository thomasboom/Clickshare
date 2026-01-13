import { ConvexHttpClient } from "convex/browser";

let convexClient: ConvexHttpClient | null = null;

export function getConvexClient() {
  if (convexClient) {
    return convexClient;
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!convexUrl) {
    console.error("Convex environment variable not set");
    return null;
  }

  try {
    convexClient = new ConvexHttpClient(convexUrl);
    return convexClient;
  } catch (error) {
    console.error("Failed to initialize Convex:", error);
    return null;
  }
}
