import { buildKnotPieces } from './knot-pieces';
import { choreography } from './motion-state';

export interface SceneHandle {
  render(time: number): void;
  invalidate(): void;
  dispose(): void;
}

const FRAME = 1 / 35; // ~35 fps is plenty for a slow sculpture and saves battery
const MAX_PIXEL_RATIO = 1.65;

/** One WebGL renderer for the hero sculpture and the 3D chapter. The canvas host
 *  is created here (not owned by React) and moved between two empty slots. */
export async function createScene(root: HTMLElement, isCancelled: () => boolean): Promise<SceneHandle | null> {
  const THREE = await import('three');
  // Strict Mode / fast unmount: never build a second WebGL context for a dead effect.
  if (isCancelled()) return null;
  const heroSlot = root.querySelector<HTMLElement>('[data-scene-slot="hero"]')!;
  const stageSlot = root.querySelector<HTMLElement>('[data-scene-slot="stage"]')!;
  const sculpture = root.querySelector<HTMLElement>('#sculpture')!;
  const connection = root.querySelector<HTMLElement>('.connection')!;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
  renderer.setClearColor(0, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  const host = document.createElement('div');
  host.className = 'scene-host';
  host.appendChild(renderer.domElement);
  heroSlot.appendChild(host);
  try {
    return buildScene();
  } catch (error) {
    renderer.dispose();
    renderer.forceContextLoss();
    host.remove();
    throw error;
  }

  function buildScene(): SceneHandle {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    // Soft studio environment baked once into a PMREM map for the metal reflections.
    const environment = new THREE.Scene();
    environment.background = new THREE.Color('#b5ad94');
    const panels: [string, number, number, number, number, number, number, number][] = [
      ['#ffffff', 5, 0, 4, 1, 8, 1, 6],
      ['#fff0d5', 3, -4, 0, 3, 1, 6, 8],
      ['#3b3421', 0.3, 3, 0, 0, 2, 8, 8],
      ['#ffffff', 3, 1, -3, 2, 6, 1, 4],
      ['#151710', 0.2, 0, 0, -5, 8, 8, 1],
    ];
    for (const [color, intensity, x, y, z, sx, sy, sz] of panels) {
      const panel = new THREE.Mesh(
        new THREE.BoxGeometry(sx, sy, sz),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide })
      );
      panel.position.set(x, y, z);
      environment.add(panel);
    }
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envMap = pmrem.fromScene(environment, 0.05);
    scene.environment = envMap.texture;
    pmrem.dispose();
    environment.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        o.material.dispose();
      }
    });

    scene.add(new THREE.HemisphereLight('#fff3d8', '#282719', 2.5));
    const key = new THREE.DirectionalLight('#ffffff', 4);
    key.position.set(-3, 4, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight('#f6e1a6', 3);
    rim.position.set(5, -2, 2);
    scene.add(rim);

    const material = new THREE.MeshPhysicalMaterial({
      color: '#dab660',
      metalness: 0.89,
      roughness: 0.25,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      envMapIntensity: 1.4,
    });
    const { group: mesh, pieces } = buildKnotPieces(THREE, material);
    mesh.rotation.set(0.25, -0.3, -0.6);
    scene.add(mesh);

    let lastRender = 0;
    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      // setSize clears the canvas; reduced mode only draws on demand.
      lastRender = 0;
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    let visible = true;
    const visibility = new IntersectionObserver((entries) => (visible = entries[0].isIntersecting), { rootMargin: '100px' });
    visibility.observe(host);

    const pointer = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 0.3;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 0.15;
    };
    document.addEventListener('pointermove', onPointer, { passive: true });

    let mode: 'hero' | 'stage' = 'hero';
    const moveTo = (next: typeof mode) => {
      mode = next;
      (next === 'stage' ? stageSlot : heroSlot).appendChild(host);
      connection.dataset.scene = next;
      resize();
    };

    const render = (time: number) => {
      const { reduced } = choreography;
      const inStage = choreography.stageActive && !reduced;
      if (inStage !== (mode === 'stage')) moveTo(inStage ? 'stage' : 'hero');
      if ((!visible && !inStage) || document.hidden || (reduced && lastRender)) return;
      if (time - lastRender < FRAME) return;

      const scroll = window.scrollY / window.innerHeight;
      const progress = choreography.stageProgress;
      const phase = THREE.MathUtils.clamp((progress - 0.1) / 0.8, 0, 1);
      // Pieces drift apart through the middle of the chapter and lock back together at the end.
      const explode = inStage ? Math.pow(Math.sin(phase * Math.PI), 1.8) : 0;
      pieces.forEach(({ piece, center, direction }, i) => {
        piece.position.copy(center).addScaledVector(direction, explode * 1.9);
        piece.rotation.set(explode * Math.sin(i * 2) * 0.6, explode * Math.cos(i * 2) * 0.6, explode * (i % 2 ? 0.35 : -0.35));
      });
      camera.position.z = inStage ? 10.2 + explode * 2.6 : 7.8;
      mesh.rotation.y = -0.3 + (reduced ? 0 : inStage ? progress * Math.PI * 1.7 + pointer.x : time * 0.14 + scroll * 0.7 + pointer.x);
      mesh.rotation.x = 0.25 + (reduced ? 0 : Math.sin(time * 0.22) * 0.12 + pointer.y);
      mesh.rotation.z = -0.6 + (reduced ? 0 : inStage ? progress * 0.6 : scroll * 0.25);
      mesh.position.y = reduced ? 0 : Math.sin(time * 0.8) * 0.065;
      renderer.render(scene, camera);
      lastRender = time;
    };

    resize();
    render(1);
    sculpture.dataset.webgl = 'ready';

    return {
      render,
      invalidate: () => (lastRender = 0),
      dispose() {
        document.removeEventListener('pointermove', onPointer);
        resizeObserver.disconnect();
        visibility.disconnect();
        pieces.forEach(({ piece }) => piece.geometry.dispose());
        material.dispose();
        envMap.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        host.remove();
        delete sculpture.dataset.webgl;
        delete connection.dataset.scene;
      },
    };
  }
}
