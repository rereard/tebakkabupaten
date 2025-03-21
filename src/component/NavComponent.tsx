import { FC, useRef, useState, useEffect } from "react";
import { motion } from "motion/react"

type NavContainerType = {
  widthType?: 'full' | 'fit',
  setNavIndex: (index: number) => void,
  navIndex: number
  navList: string[]
}

const NavComponent: FC<NavContainerType> = ({ widthType = 'full', navIndex, setNavIndex, navList }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Handle mouse down event (start dragging)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  // Handle mouse move event (drag effect)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Adjust drag speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // Handle mouse up event (stop dragging)
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Scroll left function
  const scrollLeftFunc = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  // Scroll right function
  const scrollRightFunc = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  // Check scroll position to enable/disable buttons
  useEffect(() => {
    const checkScroll = () => {
      if (!scrollRef.current) return;
      setCanScrollLeft(scrollRef.current.scrollLeft > 0);
      setCanScrollRight(
        scrollRef.current.scrollLeft < scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 1
      );
    };

    if (scrollRef.current) {
      scrollRef.current.addEventListener("scroll", checkScroll);
      checkScroll(); // Run once on mount
    }

    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("scroll", checkScroll);
      }
    };
  }, []);

  return(
    <div className="flex w-full items-center gap-1 md:gap-2">
      {/* Left Scroll Button */}
      {widthType === 'fit' && (
        <motion.button
          whileHover={canScrollLeft ? { scale: 1.1 } : {}}
          onClick={scrollLeftFunc} 
          disabled={!canScrollLeft} 
          className={`p-0.5 md:p-1 text-xl md:text-2xl border-2 shadow-md rounded-full ${!canScrollLeft ? "opacity-50 cursor-auto" : "cursor-pointer"}`}
        >
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"></path></svg>
        </motion.button>
      )}

      <nav
        ref={scrollRef}
        onMouseDown={widthType === 'fit' ? handleMouseDown : undefined}
        onMouseMove={widthType === 'fit' ? handleMouseMove : undefined}
        onMouseLeave={widthType === 'fit' ? handleMouseUp : undefined}
        onMouseUp={widthType === 'fit' ? handleMouseUp : undefined}
        className={`w-full flex gap-1 ${widthType === "fit" && "overflow-x-auto whitespace-nowrap select-none"}`}
      >
        {navList.map((name, index) => (
          <button key={index} onClick={() => setNavIndex(index)} className={`${navIndex === index ? 'bg-[#00bcff] text-white' : 'hover:underline'} border-black flex-1 cursor-pointer border-2 rounded-4xl ${widthType === 'fit' && 'px-2.5'}`}>{name}</button>
        ))}
      </nav>

      {/* Right Scroll Button */}
      {widthType === 'fit' && (
        <motion.button
          whileHover={canScrollRight ? { scale: 1.1 } : {}}
          onClick={scrollRightFunc} 
          disabled={!canScrollRight} 
          className={`p-0.5 md:p-1 text-xl md:text-2xl border-2 shadow-md rounded-full ${!canScrollRight ? "opacity-50 cursor-auto" : "cursor-pointer"}`}
        >
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path></svg>
        </motion.button>
      )}
    </div>
  )
}

export default NavComponent