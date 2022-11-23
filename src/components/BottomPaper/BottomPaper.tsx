import { PropsWithChildren, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useSwipeable } from "react-swipeable";

export interface BottomPaperProps { 
  show: boolean, 
  backgroundColor?: string, 
  onClose: Function 
}

const BottomPaper = ({ show, onClose, backgroundColor, children }: PropsWithChildren<BottomPaperProps>) => {
  const [{ translateY }, api] = useSpring(() => ({ translateY: 0, display: "block" }));

  const close = () => {
    console.log("Closing1")
    onClose();
  }

  useEffect(() => {
    console.log("Closing")
    api.start({ translateY: show ? 0 : 1000, display: show ? "block" : "none" });
  }, [show])

  const handlers = useSwipeable({
    onSwipedDown: close
  })

  return (
    <animated.div {...handlers} style={{
      translateY,
      backgroundColor,
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