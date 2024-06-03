import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store";
import { IntlProvider } from "react-intl";

import French from "./lang/fr.json";
import English from "./lang/en.json";
import Init from "./Init";
import Toasts from "./components/Toasts";

const locale = navigator.language;

let lang;
if (locale === "en") {
  lang = English;
} else if (locale === "fr") {
  lang = French;
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <Init>
          <IntlProvider locale={locale} messages={French}>
            <Toasts />
            <App />
          </IntlProvider>
        </Init>
      </Provider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
