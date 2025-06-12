import { supabase } from "../supabase";

interface CreditsError {
  error: string;
}

interface Credits {
  credits: number;
}

export const getCredits = async (
  user_id: string
): Promise<Credits | CreditsError> => {
  const { data, error } = await supabase
    .from("Credits")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    return { error: "Could not get credits." };
  }

  return { credits: data[0].credits };
};

export const spendCredits = async (
  user_id: string
): Promise<Credits | CreditsError> => {
  const { data: currentData, error: fetchError } = await supabase
    .from("Credits")
    .select("credits")
    .eq("user_id", user_id)
    .single();

  if (fetchError || !currentData) {
    return { error: "Could not get credits." };
  }

  const currentCredits = currentData.credits;

  if (currentCredits < 3) {
    return { error: "Insufficient credits." };
  }

  const { data: updatedData, error: updateError } = await supabase
    .from("Credits")
    .update({ credits: currentCredits - 3 })
    .eq("user_id", user_id)
    .select("credits")
    .single();

  if (updateError || !updatedData) {
    return { error: "Error updating credits." };
  }

  return { credits: updatedData.credits };
};
