import { MAXIMUM_TAUNT_ID, MINIMUM_TAUNT_ID } from "../constants/taunts";

export const getAudioFilePath = (id: number) => {
  if (id && id >= MINIMUM_TAUNT_ID && id <= MAXIMUM_TAUNT_ID) {
    const formattedId = id.toString().padStart(2, "0");
    return `assets/${formattedId}.mp3`;
  }
  return null;
};
