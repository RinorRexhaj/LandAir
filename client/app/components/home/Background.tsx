import { useVanta } from "@/app/hooks/useVanta";

const Background = () => {
  const vantaRef = useVanta<HTMLDivElement>({
    baseColor: 0x0ff,
    backgroundColor: 0x000000,
  });

  return (
    <div
      ref={vantaRef}
      className="fixed inset-0 w-screen h-screen overflow-hidden -z-10 opacity-80"
    >
      <div
        className="absolute inset-0 bg-black/5"
        style={{
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
        }}
      />
    </div>
  );
};

export default Background;
