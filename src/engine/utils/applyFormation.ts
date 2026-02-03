import { Player } from "../objects/Player";

export interface FormationSlot {
  x: number; // normalized 0 → 1 (left → right)
  y: number; // normalized 0 → 1 (top → bottom)
  role: string;
  name?: string;
}

export function applyFormation(
  players: Player[],
  formation: FormationSlot[],
  width: number,
  height: number
) {
  const paddingX = width * 0.05; // 5% padding
  const paddingY = height * 0.05;
  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingY * 2;

  formation?.forEach((slot, i) => {
    const player = players[i];
    if (!player) return;

    player.x = paddingX + slot.x * usableWidth;
    player.y = paddingY + slot.y * usableHeight;
    player.role = slot.role
  });
}

export function mirrorFormation(formation: FormationSlot[]): FormationSlot[] {
    return formation?.map(slot => ({
      x: 1 - slot.x,
      y: slot.y,
      role: slot.role
    }));
  }

  export const ROLE_LABELS: Record<string, string> = {
    GK: "GK",
    RB: "RB",
    LB: "LB",
    CB: "CB",
    DM: "DM",
    CM: "CM",
    AMF: "AM",
    RW: "RW",
    LW: "LW",
    ST: "ST",
  };