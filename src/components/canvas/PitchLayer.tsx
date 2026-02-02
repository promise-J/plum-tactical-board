// src/components/canvas/PitchLayer.tsx
import React from "react";
import { AiOutlineTeam } from "react-icons/ai";

interface PitchLayerProps {
  pitch: "full" | "half";
  homeColor: string;
  awayColor: string;
  activeTeam: string;
}

export const PitchLayer: React.FC<PitchLayerProps> = ({
  pitch,
  homeColor,
  awayColor,
  activeTeam,
}) => {
  const src =
    pitch === "half" ? "/pitch/half-pitch.svg" : "/pitch/full-pitch.svg";

  return (
    <>
      <div
        style={{ zIndex: 10 }}
        className="absolute top-0.5 left-[25%] text-gray-300 w-[50%] m-auto flex justify-around font-bold"
      >
        <p
          className={`p-1 ${
            activeTeam === "home" ? "animate-pulse" : ""
          } rounded-md text-lg font-bold`}
          style={{
            background: `${homeColor}`,
            // backgroundColor: 'white'
            // WebkitBackgroundClip: "text",
            // WebkitTextFillColor: "transparent",
          }}
        >
          <AiOutlineTeam cursor='pointer' title="Home team" />
        </p>
        <p
          className={`p-1 ${
            activeTeam === "away" ? "animate-pulse" : ""
          } rounded-md text-lg font-bold`}
          style={{
            background: `${awayColor}`,
            // WebkitBackgroundClip: "text",
            // WebkitTextFillColor: "transparent",
          }}
        >
          <AiOutlineTeam cursor='pointer' title="Away team" />
        </p>
      </div>
      <img
        src={src}
        alt="Football Pitch"
        className="pitch-layer"
        draggable={false}
        style={{ width: "100%", height: "100%" }}
      />
    </>
  );
};
