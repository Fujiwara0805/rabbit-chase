"use client";

import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { useAudio } from "@/lib/contexts/audio-context";

export default function SoundToggle() {
  const { toggleSound, isSoundEnabled } = useAudio();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className="fixed bottom-4 right-4 z-50 bg-black/40 text-white hover:bg-black/60 rounded-full p-2 w-10 h-10"
      onClick={toggleSound}
      aria-label={isSoundEnabled ? "サウンドをオフにする" : "サウンドをオンにする"}
    >
      {isSoundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
    </Button>
  );
}
