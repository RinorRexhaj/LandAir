export async function getPaddleToken() {
  try {
    const PADDLE_SECRET = process.env.PADDLE_KEY!;

    return { token: PADDLE_SECRET };
  } catch (error) {
    console.error("Client token fetch error:", error);
    return { error: "Failed to fetch Paddle client token" };
  }
}
