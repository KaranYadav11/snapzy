import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "./components/ui/sonner";
import { Provider } from "react-redux";
import store from "../src/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

let persistor = persistStore(store);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              backgroundColor: "#000000",
              color: "#fff",
              borderRadius: "12px",
              padding: "12px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
            },
            duration: 3000,
          }}
        />
      </PersistGate>
    </Provider>
  </StrictMode>
);
