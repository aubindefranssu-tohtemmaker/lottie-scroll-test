import { useEffect, useRef, useState } from "react"
import lottie from "lottie-web"

import productA from "../product360.json"
import productB from "../product360-bis.json"

const animations = {
  productA,
  productB
}

export default function App() {

  const stageRef = useRef(null)
  const containerRef = useRef(null)
  const animationRef = useRef(null)
  const frameRef = useRef(0)

  const [speed, setSpeed] = useState(1)
  const [product, setProduct] = useState("productA")

  useEffect(() => {

    if (!containerRef.current) return

    if (animationRef.current) {
      animationRef.current.destroy()
    }

    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData: animations[product]
    })

    animationRef.current = anim

    anim.addEventListener("DOMLoaded", () => {
      frameRef.current = 0
      anim.goToAndStop(0, true)
    })

  }, [product])


  useEffect(() => {

    const stage = stageRef.current

    const handleWheel = (e) => {

      e.preventDefault()

      const anim = animationRef.current
      if (!anim) return

      const totalFrames = anim.getDuration(true)
      const maxFrame = totalFrames - 1

      const nextFrame = frameRef.current + e.deltaY * 0.08 * speed

      const frame = Math.max(0, Math.min(maxFrame, nextFrame))

      frameRef.current = frame

      anim.goToAndStop(frame, true)

    }

    stage.addEventListener("wheel", handleWheel, { passive:false })

    return () => stage.removeEventListener("wheel", handleWheel)

  }, [speed])


  return (
    <div
      ref={stageRef}
      style={{
        width:"100vw",
        height:"100vh",
        background:"#111",
        display:"flex",
        flexDirection:"column"
      }}
    >

      <div style={{
        height:"64px",
        display:"flex",
        alignItems:"center",
        gap:"20px",
        padding:"0 20px",
        color:"white"
      }}>

        <span>Produit :</span>

        <button onClick={() => setProduct("productA")}>
          Produit A
        </button>

        <button onClick={() => setProduct("productB")}>
          Produit B
        </button>

        <span style={{marginLeft:"40px"}}>Vitesse</span>

        <input
          type="range"
          min="0.2"
          max="3"
          step="0.1"
          value={speed}
          onChange={(e)=>setSpeed(Number(e.target.value))}
        />

        {speed.toFixed(1)}x

      </div>

      <div style={{
        flex:1,
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
      }}>

        <div
          ref={containerRef}
          style={{
            width:"420px",
            height:"80vh"
          }}
        />

      </div>

    </div>
  )
}