import { MouseEventHandler, PropsWithChildren, useEffect, useRef, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

/**
 * @param onClose the function activated on the close event.
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
  height?: string,
  onClose: Function
}

const BottomPaper = ({ show = false, onClose, boxShadow, backgroundColor, height, children }: PropsWithChildren<BottomPaperProps>) => {
  const [{ y }, api] = useSpring(() => ({ y: 0 }));
  const [display, setDisplay] = useState(show ? "block" : "none");
  const box = useRef<HTMLDivElement>(null);
  useOutsideClick(onClose, box);

  const close = () => {
    onClose();
  }

  const bind = useDrag(({ active, movement: [_, my], direction: [yDir], cancel }) => {
    const elemHeight = box.current?.clientHeight!;
    const calcHeight: number = active ? my : 0;

    if (active && my > elemHeight / 2) { cancel(); close() };
    api.start({ y: calcHeight });
  }, { axis: "y" })

  const animation = async () => {
    setDisplay("block");
    await Promise.all(api.start({ y: show ? 0 : 500 }));
    setDisplay(show ? "block" : "none");
  }

  useEffect(() => { animation() }, [show])

  return (
    <animated.div {...bind()} style={{
      y,
      display,
      backgroundColor: backgroundColor ?? "white",
      boxShadow: boxShadow ?? "0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)",
      position: "fixed",
      bottom: "0",
      left: "0",
      width: "100%",
      zIndex: "1000",
      height: height ?? "60vh",
      borderTopLeftRadius: "20px",
      borderTopRightRadius: "20px",
      overflow: "hidden",
      touchAction: "none",
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