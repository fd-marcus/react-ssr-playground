import type { FC } from "react"
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Html from "./components/Html";
import Layout from "./components/Layout";
import Spinner from "./components/Spinner";
import ProductDetailPage from "./pages/ProductDetailPage";

const App: FC<any> = ({ assets }) => {
  return (
    <Html assets={assets} title="Example Title">
      <Suspense fallback={<Spinner />}>
        <ErrorBoundary FallbackComponent={Error}>
          <Content />
        </ErrorBoundary>
      </Suspense>
    </Html>
  );
};

const Content: FC = () => {
  return (
    <Layout>
      <ProductDetailPage />
    </Layout>
  );
};

const Error: FC<any> = ({ error }) => {
  return (
    <div>
      <h1>Application Error</h1>
      <pre style={{ whiteSpace: "pre-wrap" }}>{error.stack}</pre>
    </div>
  );
};

export default App;
