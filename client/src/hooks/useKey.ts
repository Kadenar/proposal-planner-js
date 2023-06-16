import { useRef, useEffect } from "react";

export function useKey(key: string, cb: (event: KeyboardEvent) => void) {
  const callback = useRef(cb);

  useEffect(() => {
    callback.current = cb;
  });

  useEffect(() => {
    function handle(event: KeyboardEvent) {
      if (event.code === key) {
        callback.current(event);
      } else if (key === "ctrls" && event.key === "s" && event.ctrlKey) {
        event.preventDefault();
        callback.current(event);
      } else if (key === "ctrlo" && event.key === "o" && event.ctrlKey) {
        event.preventDefault();
        callback.current(event);
      }
    }

    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [key]);
}
