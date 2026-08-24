import { BrowserRouter, Routes, Route } from "react-router-dom";
import SiteShell from "./features/eventaari-pages/components/SiteShell";
import HomePageContent from "./features/eventaari-pages/components/HomePageContent";
import EventsPageContent from "./features/eventaari-pages/components/EventsPageContent";
import CommunityPageContent from "./features/eventaari-pages/components/CommunityPageContent";
import HousingPage from "./features/eventaari-pages/pages/HousingPage";
import PartnersPage from "./features/eventaari-pages/pages/PartnersPage";
import "./features/eventaari-pages/eventaari-pages.css";

export default function App() {
  return (
    <BrowserRouter>
      <SiteShell>
        <Routes>
          <Route path="/" element={<HomePageContent />} />
          <Route path="/events" element={<EventsPageContent />} />
          <Route path="/community" element={<CommunityPageContent />} />
          <Route path="/housing" element={<HousingPage />} />
          <Route path="/partners" element={<PartnersPage />} />
        </Routes>
      </SiteShell>
    </BrowserRouter>
  );
}