import { MutableRefObject, useCallback, useEffect, useRef } from 'react';

export default function useAnimationFrame(callback: () => boolean | undefined | void): MutableRefObject<number> {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef<number>();

  const animate = useCallback(() => {
    const stop = callback();

    if (stop)
      return;

    requestRef.current = requestAnimationFrame(animate);
  }, [callback]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(requestRef.current || 0);
  }, [animate, callback]);

  return requestRef;
}
