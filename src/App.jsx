import React from "react";
import {
    createHashRouter,
    createRoutesFromElements,
    Route,
    Routes,
    RouterProvider,
} from "react-router-dom";

import TitlePage from "./TitlePage.jsx";
import XmlParser from './components/xmlParser'; 

const router = createHashRouter([
    {
        path: "/",
        element: <TitlePage />,
    },
    {
        path: "demo",
        element: <XmlParser stats="/itgwrapped/Stats.xml" />,
    },

]);

const App = () => {
  return (
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
  );
};

export default App;