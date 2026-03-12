import { useEffect, useRef, useState } from "react"
import lottie from "lottie-web"
import animationData from "../product360.json"

export default function App() {
  const stageRef = useRef(null)
  const containerRef = useRef(null)
  const animationRef = useRef(null)
  const frameRef = useRef(0)

  const [speed, setSpeed] = useState(1)

  useEffect(() => {
    if (!containerRef.current) return

    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "canvas",
      loop: false,
      autoplay: false,
      animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
      },
    })

    animationRef.current = anim

    const onReady = () => {
      frameRef.current = 0
      anim.goToAndStop(0, true)
    }

    anim.addEventListener("DOMLoaded", onReady)

    return () => {
      anim.removeEventListener("DOMLoaded", onReady)
      anim.destroy()
    }
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const handleWheel = (e) => {
      if (e.cancelable) e.preventDefault()

      const anim = animationRef.current
      if (!anim) return

      const totalFrames = Math.max(1, Math.floor(anim.getDuration(true)))
      const maxFrame = totalFrames - 1

      const wheelFactor = 0.08
      const nextFrame = frameRef.current + e.deltaY * wheelFactor * speed
      const clampedFrame = Math.max(0, Math.min(maxFrame, nextFrame))

      frameRef.current = clampedFrame
      anim.goToAndStop(Math.round(clampedFrame), true)
    }

    stage.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      stage.removeEventListener("wheel", handleWheel)
    }
  }, [speed])

  return (
    <div
      ref={stageRef}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#111",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "0 16px",
          color: "white",
          fontFamily: "Arial, sans-serif",
          flexShrink: 0,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <span>Vitesse</span>
        <input
          type="range"
          min="0.2"
          max="3"
          step="0.1"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
        <span>{speed.toFixed(1)}x</span>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <div
          ref={containerRef}
          style={{
            width: "100%",
            height: "100%",
            maxWidth: "420px",
            maxHeight: "85vh",
          }}
        />
      </div>
    </div>
  )
}