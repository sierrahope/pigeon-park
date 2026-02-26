export interface Position {
  x: number;
  y: number;
}

export interface Character {
  id: string;
  name: string;
  colors: {
    skin: string;
    hair: string;
    shirt: string;
    pants: string;
  };
}

export interface Pigeon {
  id: number;
  pos: Position;
  targetPos: Position;
  fed: boolean;
  feedTimer: number;
  direction: number; // 0=down, 1=left, 2=right, 3=up
  moveTimer: number;
  pecking: boolean;
  peckTimer: number;
  colorType: "grey" | "brown" | "white";
}

export interface Player {
  pos: Position;
  direction: number;
  moving: boolean;
  breadCount: number;
  fedCount: number;
  animFrame: number;
}

export interface BreadCrumb {
  pos: Position;
  timer: number;
}

export const TILE_SIZE = 16;
export const SCALE = 3;
export const PARK_WIDTH = 20;
export const PARK_HEIGHT = 15;
export const CANVAS_WIDTH = PARK_WIDTH * TILE_SIZE * SCALE;
export const CANVAS_HEIGHT = PARK_HEIGHT * TILE_SIZE * SCALE;

export const CHARACTERS: Character[] = [
  {
    id: "red",
    name: "Ruby",
    colors: { skin: "#f5c6a0", hair: "#8b3a3a", shirt: "#e86b6b", pants: "#5b7db1" },
  },
  {
    id: "blue",
    name: "Sky",
    colors: { skin: "#e8c99b", hair: "#3a5a8b", shirt: "#6bb5e8", pants: "#7b6b5b" },
  },
  {
    id: "green",
    name: "Fern",
    colors: { skin: "#d4a574", hair: "#2d5a2d", shirt: "#6bc77b", pants: "#8b7355" },
  },
  {
    id: "purple",
    name: "Plum",
    colors: { skin: "#f0d5b8", hair: "#6b3a8b", shirt: "#b86be8", pants: "#555555" },
  },
];
