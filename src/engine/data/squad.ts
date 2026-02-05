import { Player } from "../objects/Player";

export function createStartingXI(idPrefix: string, outFieldColor: string, gkColor: string, names?: string[]): Player[] {
  const players: Player[] = [];

  for (let i = 0; i < 16; i++) {  // <-- CHANGED: 16 players instead of 11
    const isGK = i === 0;
    players.push(new Player(
      `${idPrefix}-player-${i + 1}`,  // Unique ID
      0,  // x/y set later
      0,
      i >= 11 ? 12 + (i - 11) : i + 1,  // <-- Numbers: 1-11 starters, 12-16 subs (change to 0 if you insist, but validation may fail)
      isGK ? gkColor : outFieldColor,
      names ? names[i] || (i >= 11 ? "N/A" : "") : (i >= 11 ? "N/A" : "")  // <-- Names: Provided or "N/A" for subs
    ));
  }

  return players;
}
  
