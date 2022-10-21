import type { AppType } from "next/app";
import "../style";

const App: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};
export default App;
