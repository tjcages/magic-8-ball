import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import * as THREE from 'three'
import { Canvas, extend, useFrame, useLoader } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  Lightformer,
  Effects,
  MeshTransmissionMaterial,
  RenderTexture,
  Text,
  PerspectiveCamera,
} from '@react-three/drei'
import { LUTPass, LUTCubeLoader } from 'three-stdlib'
import { useControls } from 'leva'
import { easing } from 'maath'

extend({ LUTPass })

function Grading() {
  const { texture3D } = useLoader(LUTCubeLoader, '/cubicle-99.CUBE')
  return (
    <Effects>
      <lUTPass lut={texture3D} intensity={1} />
    </Effects>
  )
}

function Triangle({ holding }) {
  const ref = useRef()
  useEffect(() => {
    console.log(holding)
    if (!ref.current) return
    if (holding) {
      gsap.to(ref.current.position, {
        z: 0,
        duration: 1,
        ease: 'expo.inOut',
        overwrite: true,
      })
      gsap.to(ref.current.rotation, {
        x: Math.PI,
        z: Math.PI,
        duration: 1,
        ease: 'expo.inOut',
        overwrite: true,
      })
      gsap.to(ref.current.material, {
        opacity: 0,
        duration: 1,
        ease: 'expo.inOut',
        overwrite: true,
      })
    } else {
      gsap.to(ref.current.position, {
        z: -0.53,
        // opacity: 1,
        duration: 2,
        ease: 'expo.inOut',
      })
      gsap.to(ref.current.rotation, {
        x: Math.PI / 4,
        y: 0,
        z: Math.PI / 4,
        // opacity: 0,
        duration: 2,
        ease: 'expo.inOut',
      })
      gsap.to(ref.current.material, {
        opacity: 1,
        duration: 3,
        delay: 0,
        ease: 'expo.inOut',
      })
    }
  }, [holding])

  return (
    <mesh ref={ref} position={[0, 0, -0.83]} rotation={[-Math.PI / 4, 0, Math.PI / 4]}>
      <tetrahedronGeometry args={[0.225]} />
      {/* <dodecahedronGeometry args={[0.225]} /> */}
      <meshPhysicalMaterial color="orange" roughness={1} metalness={0.5} opacity={1} transparent>
        <RenderTexture attach="map" anisotropy={16}>
          <PerspectiveCamera makeDefault manual aspect={1 / 1} position={[0, 0, 7]} />
          <color attach="background" args={['orange']} />
          <ambientLight intensity={5} />
          <group position={[-0.5, 0.5, 0]} rotation={[0, 0, Math.PI / 3]}>
            <Text fontSize={0.5} color="#000" anchorX="center" rotation={[0, 0, 0]} position={[-1, 0, 0]}>
              We're so
            </Text>
            <Text fontSize={0.5} color="#000" anchorX="center" rotation={[0, 0, 0]} position={[-1, -0.5, 0]}>
              back
            </Text>
          </group>
        </RenderTexture>
      </meshPhysicalMaterial>
    </mesh>
  )
}

function Sphere(props) {
  const config = useControls({
    meshPhysicalMaterial: false,
    transmissionSampler: false,
    backside: false,
    samples: { value: 10, min: 1, max: 32, step: 1 },
    resolution: { value: 2048, min: 256, max: 2048, step: 256 },
    transmission: { value: 1, min: 0, max: 1 },
    roughness: { value: 0.13, min: 0, max: 1, step: 0.01 },
    thickness: { value: 3.5, min: 0, max: 10, step: 0.01 },
    ior: { value: 0, min: 1, max: 5, step: 0.01 },
    chromaticAberration: { value: 0.06, min: 0, max: 1 },
    anisotropy: { value: 1, min: 0, max: 1, step: 0.01 },
    distortion: { value: 1.0, min: 0, max: 1, step: 0.01 },
    distortionScale: { value: 0.6, min: 0.01, max: 1, step: 0.01 },
    temporalDistortion: { value: 0.5, min: 0, max: 1, step: 0.01 },
    clearcoat: { value: 1, min: 0, max: 1 },
    attenuationDistance: { value: 3.0, min: 0, max: 10, step: 0.01 },
    attenuationColor: '#ffffff',
    color: 'orange',
    bg: '#000',
  })
  return (
    <mesh {...props}>
      <sphereGeometry args={[1, 64, 64]} />
      {config.meshPhysicalMaterial ? (
        <meshPhysicalMaterial {...config} />
      ) : (
        <MeshTransmissionMaterial background={new THREE.Color(config.bg)} {...config} />
      )}
      {/* <meshPhysicalMaterial transmission={1} samples={6} resolution={512} thickness={-1} anisotropy={0.25} /> */}
      {/* <meshPhysicalMaterial color='black' clearcoat={1} clearcoatRoughness={0} roughness={0} metalness={0} transmission={1} /> */}
    </mesh>
  )
}

function CameraRig() {
  useFrame((state, delta) => {
    easing.damp3(state.camera.position, [-1 + (state.pointer.x * state.viewport.width) / 3, (1 + state.pointer.y) / 2, -5.5], 0.5, delta)
    state.camera.lookAt(0, 0, 0)
  })
}

export default function App() {
  const [holding, set] = useState(false)
  return (
    <Canvas
      // frameloop="demand"
      camera={{ position: [0, 0, 5], fov: 45 }}
      onPointerDown={() => !holding && set(true)}
      onPointerUp={() => holding && set(false)}
      onPointerOut={() => holding && set(false)}>
      <color attach="background" args={['#15151a']} />
      <ambientLight />
      <spotLight intensity={0.5} angle={0.2} penumbra={1} position={[5, 15, 10]} />
      <Sphere />
      <Triangle holding={holding} />
      <Grading />
      <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/blue_photo_studio_1k.hdr" resolution={512} blur={0}>
        <group>
          <Lightformer
            form="ring"
            color="white"
            intensity={50}
            scale={20}
            position={[0, 0, -10]}
            onUpdate={(self) => self.lookAt(0, 0, 0)}
          />
        </group>
      </Environment>
      <OrbitControls minAzimuthAngle={Math.PI / 2} maxAzimuthAngle={-Math.PI / 2} minPolarAngle={-Math.PI / 2} maxPolarAngle={Math.PI} />
      <CameraRig />
    </Canvas>
  )
}
