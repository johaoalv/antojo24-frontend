import React, { createContext, useContext, useState, useEffect } from "react";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    // Inicializamos con el valor guardado en localStorage o "global"
    const [selectedStoreId, setSelectedStoreId] = useState(() => {
        return localStorage.getItem("selected_sucursal_id") || "global";
    });

    const [stores, setStores] = useState([]);

    // Persistir la selección
    useEffect(() => {
        localStorage.setItem("selected_sucursal_id", selectedStoreId);
    }, [selectedStoreId]);

    return (
        <StoreContext.Provider value={{ selectedStoreId, setSelectedStoreId, stores, setStores }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error("useStore debe usarse dentro de un StoreProvider");
    }
    return context;
};
