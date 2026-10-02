// RouteProgress.tsx
import { useEffect, useState } from "react";
import { useNavigation } from "react-router";

export default function Preloader() {
  const { state } = useNavigation();
  const loading = state !== "idle";
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (loading) {
      setVisible(true);
      setProgress(10);
      const id = setInterval(() => {
        setProgress((p) => p + (90 - p) * 0.1);
      }, 200);
      return () => clearInterval(id);
    }

    setProgress(100);
    const t = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);
    return () => clearTimeout(t);
  }, [loading]);

  if (!visible) return null;

  return (
    <div className="preloader">
      <div className="progress" style={{ width: `${progress}%` }} />
    </div>
  );
}