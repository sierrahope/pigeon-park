import { useRef, useEffect, useCallback, useState } from "react";
import {
  Character, Pigeon, Player, BreadCrumb,
  TILE_SIZE, SCALE, CANVAS_WIDTH, CANVAS_HEIGHT,
  PARK_WIDTH, PARK_HEIGHT,
} from "@/lib/gameTypes";
import { drawPark, drawCharacter, drawPigeon, drawBread, isWalkable, NPC, drawNPC, updateNPC, createNPCs } from "@/lib/sprites";

interface GameCanvasProps {
  character: Character;
  onBack: () => void;
}

function createPigeons(): Pigeon[] {
  const pigeons: Pigeon[] = [];
  const colorTypes: Array<"grey" | "brown" | "white"> = ["grey", "brown", "white"];
  const spots = [
    { x: 3, y: 5 }, { x: 15, y: 3 }, { x: 12, y: 8 },
    { x: 7, y: 12 }, { x: 16, y: 11 }, { x: 2, y: 9 },
    { x: 14, y: 6 }, { x: 10, y: 13 },
    { x: 5, y: 1 }, { x: 18, y: 12 }, { x: 4, y: 13 }, { x: 17, y: 8 },
  ];
  spots.forEach((spot, i) => {
    if (isWalkable(spot.x, spot.y)) {
      pigeons.push({
        id: i,
        pos: { x: spot.x * TILE_SIZE, y: spot.y * TILE_SIZE },
        targetPos: { x: spot.x * TILE_SIZE, y: spot.y * TILE_SIZE },
        fed: false,
        feedTimer: 0,
        direction: Math.random() > 0.5 ? 1 : 2,
        moveTimer: Math.random() * 120 + 60,
        pecking: false,
        peckTimer: 0,
        colorType: colorTypes[i % 3],
      });
    }
  });
  return pigeons;
}

