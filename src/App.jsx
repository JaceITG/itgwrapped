import React from "react";
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    Routes,
    RouterProvider,
} from "react-router-dom";

import TitlePage from "./TitlePage.jsx";
import XmlParser from './components/xmlParser'; 

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={undefined}>
            <Route exact path="/itgwrapped/" element={<TitlePage />} />
            <Route exact path="/itgwrapped/demo" element={<XmlParser stats="/itgwrapped/Stats.xml" />} />
        </Route>
    )
);

const App = () => {
  return (
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
  );
};

export default App;