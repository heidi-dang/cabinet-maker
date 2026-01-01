import { useRef, useState, useMemo } from "react";

export function useDialogState(initialData: any = null) {
  const resolveRef = useRef<any>(undefined);
  const [data, setData] = useState(initialData);

  const [showAsync, onClose] = useMemo(() => {
    const showAsync = (data: any = undefined) => {
      setData(data === undefined ? true : data);

      return new Promise(resolve => {
        resolveRef.current = resolve;
      });
    };

    const onClose = (val: any) => {
      resolveRef.current && resolveRef.current(val);
      setData(null);
    };

    return [showAsync, onClose];
  }, []);

  return [data, showAsync, onClose];
}