import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of your data
export interface MyData {
   someValue: number;
   txHash: '' | `0x${string}`;
}

// Define the context type
export interface MyContextType {
   myData: MyData;
   setMyData: React.Dispatch<React.SetStateAction<MyData>>;
   updateSomeValue: (value: number) => void;
}

// Create context with undefined as initial value
// Renamed to avoid potential naming conflicts
const MyContextInstance = createContext<MyContextType | undefined>(undefined);

// Provider component
export const MyProvider = ({ children }: { children: ReactNode }) => {
   const [myData, setMyData] = useState<MyData>({
      someValue: 0,
      txHash: '',
      // Initialize other properties here
   });

   // Helper function to update specific values
   const updateSomeValue = (value: number) => {
      setMyData((prev) => ({ ...prev, someValue: value }));
   };

   const value: MyContextType = {
      myData,
      setMyData,
      updateSomeValue,
   };

   return (
      <MyContextInstance.Provider value={value}>
         {children}
      </MyContextInstance.Provider>
   );
};

// Custom hook to use the context
export const useMyContext = (): MyContextType => {
   const context = useContext(MyContextInstance);
   if (!context) {
      throw new Error('useMyContext must be used within a MyProvider');
   }
   return context;
};
