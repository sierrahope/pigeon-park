import { Character, CHARACTERS } from "@/lib/gameTypes";
import { drawCharacter } from "@/lib/sprites";
import { useRef, useEffect } from "react";

interface CharacterSelectProps {
  onSelect: (character: Character) => void;
}

const CharacterSelect = ({ onSelect }: CharacterSelectProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <h1 className="text-2xl md:text-3xl text-foreground mb-2 text-center leading-relaxed">
        🐦 Pigeon Park 🐦
      </h1>
      <p className="text-xs text-muted-foreground mb-8 text-center">
        Choose your character
      </p>
      <div className="grid grid-cols-2 gap-6 mb-8">
        {CHARACTERS.map((char) => (
          <CharacterCard key={char.id} character={char} onSelect={onSelect} />
        ))}
      </div>
      <div className="text-[8px] text-muted-foreground text-center space-y-1">
        <p>Arrow keys / WASD to move</p>
        <p>Space to drop bread for pigeons</p>
      </div>
    </div>
  );
};

function CharacterCard({ character, onSelect }: { character: Character; onSelect: (c: Character) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 64, 64);
    drawCharacter(ctx, 8, 8, character, 0, 0, 3);
  }, [character]);

  return (
    <button
      onClick={() => onSelect(character)}
      className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card border-2 border-border hover:border-primary transition-colors cursor-pointer group"
    >
      <canvas
        ref={canvasRef}
        width={64}
        height={64}
        className="pixelated group-hover:animate-bounce-small"
        style={{ imageRendering: "pixelated" }}
      />
      <span className="text-[10px] text-card-foreground">{character.name}</span>
    </button>
  );
}

export default CharacterSelect;
