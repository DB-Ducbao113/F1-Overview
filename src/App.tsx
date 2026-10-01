import React, { Suspense, lazy, useEffect } from 'react';
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
import { useChampionshipStore } from './store/useChampionshipStore';
import { useNavigationStore } from './store/useNavigationStore';
import { SeasonYear } from './types';
import { RaceClassificationModal } from './components/championship/RaceClassificationModal';
import { getCompleteRaceClassification } from './data/championship/raceClassificationHelper';

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

let lastAutoRaceSyncAt = 0;

const validSeason = (value?: string): value is `${SeasonYear}` =>
  ['2024', '2025', '2026'].includes(value || '');

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

  useEffect(() => {
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
      <RaceClassificationModal
        race={race}
        onClose={() => navigate(`/season/${season}?tab=results`)}
      />
    </>
  );
}

function About() {
  const lang = useNavigationStore((state) => state.lang);
  return (
    <div className="page-container py-16 min-h-[60vh]">
      <p className="text-xs text-f1red font-bold uppercase tracking-widest">Formula 1 Hub</p>
      <h1 className="font-display text-4xl font-black uppercase mt-3">
        {lang === 'vi' ? 'Về dự án' : 'About this project'}
      </h1>
      <p className="max-w-2xl mt-5 text-studio-600 leading-relaxed">
        {lang === 'vi'
          ? 'Một dự án cá nhân khám phá dữ liệu mùa giải, kết quả chặng đua và bộ sưu tập hình ảnh Formula 1.'
          : 'A personal project exploring Formula 1 season data, race results, and a curated image collection.'}
      </p>
      <Link className="inline-block mt-8 text-f1red font-bold" to="/">
        {lang === 'vi' ? 'Về trang chủ →' : 'Back home →'}
      </Link>
    </div>
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
  const syncSeasonData = useChampionshipStore((state) => state.syncSeasonData);

  useEffect(() => {
    const refreshIfDue = () => {
      if (document.visibilityState !== 'visible' || Date.now() - lastAutoRaceSyncAt < 15 * 60_000)
        return;
      lastAutoRaceSyncAt = Date.now();
      void syncSeasonData(2026);
    };

    refreshIfDue();
    const interval = window.setInterval(refreshIfDue, 15 * 60_000);
    document.addEventListener('visibilitychange', refreshIfDue);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', refreshIfDue);
    };
  }, [syncSeasonData]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);
  return (
    <div className="min-h-screen bg-studio-100 text-studio-900 flex flex-col font-sans selection:bg-f1red selection:text-white">
      <Navbar />
      <div
        key={`${location.pathname}-speedbar`}
        className="fixed top-0 left-0 right-0 h-[2.5px] z-[60] pointer-events-none overflow-hidden"
      >
        <div className="w-full h-full bg-gradient-to-r from-transparent via-f1red to-yellow-400 animate-f1-speed-scan" />
      </div>
      <main className="flex-1 pt-16">
        <div key={location.pathname} className="animate-page-enter">
          <Suspense fallback={<div className="min-h-[50vh]" />}>
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/season" element={<Navigate to="/season/2026" replace />} />
              <Route path="/championship" element={<Navigate to="/season/2026" replace />} />
              <Route path="/season/:year" element={<SeasonRoute />} />
              <Route path="/season/:year/race/:round" element={<RaceRoute />} />
              <Route path="/showroom" element={<ShowroomView />} />
              <Route path="/gallery" element={<ShowroomView />} />
              <Route path="/teams/:teamId" element={<TeamDetailPage />} />
              <Route path="/drivers/:driverId" element={<DriverDetailPage />} />
              <Route path="/cars/:carId" element={<CarDetailPage />} />
              <Route path="/teams" element={<TeamsDirectoryPage />} />
              <Route path="/drivers" element={<DriversDirectoryPage />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
