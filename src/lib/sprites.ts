import { Character, TILE_SIZE, SCALE, Pigeon, BreadCrumb } from "./gameTypes";

const S = TILE_SIZE * SCALE; // scaled tile size

export function drawPixelRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, color: string
) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), w, h);
}

// Park map: 0=grass, 1=path, 2=tree, 3=bench, 4=pond, 5=flower, 6=slide, 7=swings, 8=lamppost, 9=fountain
export const PARK_MAP: number[][] = [
  [0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 1, 0, 0, 2, 0, 0, 0, 6, 7, 0],
  [0, 0, 5, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 5, 0, 0, 0],
  [0, 0, 0, 0, 0, 3, 0, 1, 1, 0, 0, 1, 1, 0, 3, 0, 0, 0, 0, 0],
  [0, 8, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [2, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 9, 1, 0, 0, 0, 0, 5, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 5, 0, 0, 0, 8, 0],
  [0, 0, 5, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 3, 0, 0, 1, 1, 1, 1, 0, 0, 3, 0, 0, 0, 5, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [4, 4, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0],
  [4, 4, 4, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
  [4, 4, 4, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 2],
];

function drawGrass(ctx: CanvasRenderingContext2D, x: number, y: number) {
  drawPixelRect(ctx, x, y, S, S, "#a8d8a0");
  const ps = SCALE * 2;
  drawPixelRect(ctx, x + 4 * SCALE, y + 3 * SCALE, ps, ps, "#90c888");
  drawPixelRect(ctx, x + 10 * SCALE, y + 8 * SCALE, ps, ps, "#90c888");
  drawPixelRect(ctx, x + 2 * SCALE, y + 11 * SCALE, ps, ps, "#98d090");
}

function drawPath(ctx: CanvasRenderingContext2D, x: number, y: number) {
  drawPixelRect(ctx, x, y, S, S, "#d4c4a0");
  drawPixelRect(ctx, x + 6 * SCALE, y + 4 * SCALE, 2 * SCALE, 2 * SCALE, "#c8b890");
  drawPixelRect(ctx, x + 2 * SCALE, y + 10 * SCALE, 2 * SCALE, 2 * SCALE, "#c8b890");
}

function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number) {
  drawGrass(ctx, x, y);
  const topY = y - S; // extend one tile upward
  // Trunk (tall)
  drawPixelRect(ctx, x + 6 * SCALE, y, 4 * SCALE, S - 2 * SCALE, "#8b6d4a");
  // Main foliage (in tile above)
  drawPixelRect(ctx, x + 2 * SCALE, topY + 6 * SCALE, 12 * SCALE, 10 * SCALE, "#5a9e50");
  // Upper foliage
  drawPixelRect(ctx, x + 4 * SCALE, topY + 2 * SCALE, 8 * SCALE, 6 * SCALE, "#68b060");
  // Peak
  drawPixelRect(ctx, x + 5 * SCALE, topY, 6 * SCALE, 3 * SCALE, "#78c870");
  // Left side
  drawPixelRect(ctx, x, topY + 8 * SCALE, 4 * SCALE, S - 8 * SCALE, "#68b060");
  // Right side
  drawPixelRect(ctx, x + 12 * SCALE, topY + 8 * SCALE, 4 * SCALE, S - 8 * SCALE, "#68b060");
}

function drawBench(ctx: CanvasRenderingContext2D, x: number, y: number) {
  drawGrass(ctx, x, y);
  drawPixelRect(ctx, x + 2 * SCALE, y + 6 * SCALE, 12 * SCALE, 4 * SCALE, "#a07040");
  drawPixelRect(ctx, x + 3 * SCALE, y + 10 * SCALE, 2 * SCALE, 4 * SCALE, "#805830");
  drawPixelRect(ctx, x + 11 * SCALE, y + 10 * SCALE, 2 * SCALE, 4 * SCALE, "#805830");
  drawPixelRect(ctx, x + 2 * SCALE, y + 4 * SCALE, 12 * SCALE, 2 * SCALE, "#b08050");
}

function drawPond(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Fill full tile with water — no grass gap — so adjacent pond tiles are seamless
  drawPixelRect(ctx, x, y, S, S, "#88c8e8");
  drawPixelRect(ctx, x + 4 * SCALE, y + 5 * SCALE, 6 * SCALE, 2 * SCALE, "#a0d8f0");
  drawPixelRect(ctx, x + 2 * SCALE, y + 10 * SCALE, 4 * SCALE, 1 * SCALE, "#a0d8f0");
}

function drawFlower(ctx: CanvasRenderingContext2D, x: number, y: number) {
  drawGrass(ctx, x, y);
  const colors = ["#e88090", "#e8c060", "#d090d8", "#f0a070"];
  const c = colors[((x + y) * 7) % colors.length];
  drawPixelRect(ctx, x + 7 * SCALE, y + 8 * SCALE, 2 * SCALE, 6 * SCALE, "#60a050");
  drawPixelRect(ctx, x + 5 * SCALE, y + 5 * SCALE, 6 * SCALE, 6 * SCALE, c);
  drawPixelRect(ctx, x + 6 * SCALE, y + 6 * SCALE, 4 * SCALE, 4 * SCALE, "#f0e060");
}

function drawSlide(ctx: CanvasRenderingContext2D, x: number, y: number) {
  drawGrass(ctx, x, y);
  const topY = y - S; // extend structure one tile upward
  // Ladder post (tall)
  drawPixelRect(ctx, x + 2 * SCALE, topY + 2 * SCALE, 2 * SCALE, S + 12 * SCALE, "#c05050");
  // Rungs
  for (let i = 0; i < 10; i++) {
    drawPixelRect(ctx, x + 3 * SCALE, topY + 5 * SCALE + i * 6 * SCALE, 1 * SCALE, 1 * SCALE, "#e0e0e0");
  }
  // Platform at top
  drawPixelRect(ctx, x + 2 * SCALE, topY + 2 * SCALE, 7 * SCALE, 2 * SCALE, "#c05050");
  // Side rail at top
  drawPixelRect(ctx, x + 7 * SCALE, topY + 2 * SCALE, 1 * SCALE, 2 * SCALE, "#c05050");
  // Continuous diagonal slide surface — one row at a time so there are no gaps
  const slideRows = 26; // total height in SCALE units
  const xStart = 7;     // starting x offset (SCALE units from tile x)
  const xEnd = 15;      // ending x offset
  for (let row = 0; row < slideRows; row++) {
    const dx = xStart + Math.round((row * (xEnd - xStart)) / slideRows);
    drawPixelRect(ctx, x + dx * SCALE, topY + (3 + row) * SCALE, 5 * SCALE, SCALE, "#f0d040");
    // Dark edge on leading side for depth
    drawPixelRect(ctx, x + dx * SCALE, topY + (3 + row) * SCALE, SCALE, SCALE, "#c8a030");
  }
}

function drawSwings(ctx: CanvasRenderingContext2D, x: number, y: number) {
  drawGrass(ctx, x, y);
  const topY = y - S; // extend structure one tile upward
  // Top bar
  drawPixelRect(ctx, x + 1 * SCALE, topY + 2 * SCALE, 14 * SCALE, 2 * SCALE, "#c05050");
  // Left pole (tall)
  drawPixelRect(ctx, x + 1 * SCALE, topY + 2 * SCALE, 2 * SCALE, S + 12 * SCALE, "#c05050");
  // Right pole (tall)
  drawPixelRect(ctx, x + 13 * SCALE, topY + 2 * SCALE, 2 * SCALE, S + 12 * SCALE, "#c05050");
  // Chains left swing (longer)
  drawPixelRect(ctx, x + 4 * SCALE, topY + 4 * SCALE, 1 * SCALE, S + 6 * SCALE, "#888");
  drawPixelRect(ctx, x + 6 * SCALE, topY + 4 * SCALE, 1 * SCALE, S + 6 * SCALE, "#888");
  // Seat left
  drawPixelRect(ctx, x + 3 * SCALE, topY + 4 * SCALE + S + 6 * SCALE, 5 * SCALE, 2 * SCALE, "#6090d0");
  // Chains right swing (longer)
  drawPixelRect(ctx, x + 9 * SCALE, topY + 4 * SCALE, 1 * SCALE, S + 6 * SCALE, "#888");
  drawPixelRect(ctx, x + 11 * SCALE, topY + 4 * SCALE, 1 * SCALE, S + 6 * SCALE, "#888");
  // Seat right
  drawPixelRect(ctx, x + 8 * SCALE, topY + 4 * SCALE + S + 6 * SCALE, 5 * SCALE, 2 * SCALE, "#6090d0");
}

function drawLamppost(ctx: CanvasRenderingContext2D, x: number, y: number) {
  drawGrass(ctx, x, y);
  // Pole (tall, extends into tile above)
  drawPixelRect(ctx, x + 7 * SCALE, y - S + 4 * SCALE, 2 * SCALE, S + 10 * SCALE, "#555");
  // Lamp head (at the top, one tile above)
  drawPixelRect(ctx, x + 5 * SCALE, y - S + 2 * SCALE, 6 * SCALE, 3 * SCALE, "#444");
  // Light glow
  drawPixelRect(ctx, x + 6 * SCALE, y - S + 3 * SCALE, 4 * SCALE, 2 * SCALE, "#f8e878");
  // Base
  drawPixelRect(ctx, x + 5 * SCALE, y + 13 * SCALE, 6 * SCALE, 2 * SCALE, "#555");
}

function drawFountain(ctx: CanvasRenderingContext2D, x: number, y: number) {
  drawGrass(ctx, x, y);
  // Fountain is at col 11 (rightmost interior col). Visual center is one tile left (col 10).
  // Pool extends LEFTWARD only — tiles to the right are drawn after and would overwrite rightward extensions.
  const cx = x - S; // visual center x (col 10)
  // Large pool spanning the full path-ring interior (cols 8–11), grey border + water
  drawPixelRect(ctx, cx - 2 * S + 2 * SCALE, y + 4 * SCALE, 4 * S - 4 * SCALE, 10 * SCALE, "#8090a0");
  drawPixelRect(ctx, cx - 2 * S + 3 * SCALE, y + 5 * SCALE, 4 * S - 6 * SCALE, 8 * SCALE, "#88c8e8");
  // Water shimmer (centered)
  drawPixelRect(ctx, cx - 3 * SCALE, y + 7 * SCALE, 10 * SCALE, 2 * SCALE, "#a0d8f0");
  // Tall pillar centered at cx
  drawPixelRect(ctx, cx - 2 * SCALE, y - 8 * SCALE, 4 * SCALE, 14 * SCALE, "#9090a0");
  // Top basin
  drawPixelRect(ctx, cx - 5 * SCALE, y - 10 * SCALE, 10 * SCALE, 3 * SCALE, "#8090a0");
  drawPixelRect(ctx, cx - 4 * SCALE, y - 12 * SCALE, 8 * SCALE, 3 * SCALE, "#88c8e8");
  // Water spray (animated)
  const t = Math.sin(Date.now() / 300);
  const sprayH = 4 + Math.floor(t * 2);
  drawPixelRect(ctx, cx - SCALE, y - (12 + sprayH) * SCALE, 2 * SCALE, (sprayH + 1) * SCALE, "#a0d8f0");
}

const TILE_DRAWERS = [drawGrass, drawPath, drawTree, drawBench, drawPond, drawFlower, drawSlide, drawSwings, drawLamppost, drawFountain];

export function drawPark(ctx: CanvasRenderingContext2D) {
  for (let row = 0; row < PARK_MAP.length; row++) {
    for (let col = 0; col < PARK_MAP[row].length; col++) {
      const tile = PARK_MAP[row][col];
      TILE_DRAWERS[tile](ctx, col * S, row * S);
    }
  }
}

// ---- NPC types ----
export interface NPC {
  pos: { x: number; y: number };
  direction: number;
  moveTimer: number;
  targetPos: { x: number; y: number };
  animFrame: number;
  animCounter: number;
  type: "person" | "kid" | "dog_walker";
  colors: { skin: string; hair: string; shirt: string; pants: string };
  dogColor?: string;
}

function drawMiniPerson(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  colors: { skin: string; hair: string; shirt: string; pants: string },
  direction: number, animFrame: number, isKid: boolean
) {
  const s = SCALE;
  const bobY = animFrame % 2 === 0 ? 0 : -s;
  const sizeM = isKid ? 0.7 : 1;
  const oY = isKid ? 5 * s : 0;

  // Shadow
  drawPixelRect(ctx, x + 3 * s, y + 14 * s, 10 * s, 2 * s, "rgba(0,0,0,0.1)");

  // Feet
  drawPixelRect(ctx, x + 4 * s, y + (12 + (isKid ? 2 : 0)) * s, 3 * s, 2 * s, "#6b5040");
  drawPixelRect(ctx, x + 9 * s, y + (12 + (isKid ? 2 : 0)) * s, 3 * s, 2 * s, "#6b5040");

  // Pants
  drawPixelRect(ctx, x + 4 * s, y + oY + 9 * s + bobY, 8 * s, Math.floor(4 * sizeM) * s, colors.pants);

  // Body
  drawPixelRect(ctx, x + 3 * s, y + oY + 5 * s + bobY, 10 * s, Math.floor(5 * sizeM) * s, colors.shirt);

  // Head
  drawPixelRect(ctx, x + 4 * s, y + oY + 0 * s + bobY, 8 * s, 6 * s, colors.skin);

  // Hair
  drawPixelRect(ctx, x + 3 * s, y + oY + 0 * s + bobY, 10 * s, 3 * s, colors.hair);

  // Eyes
  if (direction === 0 || direction === 3) {
    drawPixelRect(ctx, x + 5 * s, y + oY + 3 * s + bobY, 2 * s, 2 * s, "#333");
    drawPixelRect(ctx, x + 9 * s, y + oY + 3 * s + bobY, 2 * s, 2 * s, "#333");
  } else if (direction === 1) {
    drawPixelRect(ctx, x + 5 * s, y + oY + 3 * s + bobY, 2 * s, 2 * s, "#333");
  } else {
    drawPixelRect(ctx, x + 9 * s, y + oY + 3 * s + bobY, 2 * s, 2 * s, "#333");
  }
}

function drawDog(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  color: string, direction: number, animFrame: number
) {
  const s = SCALE;
  const bobY = animFrame % 2 === 0 ? 0 : -s;

  // Shadow
  drawPixelRect(ctx, x + 1 * s, y + 10 * s, 10 * s, 2 * s, "rgba(0,0,0,0.1)");

  // Body
  drawPixelRect(ctx, x + 2 * s, y + 5 * s + bobY, 8 * s, 5 * s, color);

  // Head
  const headX = direction === 1 ? x - 1 * s : x + 6 * s;
  drawPixelRect(ctx, headX, y + 3 * s + bobY, 6 * s, 5 * s, color);

  // Ear
  const earX = direction === 1 ? headX + 1 * s : headX + 4 * s;
  const darkerColor = adjustColor(color, -20);
  drawPixelRect(ctx, earX, y + 2 * s + bobY, 2 * s, 3 * s, darkerColor);

  // Eye
  const eyeX = direction === 1 ? headX + 1 * s : headX + 4 * s;
  drawPixelRect(ctx, eyeX, y + 4 * s + bobY, 1 * s, 1 * s, "#222");

  // Nose
  const noseX = direction === 1 ? headX : headX + 5 * s;
  drawPixelRect(ctx, noseX, y + 6 * s + bobY, 1 * s, 1 * s, "#333");

  // Legs
  const legAnim = animFrame % 2 === 0 ? 0 : 1 * s;
  drawPixelRect(ctx, x + 2 * s, y + 9 * s, 2 * s, 3 * s + legAnim, color);
  drawPixelRect(ctx, x + 8 * s, y + 9 * s, 2 * s, 3 * s - legAnim + s, color);

  // Tail
  const tailX = direction === 1 ? x + 10 * s : x;
  const tailWag = Math.sin(Date.now() / 150) * s;
  drawPixelRect(ctx, tailX, y + 4 * s + bobY + tailWag, 2 * s, 2 * s, color);
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export function drawNPC(ctx: CanvasRenderingContext2D, npc: NPC) {
  const x = npc.pos.x * SCALE;
  const y = npc.pos.y * SCALE;
  const moving = Math.hypot(npc.targetPos.x - npc.pos.x, npc.targetPos.y - npc.pos.y) > 1;
  const frame = moving ? npc.animFrame : 0;

  if (npc.type === "kid") {
    drawMiniPerson(ctx, x, y, npc.colors, npc.direction, frame, true);
  } else if (npc.type === "dog_walker") {
    drawMiniPerson(ctx, x, y, npc.colors, npc.direction, frame, false);
    // Dog walks slightly behind/beside
    const dogOffX = npc.direction === 1 ? 14 : -14;
    drawDog(ctx, x + dogOffX * SCALE, y + 2 * SCALE, npc.dogColor || "#8b6d4a", npc.direction, frame);
  } else {
    drawMiniPerson(ctx, x, y, npc.colors, npc.direction, frame, false);
  }
}

export function updateNPC(npc: NPC) {
  npc.animCounter++;
  if (npc.animCounter % 12 === 0) npc.animFrame++;

  npc.moveTimer--;
  if (npc.moveTimer <= 0) {
    npc.moveTimer = Math.random() * 200 + 80;
    const randX = npc.pos.x + (Math.random() - 0.5) * TILE_SIZE * 4;
    const randY = npc.pos.y + (Math.random() - 0.5) * TILE_SIZE * 4;
    const tx = Math.floor(randX / TILE_SIZE);
    const ty = Math.floor(randY / TILE_SIZE);
    if (isWalkable(tx, ty)) {
      npc.targetPos = { x: randX, y: randY };
    }
  }

  const dx = npc.targetPos.x - npc.pos.x;
  const dy = npc.targetPos.y - npc.pos.y;
  const dist = Math.hypot(dx, dy);
  if (dist > 1) {
    npc.pos.x += (dx / dist) * 0.4;
    npc.pos.y += (dy / dist) * 0.4;
    if (Math.abs(dx) > Math.abs(dy)) {
      npc.direction = dx < 0 ? 1 : 2;
    } else {
      npc.direction = dy < 0 ? 3 : 0;
    }
  }
}

export function createNPCs(): NPC[] {
  return [
    // Dog walkers
    {
      pos: { x: 2 * TILE_SIZE, y: 3 * TILE_SIZE }, targetPos: { x: 2 * TILE_SIZE, y: 3 * TILE_SIZE },
      direction: 2, moveTimer: 60, animFrame: 0, animCounter: 0,
      type: "dog_walker",
      colors: { skin: "#f0c8a0", hair: "#4a3520", shirt: "#5080b0", pants: "#404050" },
      dogColor: "#c8a060", // light brown dog!
    },
    {
      pos: { x: 16 * TILE_SIZE, y: 9 * TILE_SIZE }, targetPos: { x: 16 * TILE_SIZE, y: 9 * TILE_SIZE },
      direction: 1, moveTimer: 100, animFrame: 0, animCounter: 0,
      type: "dog_walker",
      colors: { skin: "#d4a070", hair: "#222", shirt: "#d06060", pants: "#3a3a50" },
      dogColor: "#555", // dark grey dog
    },
    {
      pos: { x: 13 * TILE_SIZE, y: 12 * TILE_SIZE }, targetPos: { x: 13 * TILE_SIZE, y: 12 * TILE_SIZE },
      direction: 0, moveTimer: 140, animFrame: 0, animCounter: 0,
      type: "dog_walker",
      colors: { skin: "#e8c090", hair: "#8b4020", shirt: "#50a060", pants: "#505068" },
      dogColor: "#f0f0f0", // white fluffy dog
    },
    // Kids near playground
    {
      pos: { x: 17 * TILE_SIZE, y: 2 * TILE_SIZE }, targetPos: { x: 17 * TILE_SIZE, y: 2 * TILE_SIZE },
      direction: 0, moveTimer: 40, animFrame: 0, animCounter: 0,
      type: "kid",
      colors: { skin: "#f5c6a0", hair: "#e8a030", shirt: "#e06080", pants: "#6080c0" },
    },
    {
      pos: { x: 18 * TILE_SIZE, y: 3 * TILE_SIZE }, targetPos: { x: 18 * TILE_SIZE, y: 3 * TILE_SIZE },
      direction: 1, moveTimer: 70, animFrame: 0, animCounter: 0,
      type: "kid",
      colors: { skin: "#d4a574", hair: "#333", shirt: "#40b070", pants: "#8070a0" },
    },
    {
      pos: { x: 16 * TILE_SIZE, y: 3 * TILE_SIZE }, targetPos: { x: 16 * TILE_SIZE, y: 3 * TILE_SIZE },
      direction: 2, moveTimer: 50, animFrame: 0, animCounter: 0,
      type: "kid",
      colors: { skin: "#e8c99b", hair: "#c06030", shirt: "#4090d0", pants: "#505050" },
    },
    // Random people walking around
    {
      pos: { x: 6 * TILE_SIZE, y: 11 * TILE_SIZE }, targetPos: { x: 6 * TILE_SIZE, y: 11 * TILE_SIZE },
      direction: 0, moveTimer: 90, animFrame: 0, animCounter: 0,
      type: "person",
      colors: { skin: "#f0d5b8", hair: "#7a4020", shirt: "#c8a060", pants: "#505a68" },
    },
    {
      pos: { x: 11 * TILE_SIZE, y: 2 * TILE_SIZE }, targetPos: { x: 11 * TILE_SIZE, y: 2 * TILE_SIZE },
      direction: 2, moveTimer: 120, animFrame: 0, animCounter: 0,
      type: "person",
      colors: { skin: "#d4a574", hair: "#1a1a2e", shirt: "#a06090", pants: "#3a4050" },
    },
  ];
}

export function drawCharacter(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  character: Character,
  direction: number,
  animFrame: number,
  scale: number = SCALE
) {
  const s = scale;
  const { skin, hair, shirt, pants } = character.colors;
  const bobY = animFrame % 2 === 0 ? 0 : -s;

  drawPixelRect(ctx, x + 2 * s, y + 14 * s, 12 * s, 2 * s, "rgba(0,0,0,0.15)");

  const footOffset = animFrame % 2 === 0 ? 0 : 2 * s;
  drawPixelRect(ctx, x + 4 * s, y + 12 * s + footOffset, 3 * s, 2 * s, "#6b5040");
  drawPixelRect(ctx, x + 9 * s, y + 12 * s - footOffset + (animFrame % 2) * 2 * s, 3 * s, 2 * s, "#6b5040");

  drawPixelRect(ctx, x + 4 * s, y + 9 * s + bobY, 8 * s, 4 * s, pants);
  drawPixelRect(ctx, x + 3 * s, y + 5 * s + bobY, 10 * s, 5 * s, shirt);

  if (direction === 1) {
    drawPixelRect(ctx, x + 1 * s, y + 5 * s + bobY, 2 * s, 5 * s, shirt);
  } else if (direction === 2) {
    drawPixelRect(ctx, x + 13 * s, y + 5 * s + bobY, 2 * s, 5 * s, shirt);
  } else {
    drawPixelRect(ctx, x + 1 * s, y + 6 * s + bobY, 2 * s, 4 * s, skin);
    drawPixelRect(ctx, x + 13 * s, y + 6 * s + bobY, 2 * s, 4 * s, skin);
  }

  drawPixelRect(ctx, x + 4 * s, y + 0 * s + bobY, 8 * s, 6 * s, skin);
  drawPixelRect(ctx, x + 3 * s, y + 0 * s + bobY, 10 * s, 3 * s, hair);
  if (direction === 1) {
    drawPixelRect(ctx, x + 3 * s, y + 0 * s + bobY, 3 * s, 5 * s, hair);
  } else if (direction === 2) {
    drawPixelRect(ctx, x + 10 * s, y + 0 * s + bobY, 3 * s, 5 * s, hair);
  }

  if (direction === 0 || direction === 3) {
    drawPixelRect(ctx, x + 5 * s, y + 3 * s + bobY, 2 * s, 2 * s, "#333");
    drawPixelRect(ctx, x + 9 * s, y + 3 * s + bobY, 2 * s, 2 * s, "#333");
  } else if (direction === 1) {
    drawPixelRect(ctx, x + 5 * s, y + 3 * s + bobY, 2 * s, 2 * s, "#333");
  } else {
    drawPixelRect(ctx, x + 9 * s, y + 3 * s + bobY, 2 * s, 2 * s, "#333");
  }
}

export function drawPigeon(
  ctx: CanvasRenderingContext2D,
  pigeon: Pigeon,
  scale: number = SCALE
) {
  const s = scale;
  const { pos, direction, pecking, fed, colorType } = pigeon;
  const x = pos.x * scale;
  const y = pos.y * scale;

  const palettes = {
    grey:  { body: "#9898a8", head: "#a8a8b8", detail: "#80a098", tail: "#808898" },
    brown: { body: "#8b6d4a", head: "#9b7d5a", detail: "#d8d8d8", tail: "#705538" },
    white: { body: "#dcdce8", head: "#ebebf2", detail: "#9060c0", tail: "#c4c4d0" },
  };
  const p = palettes[colorType ?? "grey"];

  drawPixelRect(ctx, x + 1 * s, y + 9 * s, 8 * s, 2 * s, "rgba(0,0,0,0.1)");

  const bodyY = pecking ? 2 * s : 0;

  drawPixelRect(ctx, x + 2 * s, y + 4 * s + bodyY, 7 * s, 5 * s, p.body);

  const headX = direction === 1 ? x : x + (pecking ? 1 * s : 0);
  const headY = y + (pecking ? 5 * s : 1 * s);
  drawPixelRect(ctx, headX + 1 * s, headY, 5 * s, 4 * s, p.head);

  drawPixelRect(ctx, headX + (direction === 1 ? 2 : 4) * s, headY + 1 * s, 1 * s, 1 * s, "#222");

  const beakX = direction === 1 ? headX : headX + 5 * s;
  drawPixelRect(ctx, beakX, headY + 2 * s, 2 * s, 1 * s, "#e8a040");

  drawPixelRect(ctx, x + 3 * s, y + 3 * s + bodyY, 3 * s, 2 * s, p.detail);

  const tailX = direction === 1 ? x + 8 * s : x;
  drawPixelRect(ctx, tailX, y + 3 * s + bodyY, 2 * s, 3 * s, p.tail);

  drawPixelRect(ctx, x + 3 * s, y + 9 * s, 1 * s, 2 * s, "#d08040");
  drawPixelRect(ctx, x + 6 * s, y + 9 * s, 1 * s, 2 * s, "#d08040");

  if (fed && pigeon.feedTimer > 0) {
    const heartY = y - 4 * s + Math.sin(Date.now() / 200) * 2 * s;
    drawPixelRect(ctx, x + 2 * s, heartY, 2 * s, 2 * s, "#e86080");
    drawPixelRect(ctx, x + 5 * s, heartY, 2 * s, 2 * s, "#e86080");
    drawPixelRect(ctx, x + 1 * s, heartY + 1 * s, 8 * s, 2 * s, "#e86080");
    drawPixelRect(ctx, x + 2 * s, heartY + 3 * s, 6 * s, 1 * s, "#e86080");
    drawPixelRect(ctx, x + 3 * s, heartY + 4 * s, 4 * s, 1 * s, "#e86080");
    drawPixelRect(ctx, x + 4 * s, heartY + 5 * s, 2 * s, 1 * s, "#e86080");
  }
}

export function drawBread(ctx: CanvasRenderingContext2D, crumb: BreadCrumb) {
  const x = crumb.pos.x * SCALE;
  const y = crumb.pos.y * SCALE;
  drawPixelRect(ctx, x, y, 3 * SCALE, 3 * SCALE, "#d4a050");
  drawPixelRect(ctx, x + SCALE, y + SCALE, SCALE, SCALE, "#e8c070");
}

export function isWalkable(tileX: number, tileY: number): boolean {
  if (tileX < 0 || tileX >= 20 || tileY < 0 || tileY >= 15) return false;
  const tile = PARK_MAP[tileY][tileX];
  return tile === 0 || tile === 1 || tile === 5;
}
