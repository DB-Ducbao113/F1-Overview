import React, { Suspense, lazy, useEffect, useLayoutEffect, useState } from 'react';
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { F1StartLightsPreloader } from './components/common/F1StartLightsPreloader';
import { useChampionshipStore } from './store/useChampionshipStore';
import { useNavigationStore } from './store/useNavigationStore';
import { SeasonYear, isSeasonYear } from './types';
import { getCompleteRaceClassification } from './data/championship/raceClassificationHelper';

import { F1SpeedStream } from './components/common/F1SpeedStream';
import { F1PageTransition } from './components/common/F1PageTransition';

const HomeView = lazy(() =>
  import('./components/home/HomeView').then((m) => ({ default: m.HomeView })),
);
const ChampionshipView = lazy(() =>
  import('./components/championship/ChampionshipView').then((m) => ({
    default: m.ChampionshipView,
  })),
);

const ShowroomView = lazy(() =>
  import('./components/showroom/ShowroomView').then((m) => ({ default: m.ShowroomView })),
);
const TeamDetailPage = lazy(() =>
  import('./components/pages/TeamDetailPage').then((m) => ({ default: m.TeamDetailPage })),
);
const DriverDetailPage = lazy(() =>
  import('./components/pages/DriverDetailPage').then((m) => ({ default: m.DriverDetailPage })),
);
const CarDetailPage = lazy(() =>
  import('./components/pages/CarDetailPage').then((m) => ({ default: m.CarDetailPage })),
);
const TeamsDirectoryPage = lazy(() =>
  import('./components/pages/TeamsDirectoryPage').then((m) => ({ default: m.TeamsDirectoryPage })),
);
const DriversDirectoryPage = lazy(() =>
  import('./components/pages/DriversDirectoryPage').then((m) => ({
    default: m.DriversDirectoryPage,
  })),
);
const AboutPage = lazy(() =>
  import('./components/pages/AboutPage').then((m) => ({ default: m.AboutPage })),
);
const RaceClassificationModal = lazy(() =>
  import('./components/championship/RaceClassificationModal').then((m) => ({
    default: m.RaceClassificationModal,
  })),
);

const validSeason = (value?: string): value is `${SeasonYear}` => isSeasonYear(value);

function SeasonRoute() {
  const { year } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setSelectedSeason = useChampionshipStore((state) => state.setSelectedSeason);
  const setActiveSubTab = useChampionshipStore((state) => state.setActiveSubTab);
  const season = (validSeason(year) ? Number(year) : 2026) as SeasonYear;

  useEffect(() => {
    if (validSeason(year)) setSelectedSeason(season);
    const tab = searchParams.get('tab');
    if (tab && ['standings', 'calendar', 'results', 'teams', 'drivers'].includes(tab)) {
      setActiveSubTab(tab as 'standings' | 'calendar' | 'results' | 'teams' | 'drivers');
    }
  }, [year, season, setSelectedSeason, searchParams, setActiveSubTab]);

  if (!validSeason(year)) return <NotFound />;
  return (
    <ChampionshipView season={season} onSeasonChange={(next) => navigate(`/season/${next}`)} />
  );
}

function RaceRoute() {
  const { year, round } = useParams();
  const navigate = useNavigate();
  const detailedResults = useChampionshipStore((state) => state.detailedResults);
  const setSelectedSeason = useChampionshipStore((state) => state.setSelectedSeason);
  const setActiveSubTab = useChampionshipStore((state) => state.setActiveSubTab);
  const validRoute = validSeason(year) && /^\d+$/.test(round || '');
  const season = (validSeason(year) ? Number(year) : 2026) as SeasonYear;
  const raceRound = Number(round);

  useLayoutEffect(() => {
    if (validRoute) {
      setSelectedSeason(season);
      setActiveSubTab('results');
    }
  }, [validRoute, season, setSelectedSeason, setActiveSubTab]);

  if (!validRoute) return <NotFound />;
  const race = getCompleteRaceClassification(season, raceRound, detailedResults[season]);
  if (!race) return <NotFound />;

  return (
    <>
      <ChampionshipView season={season} onSeasonChange={(next) => navigate(`/season/${next}`)} />
      <Suspense fallback={null}>
        <RaceClassificationModal
          race={race}
          onClose={() => navigate(`/season/${season}?tab=results`)}
        />
      </Suspense>
    </>
  );
}

