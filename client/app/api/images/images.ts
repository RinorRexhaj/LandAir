const unsplash_key = process.env.UNSPLASH_ACCESS_KEY;

export const getImageUrlFromDescription = async (
  description: string
): Promise<{ url: string } | null> => {
  if (!description) {
    return null;
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?page=1&query=${encodeURIComponent(
        description
      )}&client_id=${unsplash_key}`
    );
    console.log(response);

    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        `Error fetching image: ${response.status} - ${
          errorData.error || errorData.message
        }`
      );
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network or parsing error fetching image:", error);
    return null;
  }
};
