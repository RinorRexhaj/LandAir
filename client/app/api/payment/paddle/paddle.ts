export async function getPaddleToken() {
  try {
    const PADDLE_SECRET = process.env.PADDLE_KEY!;

    const response = await fetch(
      "https://sandbox-api.paddle.com/clients/token",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PADDLE_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { error: data };
    }

    return { token: data.token };
  } catch (error) {
    console.error("Client token fetch error:", error);
    return { error: "Failed to fetch Paddle client token" };
  }
}
