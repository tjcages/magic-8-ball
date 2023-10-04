import { useEffect, useState, useRef, useMemo } from 'react'
import gsap from 'gsap'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
  RenderTexture,
  Text,
  Html,
  PerspectiveCamera,
  Decal,
  useTexture,
} from '@react-three/drei'
import { useControls } from 'leva'
import { easing } from 'maath'

const bulletPoints = [
  { text1: 'I predict', text2: '10.5% revenue uplift', scale: 0.6 },
  { text1: 'Outlook', text2: 'profitable', scale: 1 },
  // { text1: 'If It Is To Be Said,', text2: 'So It Be, So It Is', scale: 0.6 },
  { text1: 'VCs say', text2: 'ask again later', scale: 0.7 },
  { text1: 'Burn rate', text2: 'rising', scale: 0.8 },
  { text1: 'Code freeze', text2: 'predicted', scale: 0.706 },
  { text1: 'Try again', text2: 'next quarter', scale: 0.8 },
  { text1: 'Consult', text2: 'your CFO', scale: 0.9 },
  { text1: 'Forecast:', text2: '99.999% reliability', scale: 0.6 },
  { text1: 'Have you', text2: 'considered AI?', scale: 0.7 },
  { text1: 'Mind the', text2: 'GAAP', scale: 0.9 },
  { text1: 'Consider a', text2: 'hostile takeover', scale: 0.722 },
  { text1: 'Outlook', text2: 'bullish', scale: 0.9 },
  { text1: 'Forecast:', text2: 'Ramen', scale: 0.962 },
  { text1: 'Blocked for', text2: 'fraud, shake again', scale: 0.622 },
  { text1: 'Make it a', text2: 'wearable', scale: 0.9 },
  { text1: 'Shake to', text2: 'pay', scale: 0.9 },
  { text1: 'AGI achieved', text2: 'internally', scale: 0.7 },
]

function Saying({ random, ...props }) {
  return (
    <group {...props}>
      <Text fontSize={0.35 * bulletPoints[random].scale} color="black" anchorX="center" position={[0, 0.2, 0]}>
        {bulletPoints[random].text1}
      </Text>
      <Text fontSize={0.35 * bulletPoints[random].scale} color="black" anchorX="center" position={[0, -0.2, 0]}>
        {bulletPoints[random].text2}
      </Text>
    </group>
  )
}

function Triangle({ ready, holding }) {
  const ref = useRef()
  const [shuffle, set] = useState(false)
  const random = useMemo(() => Math.floor(Math.random() * bulletPoints.length), [shuffle])

  useEffect(() => {
    if (!ref.current) return
    if (holding || !ready) {
      gsap.to(ref.current.position, {
        z: 0.5,
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
        onComplete: () => {
          set(!shuffle)
        },
      })
    } else {
      gsap.to(ref.current.position, {
        z: 0.1,
        // opacity: 1,
        duration: 2,
        ease: 'expo.inOut',
      })
      gsap.to(ref.current.rotation, {
        x: -0.1 + random / 100,
        y: -0.1 + random / 100,
        z: Math.PI / 4 + (random > bulletPoints.length / 2 ? random : -random) / 100,
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
    <mesh ref={ref} position={[0, 0, 0.83]} rotation={[-Math.PI / 4, 0, Math.PI / 4]} scale={0.7}>
      {/* <tetrahedronGeometry args={[0.4]} /> */}
      {/* <dodecahedronGeometry args={[2]} /> */}
      <boxGeometry args={[1, 1, 1]} />
      <meshPhysicalMaterial color="white" roughness={1} metalness={0.5} opacity={1} transparent>
        <RenderTexture attach="map" anisotropy={16}>
          <PerspectiveCamera makeDefault manual aspect={1 / 1} position={[0, 0, 2]} />
          <color attach="background" args={['white']} />
          <Saying random={random} rotation={[0, 0, Math.PI / 4]} />
        </RenderTexture>
      </meshPhysicalMaterial>
    </mesh>
  )
}

function Sphere({ ready, ...props }) {
  const ref = useRef()
  const [cover, decal] = useTexture(['/cover.png', '/8.png'])
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
    chromaticAberration: { value: 0.03, min: 0, max: 1 },
    anisotropy: { value: 1, min: 0, max: 1, step: 0.01 },
    distortion: { value: 0.3, min: 0, max: 1, step: 0.01 },
    distortionScale: { value: 0.3, min: 0.01, max: 1, step: 0.01 },
    temporalDistortion: { value: 0.5, min: 0, max: 1, step: 0.01 },
    clearcoat: { value: 1, min: 0, max: 1 },
    attenuationDistance: { value: 3.0, min: 0, max: 10, step: 0.01 },
    attenuationColor: '#ffffff',
    color: '#635bff',
    bg: '#222',
  })

  useEffect(() => {
    if (!ready || !ref.current) return
    gsap.to(ref.current.rotation, {
      y: Math.PI,
      duration: 2,
      ease: 'expo.inOut',
    })
  }, [ready])

  return (
    <mesh ref={ref} {...props}>
      <sphereGeometry args={[1, 64, 64]} />
      <Decal
        roughness={0}
        metalness={0.5}
        lightMapIntensity={0}
        position={[0, 0, 1]}
        rotation={[0, 0, 0]}
        scale={3.7}
        map={cover}
        map-anisotropy={16}
        transparent
        opacity={1}
      />
      <Decal position={[0, 0, -1]} rotation={[0, 0, 0]} scale={1} map={decal} map-anisotropy={16} />
      {config.meshPhysicalMaterial ? (
        <meshPhysicalMaterial {...config} />
      ) : (
        <MeshTransmissionMaterial background={new THREE.Color(config.bg)} {...config}></MeshTransmissionMaterial>
      )}
    </mesh>
  )
}

function CameraRig({ ready }) {
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [
        -1 + (state.pointer.x * state.viewport.width + state.viewport.width / 2) / 3,
        -0.5 + (state.pointer.y * state.viewport.height + state.viewport.height / 2) / 6,
        -4.5,
      ],
      0.5,
      delta,
    )
    state.camera.lookAt(0, 0, 0)
  })
}

export default function App() {
  const [holding, setHolding] = useState(false)
  const [ready, set] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      set(true)
    }, 2000)
  }, [])

  return (
    <Canvas camera={{ position: [0, 0, -5], fov: 45 }}>
      <color attach="background" args={['#0A0A0A']} />
      <ambientLight />
      <spotLight intensity={0.5} angle={0.2} penumbra={1} position={[5, 15, 10]} />
      <Sphere ready={ready} />
      <Triangle ready={ready} holding={holding} />
      <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/blue_photo_studio_1k.hdr" resolution={512} blur={0}>
        <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-50, 2, 0]} scale={[100, 2, 1]} />
        <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[50, 2, 0]} scale={[100, 2, 1]} />
      </Environment>
      {/* <OrbitControls /> */}
      <OrbitControls onStart={() => setHolding(true)} onEnd={() => setHolding(false)} />
      <CameraRig />
    </Canvas>
  )
}
