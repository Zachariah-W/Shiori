import { Player } from "@lottiefiles/react-lottie-player";
import { AnimationItem } from "lottie-web";
import React, { useState } from "react";

export default function LogoAnimation({
  src,
  ...props
}: { src: object } & React.ComponentProps<"div">) {
  const [player, setPlayer] = useState<AnimationItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAnimationComplete = () => {
    if (player) {
      setIsPlaying(false);
      player.stop();
    }
  };

  return (
    <div
      onClick={() => {
        if (player) {
          setIsPlaying(true);
          player.play();
        }
      }}
      onMouseLeave={() => !isPlaying && handleAnimationComplete()}
      className="flex items-center gap-0.5"
      id="lottie"
      {...props}
    >
      <Player
        lottieRef={(intance) => setPlayer(intance)}
        autoplay={false}
        loop={false}
        src={src}
        style={{
          width: "1em",
          height: "1em",
        }}
        speed={1.3}
        onEvent={(event) => event === "complete" && handleAnimationComplete()}
      />
      {props.children}
    </div>
  );
}