import { useState } from "react";

export const useVisualMode = initialMode => {
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);

  const transition = (newMode, replace = false) => {
    return setMode(newMode), replace ? setHistory(prev => [newMode, ...prev.slice(1)]) : setHistory(prev => [newMode, ...prev]);
  };
  const back = () => {
    return history.length > 1 ? (setHistory(prev => [...prev.slice(1)]), setMode(history[1])) : setMode(prev => prev);
  };
  
  return { mode, transition, back };
};