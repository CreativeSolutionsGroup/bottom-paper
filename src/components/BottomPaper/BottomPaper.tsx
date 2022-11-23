import { MouseEventHandler, MutableRefObject, PropsWithChildren, useEffect, useRef, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useSwipeable } from "react-swipeable";

/**
 * 
 * @param onClose
 * @param ref should be of type MutableRefObject<HTMLDivElement> but ts complains.
 */
const useOutsideClick = (onClose: Function, ref: any) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEventHandler<HTMLButtonElement>) => {
      // @ts-ignore
      if (ref.current && !ref.current.contains(event.target)) {
        onClose && onClose();
      }
    };
    // @ts-ignore
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      // @ts-ignore
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [onClose]);
}

export interface BottomPaperProps {
  show?: boolean,
  boxShadow?: string,
  backgroundColor?: string,
  onClose: Function
}

const BottomPaper = ({ show = false, onClose, boxShadow, backgroundColor, children }: PropsWithChildren<BottomPaperProps>) => {
  const [{ translateY }, api] = useSpring(() => ({ translateY: 0 }));
  const [display, setDisplay] = useState(show ? "block" : "none");
  const box = useRef<HTMLDivElement>(null);
  useOutsideClick(onClose, box);

  const close = () => {
    onClose();
  }

  const closeAnimation = async () => {
    await Promise.all(api.start({ translateY: show ? 0 : 1000 }));
    setDisplay(show ? "block" : "none");
  }

  useEffect(() => {
    closeAnimation();
  }, [show])

  const handlers = useSwipeable({
    onSwipedDown: close
  })

  return (
    <animated.div {...handlers} style={{
      translateY,
      display,
      backgroundColor: backgroundColor ?? "white",
      boxShadow: boxShadow ?? "0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)",
      position: "absolute",
      bottom: "0",
      left: "0",
      width: "100%",
      zIndex: "1000",
      height: "60vh",
      borderTopLeftRadius: "20px",
      borderTopRightRadius: "20px",
      overflow: "hidden"
    }}>
      <div ref={box} style={{ width: "100%", height: "100%" }}>
        <div style={{ zIndex: 1001, borderRadius: "20px", backgroundColor: "gray", width: "10%", height: 4, marginLeft: "auto", marginRight: "auto", marginTop: 10 }} />
        <div style={{ position: "relative", padding: "1rem", zIndex: 1002 }}>
          {children}
        </div>
      </div>
    </animated.div>
  )
}

export default BottomPaper;