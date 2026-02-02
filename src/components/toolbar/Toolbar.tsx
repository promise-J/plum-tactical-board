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
}

export const Toolbar: React.FC<ToolbarProps> = ({
  active,
  team,
  onSelect,
  onTeamChange,
  onReset,
  teamColor,
  // setSelectedFormation
}) => {
  const toggleTeam = () => {
    onSelect("drag");
    // setSelectedFormation()
    onTeamChange(team === "home" ? "away" : "home");
  };

  return (
    <div className="absolute top-3 left-3 z-20 flex gap-5 p-2 border shadow flex-col shadow-green-300 border-green-300 h-[90vh] bg-white rounded-lg">
    {/* Drag Tool */}
    <button
      className={`
        text-lg border-gray-400 rounded-full border w-8.75 h-8.75 cursor-pointer
        transition-all duration-300 transform shadow-sm
        ${active === "drag" ? "bg-green-200 shadow-md" : "hover:bg-gray-100 hover:shadow-md"}
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
        transition-all duration-300 transform shadow-sm
        ${active === "arrow" ? "bg-green-200 shadow-md" : "hover:bg-gray-100 hover:shadow-md"}
        hover:scale-110 active:scale-95
      `}
      onClick={() => onSelect("arrow")}
      title="Arrow"
    >
      ➡
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
        hover:bg-gray-100 hover:shadow-md hover:scale-110 active:scale-95
      `}
      onClick={onReset}
      title="Reset teams & colors"
    >
      🔄
    </button>
  </div>
  
  );
};