const GameCanvas = ({ character, onBack }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const gameStateRef = useRef<{
    player: Player;
    pigeons: Pigeon[];
    breadCrumbs: BreadCrumb[];
    npcs: NPC[];
    lastTime: number;
    animCounter: number;
  }>({
    player: {
      pos: { x: 9 * TILE_SIZE, y: 7 * TILE_SIZE },
      direction: 0,
      moving: false,
      breadCount: 10,
      fedCount: 0,
      animFrame: 0,
    },
    pigeons: createPigeons(),
    breadCrumbs: [],
    npcs: createNPCs(),
    lastTime: 0,
    animCounter: 0,
  });
  const [breadCount, setBreadCount] = useState(10);
  const [fedCount, setFedCount] = useState(0);
  const [totalPigeons] = useState(() => gameStateRef.current.pigeons.length);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    keysRef.current.add(e.key.toLowerCase());
    if (e.key === " ") {
      e.preventDefault();
      const state = gameStateRef.current;
      if (state.player.breadCount > 0) {
        state.player.breadCount--;
        const dir = state.player.direction;
        const offsets = [
          { x: 0, y: TILE_SIZE },
          { x: -TILE_SIZE, y: 0 },
          { x: TILE_SIZE, y: 0 },
          { x: 0, y: -TILE_SIZE },
        ];
        state.breadCrumbs.push({
          pos: {
            x: state.player.pos.x + offsets[dir].x,
            y: state.player.pos.y + offsets[dir].y,
          },
          timer: 300,
        });
        setBreadCount(state.player.breadCount);
      }
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysRef.current.delete(e.key.toLowerCase());
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const SPEED = 1.5;

    function update() {
      const state = gameStateRef.current;
      const keys = keysRef.current;
      const player = state.player;

      let dx = 0, dy = 0;
      player.moving = false;

      if (keys.has("arrowup") || keys.has("w")) { dy = -SPEED; player.direction = 3; player.moving = true; }
      if (keys.has("arrowdown") || keys.has("s")) { dy = SPEED; player.direction = 0; player.moving = true; }
      if (keys.has("arrowleft") || keys.has("a")) { dx = -SPEED; player.direction = 1; player.moving = true; }
      if (keys.has("arrowright") || keys.has("d")) { dx = SPEED; player.direction = 2; player.moving = true; }

      if (dx !== 0 && dy !== 0) {
        dx *= 0.707;
        dy *= 0.707;
      }

      const newX = player.pos.x + dx;
      const newY = player.pos.y + dy;
      const tileX = Math.floor((newX + TILE_SIZE / 2) / TILE_SIZE);
      const tileY = Math.floor((newY + TILE_SIZE / 2) / TILE_SIZE);

      if (isWalkable(tileX, tileY)) {
        player.pos.x = Math.max(0, Math.min(newX, (PARK_WIDTH - 1) * TILE_SIZE));
        player.pos.y = Math.max(0, Math.min(newY, (PARK_HEIGHT - 1) * TILE_SIZE));
      }

      state.animCounter++;
      if (state.animCounter % 10 === 0 && player.moving) {
        player.animFrame++;
      }

      // Update pigeons
      state.pigeons.forEach((pigeon) => {
        if (pigeon.feedTimer > 0) pigeon.feedTimer--;
        if (pigeon.peckTimer > 0) {
          pigeon.peckTimer--;
          pigeon.pecking = pigeon.peckTimer > 0;
        }

        state.breadCrumbs.forEach((crumb, i) => {
          const dist = Math.hypot(pigeon.pos.x - crumb.pos.x, pigeon.pos.y - crumb.pos.y);
          if (dist < TILE_SIZE * 2) {
            pigeon.targetPos = { ...crumb.pos };
          }
          if (dist < TILE_SIZE * 0.5) {
            pigeon.pecking = true;
            pigeon.peckTimer = 30;
            if (!pigeon.fed) {
              pigeon.fed = true;
              pigeon.feedTimer = 120;
              state.player.fedCount++;
              setFedCount(state.player.fedCount);
            }
            state.breadCrumbs.splice(i, 1);
          }
        });

        pigeon.moveTimer--;
        if (pigeon.moveTimer <= 0) {
          pigeon.moveTimer = Math.random() * 180 + 60;
          const randX = pigeon.pos.x + (Math.random() - 0.5) * TILE_SIZE * 3;
          const randY = pigeon.pos.y + (Math.random() - 0.5) * TILE_SIZE * 3;
          const checkTX = Math.floor(randX / TILE_SIZE);
          const checkTY = Math.floor(randY / TILE_SIZE);
          if (isWalkable(checkTX, checkTY)) {
            pigeon.targetPos = { x: randX, y: randY };
          }
        }

        const tdx = pigeon.targetPos.x - pigeon.pos.x;
        const tdy = pigeon.targetPos.y - pigeon.pos.y;
        const tdist = Math.hypot(tdx, tdy);
        if (tdist > 1) {
          pigeon.pos.x += (tdx / tdist) * 0.5;
          pigeon.pos.y += (tdy / tdist) * 0.5;
          pigeon.direction = tdx < 0 ? 1 : 2;
        }

      });

      // Update NPCs
      state.npcs.forEach(updateNPC);

      state.breadCrumbs.forEach((c) => c.timer--);
      state.breadCrumbs = state.breadCrumbs.filter((c) => c.timer > 0);

      if (state.animCounter % 300 === 0 && state.player.breadCount < 15) {
        state.player.breadCount++;
        setBreadCount(state.player.breadCount);
      }
    }

    function draw() {
      if (!ctx) return;
      const state = gameStateRef.current;

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      drawPark(ctx);

      state.breadCrumbs.forEach((crumb) => drawBread(ctx, crumb));

      state.pigeons.forEach((pigeon) => drawPigeon(ctx, pigeon));

      // Draw NPCs
      state.npcs.forEach((npc) => drawNPC(ctx, npc));

      drawCharacter(
        ctx,
        state.player.pos.x * SCALE,
        state.player.pos.y * SCALE,
        character,
        state.player.direction,
        state.player.moving ? state.player.animFrame : 0,
        4
      );
    }

    function gameLoop() {
      update();
      draw();
      animId = requestAnimationFrame(gameLoop);
    }

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [character]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-2 gap-3">
      <div className="flex items-center justify-between w-full max-w-[960px] px-2">
        <button onClick={onBack} className="text-[8px] text-muted-foreground hover:text-foreground transition-colors">
          ← Back
        </button>
        <h2 className="text-xs text-foreground">🐦 Pigeon Park</h2>
        <div className="text-[8px] text-muted-foreground">
          {character.name}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-2 border-border rounded-sm max-w-full"
        style={{ imageRendering: "pixelated", maxHeight: "70vh", aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}` }}
      />

      <div className="flex gap-6 text-[8px] text-foreground">
        <span>🍞 Bread: {breadCount}</span>
        <span>💜 Fed: {fedCount}/{totalPigeons}</span>
      </div>

      <div className="text-[7px] text-muted-foreground text-center">
        Arrow keys / WASD to move • Space to drop bread
      </div>
    </div>
  );
};

export default GameCanvas;
