import React from "react";
import {
    createHashRouter,
    createRoutesFromElements,
    Route,
    Routes,
    RouterProvider,
} from "react-router-dom";

import TitlePage from "./TitlePage.jsx";
import TitlePageDGEF from "./TitlePageDGEF.jsx";
import XmlParser from './components/xmlParser'; 

const router = createHashRouter([
    {
        path: "/",
        element: <TitlePage />,
    },
    {
        path: "demo",
        element: <XmlParser stats="/itgwrapped/Stats.xml" subtitle={"2023"} start={new Date("2023-01-01T00:00:00")} end={new Date("2024-01-01T00:00:00")} isYear={true} />,
    },
    {
        path: "dgef24",
        element: <TitlePageDGEF />,
    }

]);

const App = () => {
  return (
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
  );
};

export default App;