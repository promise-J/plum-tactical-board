import React from "react";

interface Props {
  homeKit: string;
  setHomeKit: (c: string) => void;
  homeGk: string;
  setHomeGk: (c: string) => void;
  awayKit: string;
  setAwayKit: (c: string) => void;
  awayGk: string;
  setAwayGk: (c: string) => void;
  onConfirm: () => void;
}

export const TeamSetupModal: React.FC<Props> = ({
  homeKit,
  setHomeKit,
  homeGk,
  setHomeGk,
  awayKit,
  setAwayKit,
  awayGk,
  setAwayGk,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white p-6 rounded-lg w-[320px] space-y-4">
        <h2 className="text-lg font-bold">Match Setup</h2>

        <div>
          <h3 className="font-semibold">Home Team</h3>
          <input
            type="color"
            value={homeKit}
            onChange={(e) => setHomeKit(e.target.value)}
          />
          <span className="ml-2 text-sm">Outfield</span>

          <div className="mt-2">
            <input
              type="color"
              value={homeGk}
              onChange={(e) => setHomeGk(e.target.value)}
            />
            <span className="ml-2 text-sm">Goalkeeper</span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Away Team</h3>
          <input
            type="color"
            value={awayKit}
            onChange={(e) => setAwayKit(e.target.value)}
          />
          <span className="ml-2 text-sm">Outfield</span>

          <div className="mt-2">
            <input
              type="color"
              value={awayGk}
              onChange={(e) => setAwayGk(e.target.value)}
            />
            <span className="ml-2 text-sm">Goalkeeper</span>
          </div>
        </div>

        <button
          className="w-full bg-green-600 text-white py-2 rounded"
          onClick={onConfirm}
        >
          Start Tactics Board
        </button>
      </div>
    </div>
  );
};
