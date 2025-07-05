import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';
import { TagsProvider } from "./store/tagsContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <TagsProvider>
                <App />
                <Analytics />
            </TagsProvider>
        </BrowserRouter>
    </React.StrictMode>
);
