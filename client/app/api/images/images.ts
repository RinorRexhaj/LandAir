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
      )}`
    );

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
