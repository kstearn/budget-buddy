import React, { createContext, useState, useContext } from 'react';

const DataRefreshContext = createContext();

export const DataRefreshProvider = ({ children }) => {
    const [refreshData, setRefreshData] = useState(false);

    const triggerRefresh = () => {
        setRefreshData(prev => !prev);
    };

    return (
        <DataRefreshContext.Provider value={{ refreshData, triggerRefresh }}>
            {children}
        </DataRefreshContext.Provider>
    );
};

export const useDataRefresh = () => useContext(DataRefreshContext);