function NotFound() {
  const lang = useNavigationStore((state) => state.lang);
  return (
    <div className="page-container py-24 min-h-[60vh] text-center">
      <p className="text-f1red font-black text-6xl">404</p>
      <h1 className="font-display text-2xl font-bold mt-4">
        {lang === 'vi' ? 'Không tìm thấy trang' : 'Page not found'}
      </h1>
      <Link className="inline-block mt-6 text-f1red font-bold" to="/">
        {lang === 'vi' ? 'Về trang chủ' : 'Go home'}
      </Link>
    </div>
  );
}

export const App: React.FC = () => {
  const location = useLocation();

  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const currentScroll = window.scrollY;
          const progress = docHeight > 0 ? Math.min(1, Math.max(0, currentScroll / docHeight)) : 0;
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-studio-100 text-studio-900 flex flex-col font-sans selection:bg-f1red selection:text-white relative">
      {/* ── A1. F1 Start Lights Preloader ── */}
      <F1StartLightsPreloader />

      {/* ── 3D Aerodynamic Wind Tunnel Telemetry Particle Stream ── */}
      {!location.pathname.startsWith('/showroom') && <F1SpeedStream />}

      {/* ── D2. Film Grain Overlay (Cinematic Texture) ── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-[45] opacity-[0.025] hidden lg:block"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent 0 3px, rgba(255,255,255,0.4) 4px)',
        }}
      />

      <Navbar />

      {/* ── D1. Scroll Progress Speed Strip ── */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] z-[70] pointer-events-none bg-black/20 overflow-hidden">
        <div
          style={{
            transform: `scaleX(${scrollProgress})`,
            transformOrigin: 'left',
          }}
          className="w-full h-full bg-gradient-to-r from-f1red via-amber-400 to-yellow-300 transition-transform duration-75 ease-out"
        />
      </div>

      <main className="min-h-screen flex-1 pt-16">
        <F1PageTransition pathname={location.pathname}>
          <Suspense
            fallback={
              <div className="min-h-[70vh] animate-pulse bg-gradient-to-b from-studio-100 via-white to-studio-100">
                <div className="page-container pt-12 space-y-5">
                  <div className="h-4 w-28 rounded bg-studio-200" />
                  <div className="h-14 max-w-xl rounded bg-studio-200" />
                  <div className="h-[46vh] rounded-3xl bg-studio-200" />
                </div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<HomeView />} />
              {['/live', '/archive', '/timing'].map((path) => (
                <Route
                  key={path}
                  path={path}
                  element={<Navigate to="/season/2026?tab=results" replace />}
                />
              ))}
              <Route path="/season" element={<Navigate to="/season/2026" replace />} />
              <Route path="/championship" element={<Navigate to="/season/2026" replace />} />
              <Route path="/season/:year" element={<SeasonRoute />} />
              <Route path="/season/:year/race/:round" element={<RaceRoute />} />
              <Route path="/showroom" element={<ShowroomView />} />
              <Route path="/gallery" element={<Navigate to="/showroom" replace />} />
              <Route path="/teams/:teamId" element={<TeamDetailPage />} />
              <Route path="/drivers/:driverId" element={<DriverDetailPage />} />
              <Route path="/cars/:carId" element={<CarDetailPage />} />
              <Route path="/teams" element={<TeamsDirectoryPage />} />
              <Route path="/drivers" element={<DriversDirectoryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </F1PageTransition>
      </main>
      <Footer />
    </div>
  );
};

export default App;
