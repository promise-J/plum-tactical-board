// src/components/canvas/TacticsCanvas.tsx
import React, { useEffect, useRef, useState } from "react";
import { PitchLayer } from "./PitchLayer";
import { CanvasRenderer } from "../../engine/renderer/CanvasRenderer";
import { Player } from "../../engine/objects/Player";
import { ArrowTool } from "../../engine/tools/ArrowTool";
import "../../styles/canvas.css";
import { DragTool } from "../../engine/tools/DragTool";
import { Toolbar } from "../toolbar/Toolbar";
import { createStartingXI } from "../../engine/data/squad";
import {
  applyFormation,
  mirrorFormation,
} from "../../engine/utils/applyFormation";
import { FORMATIONS, type FormationType } from "../../engine/data/formations";
import SelectFormation from "../ui/SelectFormation";
import { TeamSetupModal } from "../ui/TeamSetupModal";
import { Ball } from "../../engine/objects/Ball";
import { RectangleTool } from "../../engine/tools/RectangleTool";
import { RectangleSelectTool } from "../../engine/tools/RectangleSelectTool";
import { GroupSelectTool } from "../../engine/tools/GroupSelectTool";

export const TacticsCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);
  const awayPlayersRef = useRef<Player[]>([]);
  const homePlayersRef = useRef<Player[]>([]);
  const ballRef = useRef<Ball | null>(null);

  const [selectedFormation, setSelectedFormation] = React.useState<
    "4-3-3" | "4-4-2" | "4-2-3-1" | "3-5-2"
  >("4-3-3");
  const [selectedHomeFormation, setSelectedHomeFormation] = React.useState<
    "4-3-3" | "4-4-2" | "4-2-3-1" | "3-5-2"
  >("4-3-3");
  const [selectedAwayFormation, setSelectedAwayFormation] = React.useState<
    "4-3-3" | "4-4-2" | "4-2-3-1" | "3-5-2"
  >("4-3-3");

  const [homePlayerNames, setHomePlayerNames] = useState<string[]>(
    Array(11).fill("")
  ); // 11 players
  const [awayPlayerNames, setAwayPlayerNames] = useState<string[]>(
    Array(11).fill("")
  );

  const [rectColor, setRectColor] = useState("#FF0000");
  const [rectThickness, setRectThickness] = useState(1);

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null); // <-- NEW: Track selected player
  const [editName, setEditName] = useState(""); // <-- NEW: For editing name
  const [editNumber, setEditNumber] = useState(1); // <-- NEW: For editing number

  const [tool, setTool] = useState("drag");
  const [activeTeam, setActiveTeam] = useState<"home" | "away">("home");

  const [homeKit, setHomeKit] = useState<string>("#000");
  const [awayKit, setAwayKit] = useState<string>("#000");

  const [homeGk, setHomeGk] = useState<string>("#000");
  const [awayGk, setAwayGk] = useState<string>("#000");

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const renderer = new CanvasRenderer(canvasRef.current);
    rendererRef.current = renderer;

    const resize = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      renderer.resize(rect.width, rect.height);
    };

    requestAnimationFrame(() => {
      resize();

      const homePlayers = createStartingXI('home', homeKit, homeGk, homePlayerNames);
      const awayPlayers = createStartingXI('away', awayKit, awayGk, awayPlayerNames);
      homePlayersRef.current = homePlayers;
      awayPlayersRef.current = awayPlayers;

      const width = containerRef.current!.clientWidth;
      const height = containerRef.current!.clientHeight;

      if (width === 0 || height === 0) return;

      const homeFormation = FORMATIONS[selectedFormation];
      const awayFormation = mirrorFormation(FORMATIONS[selectedFormation]);
      if (width > 0 && height > 0) {
        applyFormation(homePlayers, homeFormation, width, height);
        applyFormation(awayPlayers, awayFormation, width, height);
      }

       // Position extras (subs) near keepers' end
       homePlayers.slice(11, 16).forEach((p, idx) => {
        p.x = 525;  // Center of field
        p.y = 600 + idx * 40;  // Stacked vertically near bottom (home keeper's end)
      });
      awayPlayers.slice(11, 16).forEach((p, idx) => {
        p.x = 190;  // Center of field
        p.y = 90 + idx * 40;  // Stacked vertically near top (away keeper's end)
      });

      homePlayers.forEach((p) => {
        renderer.addObject(p);
      });
      awayPlayers.forEach((p) => {
        renderer.addObject(p);
      });

      if (!ballRef.current) {
        ballRef.current = new Ball("ball", width / 2, height / 2);
      }
      renderer.addObject(ballRef.current);

      // players.forEach((p) => renderer.addObject(p));
      renderer.setTool(new DragTool(renderer));

      renderer.setOnPlayerSelect(handlePlayerSelect);
      renderer.setOnModalCancel(() => {
        // <-- NEW: Reset tool on cancel
        renderer.setTool(new DragTool(renderer)); // Or whatever default tool
        setSelectedPlayer(null);
      });

      if (activeTeam == "home") {
        applyFormation(homePlayers.slice(0, 11), homeFormation, width, height);
        // Reposition home extras
        homePlayers.slice(11, 16).forEach((p, idx) => {
          p.x = 190;
          // p.x = 525;
          // p.y = 600 + idx * 40;
          p.y = 90 + idx * 40;
        });
      }
      if (activeTeam == "away") {
        applyFormation(awayPlayers.slice(0, 11), awayFormation, width, height);
        // Reposition away extras
        awayPlayers.slice(11, 16).forEach((p, idx) => {
          p.x = 525;
          p.y = 40 + idx * 40;
        });
      }

      renderer.render();
    });

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [ready]);

  useEffect(() => {
    const r = rendererRef.current;
    if (!r) return;

    if (tool === "drag") r.setTool(new DragTool(r));
    if (tool === "arrow") r.setTool(new ArrowTool(r));
    if (tool === "group") r.setTool(new GroupSelectTool(r));
    if (tool === "rect")
      r.setTool(new RectangleTool(r, rectColor, rectThickness));
    if (tool === "rect-select")
      r.setTool(new RectangleSelectTool(r, rectColor, rectThickness));
  }, [tool, rectColor, rectThickness]);

  useEffect(() => {
    const saved = localStorage.getItem("teamColors");
    if (saved) {
      const c = JSON.parse(saved);
      setHomeKit(c.homeKit || "#000");
      setHomeGk(c.homeGk || "#000");
      setAwayKit(c.awayKit || "#000");
      setAwayGk(c.awayGk || "#000");
      setHomePlayerNames(c.homePlayerNames || Array(11).fill(""));
      setAwayPlayerNames(c.awayPlayerNames || Array(11).fill(""));
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(
      "teamColors",
      JSON.stringify({
        homeKit: homeKit,
        homeGk: homeGk,
        awayKit: awayKit,
        awayGk: awayGk,
        homePlayerNames: homePlayerNames,
        awayPlayerNames: awayPlayerNames,
      })
    );
  }, [ready, homePlayerNames, awayPlayerNames]);

  // NEW: Handle player selection and editing
  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayer(player);
    setEditName(player.name || "");
    setEditNumber(player.number);
  };


