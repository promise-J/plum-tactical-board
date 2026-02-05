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
  homePlayerNames: string[];
  setHomePlayerNames: (names: string[]) => void;
  awayPlayerNames: string[];
  setAwayPlayerNames: (names: string[]) => void;
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
  homePlayerNames,
  awayPlayerNames,
  setHomePlayerNames,
  setAwayPlayerNames,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-[600px] max-h-[80vh] overflow-y-auto space-y-6 shadow-lg">
        <h2 className="text-xl font-bold text-center text-gray-800">
          Match Setup
        </h2>

        {/* Home Team Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-700">Home Team</h3>
          <div className="flex items-center space-x-4">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Outfield Kit</label>
              <input
                type="color"
                value={homeKit}
                onChange={(e) => setHomeKit(e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">
                Goalkeeper Kit
              </label>
              <input
                type="color"
                value={homeGk}
                onChange={(e) => setHomeGk(e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Away Team Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-700">Away Team</h3>
          <div className="flex items-center space-x-4">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Outfield Kit</label>
              <input
                type="color"
                value={awayKit}
                onChange={(e) => setAwayKit(e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">
                Goalkeeper Kit
              </label>
              <input
                type="color"
                value={awayGk}
                onChange={(e) => setAwayGk(e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Home Team Player Names */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-700">
            Home Team Player Names
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {homePlayerNames.map(
              (
                name,
                i // <-- Now 16
              ) => (
                <div key={i} className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">
                    Player {i + 1}
                  </label>
                  <input
                    type="text"
                    placeholder={`Player ${i + 1}`}
                    value={name}
                    onChange={(e) => {
                      const newNames = [...homePlayerNames];
                      newNames[i] = e.target.value;
                      setHomePlayerNames(newNames);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )
            )}
          </div>
        </div>

        {/* Away Team Player Names */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-700">
            Away Team Player Names
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {awayPlayerNames.map(
              (
                name,
                i // <-- Now 16
              ) => (
                <div key={i} className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-1">
                    Player {i + 1}
                  </label>
                  <input
                    type="text"
                    placeholder={`Player ${i + 1}`}
                    value={name}
                    onChange={(e) => {
                      const newNames = [...awayPlayerNames];
                      newNames[i] = e.target.value;
                      setAwayPlayerNames(newNames);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )
            )}
          </div>
        </div>

        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold transition-colors"
          onClick={onConfirm}
        >
          Start Tactics Board
        </button>
      </div>
    </div>
  );
};
