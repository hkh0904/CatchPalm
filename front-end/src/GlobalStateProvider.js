// GlobalStateProvider.js

import React, { useState } from 'react';
import GlobalStateContext from './GlobalStateContext';

const GlobalStateProvider = ({ children }) => {
  const [responseData, setResponseData] = useState(null);

  return (
    <GlobalStateContext.Provider value={{ responseData, setResponseData }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export default GlobalStateProvider;
