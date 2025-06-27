import ReactDOM from "react-dom/client";
import App from "./App";
import store from "./redux/store";
import { Provider } from "react-redux";
import "@fontsource/montserrat/400.css"; // Specific weight
import "@fontsource/montserrat/700.css"; // Bold weight


ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
