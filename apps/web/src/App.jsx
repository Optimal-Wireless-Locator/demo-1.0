import { useRef, useState, useEffect } from "react";
import logo from "./assets/images/owlwhite.svg";
import "./assets/fonts/Coolvetica Rg.otf";
import { motion, useScroll, useTransform } from "framer-motion";
import PostApp from "./components/PostApp";

function App() {
  const { scrollY } = useScroll();

  // background transition: use vh-based values for consistent behavior across screen sizes
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const backgroundColor = useTransform(
    scrollY,
    [0, vh * 0.7], // transição mais rápida (70% da viewport)
    ["rgb(0,0,0)", "rgb(255,255,255)"]
  );

  // logo: compute scale needed to cover viewport
  const logoRef = useRef(null);
  const [coverScale, setCoverScale] = useState(2);
  useEffect(() => {
    function computeScale() {
      const el = logoRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const s = Math.max(vw / rect.width, vh / rect.height) * 5; // zoom maior
      setCoverScale(s);
    }

    // Calcula scale inicial
    computeScale();

    // Recalcula quando a janela é redimensionada
    window.addEventListener("resize", computeScale);

    // Recalcula periodicamente durante scroll para evitar bugs
    const scrollHandler = () => {
      requestAnimationFrame(computeScale);
    };
    window.addEventListener("scroll", scrollHandler, { passive: true });

    return () => {
      window.removeEventListener("resize", computeScale);
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  const coverScroll = typeof window !== "undefined" ? window.innerHeight : 800;
  const logoOpacity = useTransform(scrollY, [0, coverScroll], [1, 0]);
  const logoScale = useTransform(scrollY, [0, coverScroll], [1, coverScale]);

  // threshold for showing the post-white content (50% viewport for easier testing)
  const threshold =
    typeof window !== "undefined" ? window.innerHeight * 0.5 : 400;
  const helloOpacity = useTransform(
    scrollY,
    [threshold, threshold + vh * 0.3], // 30% da viewport para fade in
    [0, 1]
  );
  const helloY = useTransform(
    scrollY,
    [threshold, threshold + vh * 0.3],
    [20, 0]
  );

  const [showPostWhite, setShowPostWhite] = useState(false);
  useEffect(() => {
    if (!scrollY) return;
    const unsub = scrollY.onChange((v) => setShowPostWhite(v >= threshold));
    return unsub;
  }, [scrollY, threshold]);

  // simplificado: não usamos medições adicionais; mantemos PostApp no fluxo normal

  return (
    <motion.div className="h-[200vh] flex flex-col" style={{ backgroundColor }}>
      <section className="h-screen w-full p-6 flex items-center justify-center ">
        <div
          style={{
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 20,
            width: "60vw",
            maxWidth: "3000px",
            pointerEvents: "none",
          }}
        >
          <motion.img
            ref={logoRef}
            src={logo}
            alt="Logo"
            style={{
              width: "100%",
              height: "auto",
              scale: logoScale,
              opacity: logoOpacity,
            }}
          />
        </div>
      </section>

      <section className="h-screen w-full">
        <div className="h-full flex flex-col items-center justify-center">
          <div className="font-cool text-[clamp(1.5rem,4.5vw,3.25rem)] mb-16 text-[rgb(93,191,78)] text-center">
            <h1>Set up your tracking environment</h1>
          </div>

          <motion.div
            style={{ opacity: helloOpacity, y: helloY }}
            className="w-full flex justify-center"
          >
            <PostApp />
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
export default App;