// src/components/canvas/TacticsCanvas.tsx
// ... (existing code)

const handleSavePlayerEdit = () => {
  if (!selectedPlayer) return;

  // const allPlayers = [...homePlayersRef.current, ...awayPlayersRef.current];
  const originalNumber = selectedPlayer.number;
  const numberChanged = editNumber !== originalNumber;

  // FIXED: Only check uniqueness if the number changed (no need to exclude selectedPlayer when reverting)
  const isHomePlayer = homePlayersRef.current.some(p => p.id === selectedPlayer.id);
  const teamPlayers = isHomePlayer ? homePlayersRef.current : awayPlayersRef.current;
  const isNumberTaken = teamPlayers.some(p => p !== selectedPlayer && p.number === editNumber);
  // const isNumberTaken = numberChanged && allPlayers.some(p => p !== selectedPlayer && p.number === editNumber);

  if (editNumber <= 0 || isNumberTaken) {
    console.log({editNumber, isNumberTaken, originalNumber})
    alert(`Number must be positive${numberChanged ? " and unique" : ""}!`);
    return;
  }

  // Update the selectedPlayer directly
  selectedPlayer.name = editName.trim();
  selectedPlayer.number = editNumber;

  // Sync the refs (for both home and away)
  const homeIndex = homePlayersRef.current.findIndex(p => p.id === selectedPlayer.id);
  if (homeIndex !== -1) {
    homePlayersRef.current[homeIndex] = selectedPlayer;
  } else {
    const awayIndex = awayPlayersRef.current.findIndex(p => p.id === selectedPlayer.id);
    if (awayIndex !== -1) {
      awayPlayersRef.current[awayIndex] = selectedPlayer;
    } else {
      // Optional: Handle error if needed
    }
  }

  // Force re-sync of renderer objects with updated refs (to prevent stale objects)
  const renderer = rendererRef.current;
  if (renderer) {
    renderer.clear();  // Clear objects
    homePlayersRef.current.forEach(p => renderer.addObject(p));
    awayPlayersRef.current.forEach(p => renderer.addObject(p));
    if (ballRef.current) renderer.addObject(ballRef.current);
  }

  // FIXED: Reset the highlight before closing
  selectedPlayer.isSelected = false;

  setSelectedPlayer(null);
};

// ... (rest of the component)

