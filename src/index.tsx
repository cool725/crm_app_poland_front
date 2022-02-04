import React from "react";
import ReactDOM from "react-dom";
import "./assets/css/index.css";
import App from "./components/App";
import store from "./store";
import { Provider } from "react-redux";
import { HashRouter as Router } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import common_en from "./lang/en.json";
import common_pl from "./lang/pl.json";

import reportWebVitals from "./reportWebVitals";

import "./services/axios";

i18next.init({
  interpolation: { escapeValue: false },
  lng: "en",
  resources: {
    en: {
      common: common_en,
    },
    pl: {
      common: common_pl,
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18next}>
        <Router>
          <App />
        </Router>
      </I18nextProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
