import React, { lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import { CalamariBasePage, DolphinBasePage } from 'pages/BasePage';

const SendPage = lazy(
  () =>
    import(
      /* webpackPrefetch: true */ /* webpackChunkName: "SendPage" */ './pages/SendPage'
    )
);
const StakePage = lazy(
  () =>
    import(
      /* webpackPrefetch: true */ /* webpackChunkName: "StakePage" */ './pages/StakePage'
    )
);
const BridgePage = lazy(
  () =>
    import(
      /* webpackPrefetch: true */ /* webpackChunkName: "BridgePage" */ './pages/BridgePage'
    )
);

const DolphinRoutes = () => {
  return (
    <DolphinBasePage>
      <Routes>
        <Route path="dolphin">
          <Route index element={<Navigate to="transact" />} />
          <Route path="bridge" element={<BridgePage />} />
          <Route path="transact" element={<SendPage />} />
        </Route>
      </Routes>
    </DolphinBasePage>
  );
};

const CalamariRoutes = () => {
  return (
    <CalamariBasePage>
      <Routes>
        <Route path="calamari">
          <Route index element={<Navigate to="transact" />} />
          <Route path="bridge" element={<BridgePage />} />
          <Route path="transact" element={<SendPage />} />
          <Route path="stake" element={<StakePage />} />
        </Route>
      </Routes>
    </CalamariBasePage>
  );
};

const RedirectRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="/calamari/transact" replace />} />
      <Route
        path="/stake"
        element={<Navigate to="/calamari/stake" replace />}
      />
    </Routes>
  );
};

const AppRouter = () => {
  return (
    <Router>
      <Suspense fallback="loading">
        <RedirectRoutes />
        <CalamariRoutes />
        <DolphinRoutes />
      </Suspense>
    </Router>
  );
};

export default AppRouter;
