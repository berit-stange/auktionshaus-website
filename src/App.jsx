
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header";
import Auktionen from "./components/Auktionen";
import Kundenkonto from "./components/Kundenkonto";
import Katalogliste from "./components/Katalogliste";
import Los from "./components/Los";
import Login from "./components/Login";
import Startslider from "./components/Startslider";
import SiteLoginGate from "./components/SiteLoginGate";

function AppLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <SiteLoginGate>
      <Header
        transparent={isHomePage}
        backgroundColor={isHomePage ? "transparent" : "#fff"}
      />

      <Routes>
        <Route path="/" element={<Startslider />} />
        <Route path="/auktionen" element={<Auktionen />} />
        <Route path="/kundenkonto" element={<Kundenkonto />} />
        <Route
          path="/katalog/:auctionNumber"
          element={<Katalogliste />}
        />
        <Route path="/los/:losId" element={<Los />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </SiteLoginGate>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
