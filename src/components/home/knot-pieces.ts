import type * as Three from 'three';

type THREE = typeof Three;

export interface KnotPiece {
  piece: Three.Mesh;
  center: Three.Vector3;
  direction: Three.Vector3;
}

const COUNT = 12;
const RADIAL = 32;

/** Split a torus knot into twelve contiguous solid tube sections. Assembled,
 *  they read as the original smooth knot; each cut is closed with a flat face
 *  so separated pieces stay solid. */
export function buildKnotPieces(THREE: THREE, material: Three.Material) {
  const source = new THREE.TorusKnotGeometry(1.18, 0.38, 240, RADIAL, 2, 3);
  const flat = source.toNonIndexed();
  const group = new THREE.Group();
  const pieces: KnotPiece[] = [];
  const verticesPerPiece = flat.attributes.position.count / COUNT;
  const ringsPerPiece = 240 / COUNT;
  const vertexAt = (index: number) => new THREE.Vector3().fromBufferAttribute(source.attributes.position, index);
  const ringCenter = (ring: number) => {
    const value = new THREE.Vector3();
    for (let j = 0; j < RADIAL; j++) value.add(vertexAt(ring * (RADIAL + 1) + j));
    return value.divideScalar(RADIAL);
  };

  for (let i = 0; i < COUNT; i++) {
    const geometry = new THREE.BufferGeometry();
    for (const name of ['position', 'normal', 'uv']) {
      const attribute = flat.attributes[name] as Three.BufferAttribute;
      const size = attribute.itemSize;
      geometry.setAttribute(
        name,
        new THREE.BufferAttribute(attribute.array.slice(i * verticesPerPiece * size, (i + 1) * verticesPerPiece * size), size)
      );
    }
    geometry.computeBoundingBox();
    const center = geometry.boundingBox!.getCenter(new THREE.Vector3());
    geometry.translate(-center.x, -center.y, -center.z);

    const capPositions: number[] = [];
    const capNormals: number[] = [];
    for (const side of [0, 1]) {
      const ring = i * ringsPerPiece + (side ? ringsPerPiece : 0);
      const mid = ringCenter(ring);
      const normal = mid.clone().sub(ringCenter(ring + (side ? -1 : 1))).normalize();
      for (let j = 0; j < RADIAL; j++) {
        let b = vertexAt(ring * (RADIAL + 1) + j);
        let c = vertexAt(ring * (RADIAL + 1) + j + 1);
        if (b.clone().sub(mid).cross(c.clone().sub(mid)).dot(normal) < 0) [b, c] = [c, b];
        for (const vertex of [mid, b, c]) {
          capPositions.push(vertex.x - center.x, vertex.y - center.y, vertex.z - center.z);
          capNormals.push(normal.x, normal.y, normal.z);
        }
      }
    }
    const extras: [string, ArrayLike<number>][] = [
      ['position', capPositions],
      ['normal', capNormals],
      ['uv', new Float32Array((capPositions.length / 3) * 2)],
    ];
    for (const [name, extra] of extras) {
      const attribute = geometry.attributes[name] as Three.BufferAttribute;
      const array = new Float32Array(attribute.array.length + extra.length);
      array.set(attribute.array as Float32Array);
      array.set(extra, attribute.array.length);
      geometry.setAttribute(name, new THREE.BufferAttribute(array, attribute.itemSize));
    }
    geometry.computeBoundingSphere();

    const piece = new THREE.Mesh(geometry, material);
    piece.position.copy(center);
    const direction = center.clone().normalize().multiplyScalar(0.85);
    direction.z += i % 2 === 0 ? 0.5 : -0.5;
    pieces.push({ piece, center, direction });
    group.add(piece);
  }
  source.dispose();
  flat.dispose();
  return { group, pieces };
}
