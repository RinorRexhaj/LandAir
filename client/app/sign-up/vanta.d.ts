declare module "vanta/dist/vanta.halo.min" {
  import { VantaEffectOptions, VantaEffectInstance } from "vanta/types";
  const HALO: (options: VantaEffectOptions) => VantaEffectInstance;
  export default HALO;
}

declare module "vanta/types" {
  import * as THREE from "three";

  export interface VantaEffectOptions {
    el: HTMLElement;
    THREE: typeof THREE;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    color?: number;
    shininess?: number;
    baseColor?: number;
    backgroundColor?: number;
    amplitudeFactor?: number;
    waveSpeed?: number;
    size?: number;
  }

  export interface VantaEffectInstance {
    destroy: () => void;
    setOptions: (options: Partial<VantaEffectOptions>) => void;
  }
}
