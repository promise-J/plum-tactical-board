export type Formation = {
  name: string;
  positions: { x: number; y: number }[];
};

//   export const FORMATIONS: Record<string, Formation> = {
//     "4-3-3": {
//       name: "4-3-3",
//       positions: [
//         { x: 0.5, y: 0.9 }, // GK

//         { x: 0.2, y: 0.7 },
//         { x: 0.4, y: 0.7 },
//         { x: 0.6, y: 0.7 },
//         { x: 0.8, y: 0.7 },

//         { x: 0.3, y: 0.5 },
//         { x: 0.5, y: 0.5 },
//         { x: 0.7, y: 0.5 },

//         { x: 0.3, y: 0.3 },
//         { x: 0.5, y: 0.25 },
//         { x: 0.7, y: 0.3 },
//       ],
//     },

//     "4-4-2": {
//       name: "4-4-2",
//       positions: [
//         { x: 0.5, y: 0.9 },

//         { x: 0.2, y: 0.7 },
//         { x: 0.4, y: 0.7 },
//         { x: 0.6, y: 0.7 },
//         { x: 0.8, y: 0.7 },

//         { x: 0.2, y: 0.5 },
//         { x: 0.4, y: 0.5 },
//         { x: 0.6, y: 0.5 },
//         { x: 0.8, y: 0.5 },

//         { x: 0.4, y: 0.3 },
//         { x: 0.6, y: 0.3 },
//       ],
//     },
//   };

import { Player } from "../objects/Player";
import type { FormationSlot } from "../utils/applyFormation";

export function applyFormation(
  players: Player[],
  formation: number[],
  canvasWidth: number,
  canvasHeight: number
) {
  if (players.length !== 11) return;

  // 🟢 Safe pitch margins (VERY IMPORTANT)
  const paddingX = canvasWidth * 0.1;
  const paddingY = canvasHeight * 0.1;

  const pitchWidth = canvasWidth - paddingX * 2;
  const pitchHeight = canvasHeight - paddingY * 2;

  // 🟢 Vertical lines (GK + formation lines)
  const lines = formation.length + 1; // +1 for GK
  const lineGap = pitchHeight / (lines - 1);

  let playerIndex = 0;

  // 🟢 GOALKEEPER
  const gk = players[playerIndex++];
  gk.x = canvasWidth / 2;
  gk.y = paddingY + pitchHeight;

  // 🟢 DEF / MID / ATT
  formation.forEach((count, lineIndex) => {
    const y = paddingY + pitchHeight - lineGap * (lineIndex + 1);

    const gapX = pitchWidth / (count + 1);

    for (let i = 0; i < count; i++) {
      const p = players[playerIndex++];
      p.x = paddingX + gapX * (i + 1);
      p.y = y;
    }
  });
}

export const FORMATIONS: Record<string, FormationSlot[]> = {
  "3-5-2": [ // 3-5-2
    { x: 0.17, y: 0.50, role: 'LB' }, // GK - 1
    { x: 0.26, y: 0.64, role: 'LB' }, // LB - 2
    { x: 0.35, y: 0.50, role: 'LB' }, // LCB - 4
    { x: 0.25, y: 0.50, role: 'LB' }, // RCB - 5
    { x: 0.37, y: 0.35, role: 'LB' }, // RB - 3
    { x: 0.26, y: 0.36, role: 'LB' },  // LCM - 6
    { x: 0.37, y: 0.64, role: 'LB' },  // CM - 8
    { x: 0.47, y: 0.58, role: 'LB' },  // RCM - 10
    { x: 0.40, y: 0.10, role: 'LB' }, // LW - 7
    { x: 0.47, y: 0.42, role: 'LB' },  // ST - 9
    { x: 0.40, y: 0.90, role: 'LB' }  //RW - 11
  ],
  "4-3-3": [ // 4-3-3
    { x: 0.17, y: 0.50, role: 'GK'}, // GK - 1
    { x: 0.29, y: 0.75, role: 'RB' }, // LB - 2
    { x: 0.37, y: 0.37, role: 'DMF' }, // LCB - 4
    { x: 0.25, y: 0.57, role: 'RCB' }, // RCB - 5
    { x: 0.29, y: 0.25, role: 'LB' }, // RB - 3
    { x: 0.25, y: 0.44, role: 'LCB' },  // LCM - 6
    { x: 0.37, y: 0.63, role: 'CM' },  // CM - 8
    { x: 0.39, y: 0.50, role: 'AMF' },  // RCM - 10
    { x: 0.45, y: 0.10, role: 'LW' }, // LW - 7
    { x: 0.47, y: 0.50, role: 'ST' },  // ST - 9
    { x: 0.45, y: 0.90, role: 'RW' }  //RW - 11
  ],
  "4-2-3-1": [ // 4-2-3-1
    { x: 0.17, y: 0.50, role: 'LB' }, // GK - 1
    { x: 0.29, y: 0.75, role: 'LB' }, // LB - 2
    { x: 0.33, y: 0.40, role: 'LB' }, // LCB - 4
    { x: 0.25, y: 0.57, role: 'LB' }, // RCB - 5
    { x: 0.29, y: 0.25, role: 'LB' }, // RB - 3
    { x: 0.25, y: 0.44, role: 'LB' },  // LCM - 6
    { x: 0.33, y: 0.60, role: 'LB' },  // CM - 8
    { x: 0.39, y: 0.50, role: 'LB' },  // RCM - 10
    { x: 0.45, y: 0.10, role: 'LB' }, // LW - 7
    { x: 0.47, y: 0.50, role: 'LB' },  // ST - 9
    { x: 0.45, y: 0.90, role: 'LB' }  //RW - 11
  ],
  "4-4-2": [ //4-4-2
    { x: 0.17, y: 0.50, role: 'GK' }, // GK - 1
    { x: 0.29, y: 0.75, role: 'RB' }, // LB - 2
    { x: 0.36, y: 0.40, role: 'DMF' }, // LCB - 4
    { x: 0.25, y: 0.57, role: 'RCB' }, // RCB - 5
    { x: 0.29, y: 0.25, role: 'LB' }, // RB - 3
    { x: 0.25, y: 0.44, role: 'LCB' },  // LCM - 6
    { x: 0.36, y: 0.60, role: 'CMF' },  // CM - 8
    { x: 0.47, y: 0.58, role: 'SS' },  // RCM - 10
    { x: 0.40, y: 0.10, role: 'LW' }, // LW - 7
    { x: 0.47, y: 0.42, role: 'ST' },  // ST - 9
    { x: 0.40, y: 0.90, role: 'RW' }  //RW - 11
  ],
};


export type FormationType = "4-3-3" | "4-4-2" | "4-2-3-1" | "3-5-2"