// ... (rest of the component)

  // const handleSavePlayerEdit = () => {
  //   if (!selectedPlayer) return;

  //   // Validate number (must be 1-11 and unique)
  //   const allPlayers = [...homePlayersRef.current, ...awayPlayersRef.current];
  //   const isNumberTaken = allPlayers.some(p => p !== selectedPlayer && p.number === editNumber);
  //   if (editNumber < 1 || editNumber > 11 || isNumberTaken) {
  //     alert("Number must be between 1-11 and unique!");
  //     return;
  //   }

  //   // Update player
  //   selectedPlayer.name = editName;
  //   selectedPlayer.number = editNumber;
  //   rendererRef.current?.render();  // Re-render canvas

  //   // Close modal
  //   setSelectedPlayer(null);
  // };

  const handleFormationSelect = (formationKey: FormationType) => {
    //activeTeam
    setSelectedFormation(formationKey);
    if (activeTeam == "home") {
      setSelectedHomeFormation(formationKey);
    } else {
      setSelectedAwayFormation(formationKey);
    }

    const renderer = rendererRef.current;
    const homePlayers = homePlayersRef.current;
    const awayPlayers = awayPlayersRef.current;

    if (!renderer || homePlayers.length === 0) return;
    if (!renderer || awayPlayers.length === 0) return;

    const width = containerRef.current!.clientWidth;
    const height = containerRef.current!.clientHeight;
    if (width === 0 || height === 0) return;

    const homeFormation = FORMATIONS[formationKey];
    const awayFormation = mirrorFormation(FORMATIONS[formationKey]);

    if (activeTeam == "home") {
      setSelectedHomeFormation(formationKey);
      applyFormation(homePlayers, homeFormation, width, height);
    }
    if (activeTeam == "away") {
      setSelectedAwayFormation(formationKey);
      applyFormation(awayPlayers, awayFormation, width, height);
    }
    renderer.render();
  };

  const handleReset = () => {
    // 1️⃣ Clear saved colors
    setTool("drag");
    localStorage.removeItem("teamColors");

    // 2️⃣ Reset color state (optional defaults)
    setHomeKit("#000");
    setHomeGk("#000");
    setAwayKit("#000");
    setAwayGk("#000");

    // 3️⃣ Reset team + tool if you want
    setActiveTeam("home");
    setTool("drag");

    // 4️⃣ Destroy current canvas state
    rendererRef.current?.clear(); // if you have this
    rendererRef.current = null;

    // 5️⃣ Re-open setup modal
    setReady(false);
  };

  const handleSetActiveTeam = (team: "home" | "away") => {
    setActiveTeam(team);
    if (team == "home") {
      setSelectedFormation(selectedHomeFormation);
    } else {
      setSelectedFormation(selectedAwayFormation);
    }
  };

  return (
    <div ref={containerRef} className="tactics-container">
      <Toolbar
        onReset={handleReset}
        active={tool}
        onSelect={setTool}
        onTeamChange={handleSetActiveTeam}
        team={activeTeam}
        teamColor={{
          home: homeKit,
          away: awayKit,
        }}
        rectColor={rectColor}
        rectThickness={rectThickness}
        onRectColorChange={setRectColor}
        onRectThicknessChange={setRectThickness}
        // setSelectedFormation={setSelectedFormation}
      />
      {/* 👇 FORMATION SELECTOR */}
      <SelectFormation
        onChange={handleFormationSelect}
        value={selectedFormation}
      />
      <PitchLayer
        pitch="full"
        homeColor={homeKit}
        awayColor={awayKit}
        activeTeam={activeTeam}
      />
      <canvas ref={canvasRef} className="tactics-canvas" />
      {!ready && (
        <TeamSetupModal
          homeKit={homeKit}
          setHomeKit={setHomeKit}
          homeGk={homeGk}
          setHomeGk={setHomeGk}
          awayKit={awayKit}
          setAwayKit={setAwayKit}
          awayGk={awayGk}
          setAwayGk={setAwayGk}
          homePlayerNames={homePlayerNames}
          awayPlayerNames={awayPlayerNames}
          setHomePlayerNames={setHomePlayerNames}
          setAwayPlayerNames={setAwayPlayerNames}
          onConfirm={() => setReady(true)}
        />
      )}

      {/* NEW: Edit Player Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-100 space-y-4 shadow-lg">
            <h2 className="text-lg font-bold">
              Edit Player (Double-click to open)
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter player name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number (positive, unique)
              </label>
              <input
                type="number"
                min="1"
                value={editNumber}
                onChange={(e) => setEditNumber(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleSavePlayerEdit}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setSelectedPlayer(null);
                  rendererRef.current?.triggerModalCancel?.(); // <-- NEW: Trigger reset
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-md font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
