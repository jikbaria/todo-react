import { useEffect, useState, type ReactNode } from "react";

const FreshDate = ({
  children,
  interval = 5000,
}: {
  children: () => ReactNode;
  interval?: number;
}) => {
  // force update every interval
  const [, setState] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setState((s) => s + 1), interval);
    return () => clearInterval(id);
  }, [interval]);

  return children();
};

export { FreshDate };
