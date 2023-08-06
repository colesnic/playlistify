import React, { useState, useEffect } from 'react';
import LinearProgress from '@mui/material/LinearProgress';

const SlowLinearProgress = () => {
  const [value, setValue] = useState(0);
  const [buffer, setBuffer] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setValue((prevValue) => (prevValue + 1 > 100 ? 0 : prevValue + 1+ Math.random()));
      setBuffer((prevBuffer) => (prevBuffer + 1 > 100 ? 0 : prevBuffer + 1.5 + Math.random()));
    }, 300); 

    return () => {
      clearInterval(timer);
    };
  }, []);

  return <LinearProgress variant="buffer" value={value} valueBuffer={buffer} />;
};

export default SlowLinearProgress;
