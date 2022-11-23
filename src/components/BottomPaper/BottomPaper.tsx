import { PropsWithChildren, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useSwipeable } from "react-swipeable";

export interface BottomPaperProps { 
  show?: boolean, 
  boxShadow?: string,
  backgroundColor?: string, 
  onClose: Function 
}

const BottomPaper = ({ show = true, onClose, boxShadow, backgroundColor, children }: PropsWithChildren<BottomPaperProps>) => {
  const [{ translateY }, api] = useSpring(() => ({ translateY: 0, display: "block" }));

  const close = () => {
    onClose();
  }

  useEffect(() => {
    api.start({ translateY: show ? 0 : 1000, display: show ? "block" : "none" });
  }, [show])

  const handlers = useSwipeable({
    onSwipedDown: close
  })

  return (
    <animated.div {...handlers} style={{
      translateY,
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
      <div style={{ zIndex: 1001, borderRadius: "10%", backgroundColor: "gray", width: "10%", height: 4, marginLeft: "auto", marginRight: "auto", marginTop: 10 }} />
      <div style={{ position: "relative", padding: "1rem", zIndex: 1002 }}>
        {children}
      </div>
    </animated.div>
  )
}

export default BottomPaper;