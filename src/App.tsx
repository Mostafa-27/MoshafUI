import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import Surah from "./pages/Surah";
import Search from "./pages/Search";
import Range from "./pages/Range";
// import Layout from "./components/Layout/Layout";
// import Home from "./pages/Home";
// import Surah from "./pages/Surah";
// import Search from "./pages/Search";
// import Range from "./pages/Range";

const theme = createTheme({
  typography: {
    fontFamily: [
      "Noto Naskh Arabic",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "sans-serif",
    ].join(","),
  },
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc2626",
    },
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/surah/:id" element={<Surah />} />
              <Route path="/search" element={<Search />} />
              <Route path="/range" element={<Range />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
