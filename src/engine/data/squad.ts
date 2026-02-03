import { Player } from "../objects/Player";

export function createStartingXI(outFieldColor: string, gkColor: string, names?: string[]): Player[] {
  const players: Player[] = [];

  for (let i = 1; i <= 11; i++) {
    const isGK = i === 1;
    players.push(new Player(
      `player-${i}`,
      0,  // x/y will be set by applyFormation
      0,
      i,
      isGK ? gkColor : outFieldColor,
      names ? names[i - 1] : ""  // <-- NEW: Pass name if provided
    ));
  }
  return players

    // return [
    //   new Player("gk", 0, 0, 1, gkColor),
  
    //   // Defenders (4)
    //   new Player("rb", 0, 0, 2, outFieldColor),
    //   new Player("cb1", 0, 0, 4, outFieldColor),
    //   new Player("cb2", 0, 0, 5, outFieldColor),
    //   new Player("lb", 0, 0, 3, outFieldColor),
  
    //   // Midfield (3)
    //   new Player("cm1", 0, 0, 6, outFieldColor),
    //   new Player("cm2", 0, 0, 8, outFieldColor,),
    //   new Player("cm3", 0, 0, 10, outFieldColor),
  
    //   // Attack (3)
    //   new Player("rw", 0, 0, 7, outFieldColor),
    //   new Player("st", 0, 0, 9, outFieldColor),
    //   new Player("lw", 0, 0, 11, outFieldColor),
    // ];
  }
  
