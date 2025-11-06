import { useRef, useState, useEffect } from "react";
import logo from "./assets/images/owlwhite.svg";
import "./assets/fonts/Coolvetica Rg.otf";
import { motion, useScroll, useTransform } from "framer-motion";
import PostApp from "./components/PostApp";
import Navigation from "./components/Navigation";
import ManagementPage from "./components/ManagementPage";

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    document.title = `OWL System - ${currentPage}`;
  }, [currentPage]);

  // Se estiver na página de gerenciamento
  if (currentPage === 'management') {
    return (
      <div className="min-h-screen bg-black">
        <div className="p-6">
          <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
          <ManagementPage />
        </div>
      </div>
    );
  }



  // Página Home
  return <HomePage currentPage={currentPage} setCurrentPage={setCurrentPage} />;
}

function HomePage({ currentPage, setCurrentPage }) {
  const { scrollY } = useScroll();
  const logoRef = useRef(null);
  const [coverScale, setCoverScale] = useState(2);
  
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const backgroundColor = useTransform(
    scrollY,
    [0, vh * 0.7], 
    ["rgb(0,0,0)", "rgb(255,255,255)"]
  );
  
  useEffect(() => {
    function computeScale() {
      const el = logoRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const s = Math.max(vw / rect.width, vh / rect.height) * 5;
      setCoverScale(s);
    }

    computeScale();
    window.addEventListener("resize", computeScale);
    
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

  const threshold = typeof window !== "undefined" ? window.innerHeight * 0.5 : 400;
  const helloOpacity = useTransform(
    scrollY,
    [threshold, threshold + vh * 0.3], 
    [0, 1]
  );
  const helloY = useTransform(
    scrollY,
    [threshold, threshold + vh * 0.3],
    [20, 0]
  );

  return (
    <motion.div className="h-[200vh] flex flex-col" style={{ backgroundColor }}>
      {/* Navigation */}
      <div className="fixed top-6 left-6 right-6 z-30">
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>

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