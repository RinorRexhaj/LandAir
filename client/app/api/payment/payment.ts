export async function createCheckoutSession({
  type,
  userId,
  email,
}: {
  type: string;
  userId?: string;
  email: string;
}) {
  const price_id =
    type === "growth"
      ? process.env.NEXT_PUBLIC_PADDLE_GROWTH_ID
      : process.env.NEXT_PUBLIC_PADDLE_SCALE_ID;
  const response = await fetch(
    "https://sandbox-api.paddle.com/checkout/sessions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PADDLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: {
          email,
        },
        items: [
          {
            price_id,
            quantity: 1,
          },
        ],
        custom_data: {
          user_id: userId,
        },
        success_url: "https://landair.app",
        cancel_url: "https://landair.app",
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Paddle error", data);
    return { error: data };
  }

  return { url: data.data.url };
}
