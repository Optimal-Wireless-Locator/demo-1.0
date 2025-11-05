import React from "react";
import { motion } from "framer-motion";

function PostApp() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex justify-center items-center gap-10">
        <button className="relative inline-flex  p-0.5 mb-2 me-2 overflow-hidden rounded-lg group bg-gradient-to-br from-[rgb(93,191,78)] to-blue-500 group-hover:from-[rgb(93,191,78)] group-hover:to-blue-600 hover:text-white text-black">
          <span className="transition-all ease-in duration-75 bg-[rgb(255,255,255)] rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent px-[125px] py-[125px] text-3xl font-cool">
            Map
          </span>
        </button>

        <button className="relative inline-flex  p-0.5 mb-2 me-2 overflow-hidden rounded-lg group bg-gradient-to-br from-[rgb(93,191,78)] to-blue-500 group-hover:from-[rgb(93,191,78)] group-hover:to-blue-600 hover:text-white text-black">
          <span className="transition-all ease-in duration-75 bg-[rgb(255,255,255)] rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent px-[125px] py-[125px] text-3xl font-cool">
            Tag
          </span>
        </button>
      </div>
      <div>
        -{">"}
      </div>
    </motion.div>
  );
}
export default PostApp;
