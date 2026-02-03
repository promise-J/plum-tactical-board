import React, { useState } from "react";
import { LuRectangleHorizontal } from "react-icons/lu";
import { TbExchange } from "react-icons/tb";
import { HiArrowUpRight } from "react-icons/hi2";
import { TiArrowSortedDown } from "react-icons/ti";
import { PiRectangleDashed } from "react-icons/pi";


interface ToolbarProps {
  active: string;
  team: "home" | "away";
  onSelect(tool: string): void;
  onTeamChange(team: "home" | "away"): void;
  onReset(): void;
  // setSelectedFormation(): void;
  teamColor: {
    home: string;
    away: string;
  };
  rectColor: string;
  rectThickness: number;
  onRectColorChange(color: string): void;
  onRectThicknessChange(size: number): void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  active,
  team,
  onSelect,
  onTeamChange,
  onReset,
  teamColor,
  rectColor,
  rectThickness,
  onRectColorChange,
  onRectThicknessChange,
}) => {
  const [rectOpen, setRectOpen] = useState(false);
  const toggleTeam = () => {
    onSelect("drag");
    // setSelectedFormation()
    onTeamChange(team === "home" ? "away" : "home");
  };

  const handleRectClick = () => {
    if (active === "rect") {
      onSelect("drag");
    } else {
      onSelect("rect");
    }
  };
  const handleOpenRectOption = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation()
    setRectOpen((prev) => !prev);
  };


  return (
    <div className="absolute top-3 left-3 z-20 flex gap-5 p-2 border shadow flex-col shadow-green-300 border-green-300 h-[90vh] bg-white rounded-lg">
      {/* Drag Tool */}
      <button
        className={`
        text-lg border-gray-400 rounded-full border w-8.75 h-8.75 cursor-pointer
        transition-all duration-300 transform shadow-sm
        ${
          active === "drag"
            ? "bg-green-200 shadow-md"
            : "hover:bg-gray-100 hover:shadow-md"
        }
        hover:scale-110 active:scale-95
      `}
        onClick={() => onSelect("drag")}
        title="Drag"
      >
        🖐
      </button>

      {/* Arrow Tool */}
      <button
        className={`
        text-lg border-gray-400 rounded-full border w-8.75 h-8.75 cursor-pointer
        transition-all duration-300 transform shadow-sm flex justify-center items-center
        ${
          active === "arrow"
            ? "bg-green-200 shadow-md"
            : "hover:bg-gray-100 hover:shadow-md"
        }
        hover:scale-110 active:scale-95
      `}
        onClick={() => onSelect("arrow")}
        title="Arrow"
      >
        <HiArrowUpRight />
      </button>

      {/* Team Toggle */}
      <button
        className={`
        text-xs font-bold rounded-full w-8.75 h-8.75 cursor-pointer
        transition-all duration-500 transform shadow-lg
        ${team === "home" ? "rotate-0" : "rotate-360"}
        hover:scale-125 active:scale-90
      `}
        style={{
          backgroundColor: team === "home" ? teamColor.home : teamColor.away,
          color: "#fff",
        }}
        onClick={toggleTeam}
        title={`Switch to ${team === "home" ? "Home" : "Away"}`}
      >
        {team === "home" ? "H" : "A"}
      </button>

      {/* Reset */}
      <button
        className={`
        text-lg border-gray-400 rounded-full border w-8.75 h-8.75 cursor-pointer
        transition-all duration-300 transform shadow-sm
        hover:bg-gray-100 hover:shadow-md hover:scale-110 active:scale-95 flex justify-center items-center
      `}
        onClick={onReset}
        title="Reset teams & colors"
      >
        <TbExchange />
      </button>
      {/* group */}
      <button
        className={`
    text-lg border-gray-400 rounded-full border w-8.75 h-8.75 cursor-pointer
    transition-all duration-300 transform shadow-sm
    flex justify-center items-center relative
    hover:bg-gray-100 hover:shadow-md hover:scale-110 active:scale-95
    ${active === "group" ? "bg-green-200 shadow-md" : ""}
  `}
        onClick={()=> onSelect('group')}
        title="group"
      >
        <PiRectangleDashed />
      </button>
      <button
        className={`
    text-lg border-gray-400 rounded-full border w-8.75 h-8.75 cursor-pointer
    transition-all duration-300 transform shadow-sm
    flex justify-center items-center relative
    hover:bg-gray-100 hover:shadow-md hover:scale-110 active:scale-95
    ${active === "rect" ? "bg-green-200 shadow-md" : ""}
  `}
        onClick={handleRectClick}
        title="Rectangle"
      >
        <LuRectangleHorizontal />

        {/* Dropdown caret */}
        <span
          onClick={handleOpenRectOption}
          className={`
      absolute -bottom-1 -right-3.5 text-[10px] transition-transform duration-300
      ${rectOpen ? "rotate-180" : "rotate-0"}
    `}
        >
          <TiArrowSortedDown size={20} />
        </span>
      </button>

      {rectOpen && (
        <div
          className="
              mt-2 p-3 rounded-lg border shadow-lg
              flex flex-col gap-3
              animate-dropdown origin-top bg-white w-30 top-65 absolute
             "
        >
          {/* Color */}
          <div className="flex flex-col gap-1 ">
            <label className="text-xs font-semibold text-gray-600">
              Line color
            </label>
            <input
              type="color"
              value={rectColor}
              onChange={(e) => onRectColorChange(e.target.value)}
              className="w-full h-8 cursor-pointer rounded"
            />
          </div>

          {/* Thickness */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">
              Thickness: {rectThickness}px
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={rectThickness}
              onChange={(e) => onRectThicknessChange(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
