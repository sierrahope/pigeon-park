import { useState } from "react";
import CharacterSelect from "@/components/CharacterSelect";
import GameCanvas from "@/components/GameCanvas";
import { Character } from "@/lib/gameTypes";

const Index = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  if (!selectedCharacter) {
    return <CharacterSelect onSelect={setSelectedCharacter} />;
  }

  return <GameCanvas character={selectedCharacter} onBack={() => setSelectedCharacter(null)} />;
};

export default Index;
