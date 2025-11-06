import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPinned } from "lucide-react";
import ModalMap from "./ModalMap";
import ModalTag from "./ModalTag";

function PostApp({ onNavigateToOWL }) {
  const [openMap, setOpenMap] = useState(false);
  const [openTag, setOpenTag] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-[700px]"
    >
      <div className="flex justify-center items-center gap-10">
        <button
          onClick={() => setOpenMap(true)}
          className="relative inline-flex  p-0.5 mb-2 me-2 overflow-hidden rounded-lg group bg-gradient-to-br from-[rgb(93,191,78)] to-black group-hover:from-[rgb(93,191,78)] group-hover:to-blue-600 hover:text-white text-black focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-[rgb(93,191,78)]"
        >
          <span className="transition-all ease-in duration-75 bg-[rgb(255,255,255)] rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent px-[125px] py-[125px] text-3xl font-cool">
            Map
          </span>
        </button>

        <button
          onClick={() => setOpenTag(true)}
          className="relative inline-flex  p-0.5 mb-2 me-2 overflow-hidden rounded-lg group bg-gradient-to-br from-[rgb(93,191,78)] to-black group-hover:from-[rgb(93,191,78)] group-hover:to-blue-600 hover:text-white text-black focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-[rgb(93,191,78)]"
        >
          <span className="transition-all ease-in duration-75 bg-[rgb(255,255,255)] rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent px-[125px] py-[125px] text-3xl font-cool">
            Tag
          </span>
        </button>
      </div>

      {/* Seta para navegar para OWL */}
      <div className="flex justify-center items-center mt-8 w-">
        <button 
          onClick={onNavigateToOWL}
          className="bg-[rgb(93,191,78)] hover:bg-[rgb(83,181,68)] transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl rounded-full p-4  flex justify-center items-center "
          title="Ir para OWL - Gerenciamento"
        >
          <MapPinned className="w-8 h-8 text-white" />
        </button>
      </div>

      {/* Modais */}
      <ModalMap isOpen={openMap} onClose={() => setOpenMap(false)} />
      <ModalTag isOpen={openTag} onClose={() => setOpenTag(false)} />
    </motion.div>
  );
}

export default PostApp;
