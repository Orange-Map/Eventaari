import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import LandingPage from "./LandingPage.jsx";
import MapPage from "./MapPage.jsx";
import EventsPage from "./EventsPage.jsx";
import NotFoundPage from "./NotFoundPage.jsx";
import "./App.css";
import Map from "./Map.jsx";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
export default App;
