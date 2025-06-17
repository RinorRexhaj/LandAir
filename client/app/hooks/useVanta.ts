// hooks/useVantaBackground.ts
import { useEffect, useRef } from "react";
import * as THREE from "three";
import HALO from "vanta/dist/vanta.halo.min";
import type { VantaEffectInstance } from "vanta/types";

interface VantaOptions {
  baseColor?: number;
  backgroundColor?: number;
  amplitudeFactor?: number;
  waveSpeed?: number;
  size?: number;
}

export function useVanta<T extends HTMLElement>(options: VantaOptions = {}) {
  const vantaRef = useRef<T | null>(null);
  const vantaEffect = useRef<VantaEffectInstance | null>(null);

  useEffect(() => {
    if (!vantaRef.current) return;
    if (!vantaEffect.current) {
      vantaEffect.current = HALO({
        el: vantaRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        ...options,
      });
    }

    return () => {
      vantaEffect.current?.destroy();
      vantaEffect.current = null;
    };
  }, [options]);

  return vantaRef;
}
