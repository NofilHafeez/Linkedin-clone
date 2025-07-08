'use client';

import React, { createContext, useContext, useState } from 'react';

interface NotificationContextType {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}

// 1️⃣ Create the context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// 2️⃣ Create the provider component
export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [count, setCount] = useState<number>(0);

  return (
    <NotificationContext.Provider value={{ count, setCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

// 3️⃣ Create a custom hook for easy usage
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
