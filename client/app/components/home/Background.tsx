import { useVanta } from "@/app/hooks/useVanta";

const Background = () => {
  const vantaRef = useVanta<HTMLDivElement>({
    baseColor: 0x4466aa, // A calm blue
    backgroundColor: 0x0a0a0a, // Near-black background
    amplitudeFactor: 0.2, // Very gentle wave intensity
    waveSpeed: 0.4, // Slower motion
  });

  return (
    <div
      ref={vantaRef}
      className="fixed inset-0 w-screen h-screen overflow-hidden -z-10 opacity-80"
    ></div>
  );
};

export default Background;
