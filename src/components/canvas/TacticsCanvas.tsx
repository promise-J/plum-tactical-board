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

export const TacticsCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);
  const awayPlayersRef = useRef<Player[]>([]);
  const homePlayersRef = useRef<Player[]>([]);
  const ballRef = useRef<Ball | null>(null);

  const [selectedFormation, setSelectedFormation] = React.useState<"4-3-3" | "4-4-2" | "4-2-3-1" | "3-5-2">("4-3-3");
  const [selectedHomeFormation, setSelectedHomeFormation] = React.useState<"4-3-3" | "4-4-2" | "4-2-3-1" | "3-5-2">("4-3-3");
  const [selectedAwayFormation, setSelectedAwayFormation] = React.useState<"4-3-3" | "4-4-2" | "4-2-3-1" | "3-5-2">("4-3-3");

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

      const homePlayers = createStartingXI(homeKit, homeGk);
      const awayPlayers = createStartingXI(awayKit, awayGk);
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

      homePlayers.forEach((p) => {
        renderer.addObject(p);
      });
      awayPlayers.forEach((p) => {
        renderer.addObject(p);
      });

      if (!ballRef.current) {
        ballRef.current = new Ball(
          "ball",
          width / 2,
          height / 2
        );

      }
      renderer.addObject(ballRef.current);

      // players.forEach((p) => renderer.addObject(p));
      renderer.setTool(new DragTool(renderer));
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
  }, [tool]);

  useEffect(() => {
    const saved = localStorage.getItem("teamColors");
    if (saved) {
      const c = JSON.parse(saved);
      setHomeKit(c.homeKit);
      setHomeGk(c.homeGk);
      setAwayKit(c.awayKit);
      setAwayGk(c.awayGk);
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
      })
    );
  }, [ready]);

  const handleFormationSelect = (formationKey: FormationType) => {

    //activeTeam
    setSelectedFormation(formationKey);
    if(activeTeam == 'home'){
      setSelectedHomeFormation(formationKey)
    }else{
      setSelectedAwayFormation(formationKey)
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

    if(activeTeam == 'home'){
      setSelectedHomeFormation(formationKey)
      applyFormation(homePlayers, homeFormation, width, height);
    }
    if(activeTeam == 'away'){
      setSelectedAwayFormation(formationKey)
      applyFormation(awayPlayers, awayFormation, width, height);
    }
    renderer.render();
  };

  const handleReset = () => {
    // 1️⃣ Clear saved colors
    setTool('drag')
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

  const handleSetActiveTeam = (team: 'home' | 'away')=>{
    setActiveTeam(team)
    if(team == 'home'){
      setSelectedFormation(selectedHomeFormation)
    }else{
      setSelectedFormation(selectedAwayFormation)
    }
  }

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
          away: awayKit
        }}
        // setSelectedFormation={setSelectedFormation}
      />
      {/* 👇 FORMATION SELECTOR */}
      <SelectFormation onChange={handleFormationSelect} value={selectedFormation} />
      <PitchLayer pitch="full" homeColor={homeKit} awayColor={awayKit} activeTeam={activeTeam} />
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
          onConfirm={() => setReady(true)}
        />
      )}
    </div>
  );
};
