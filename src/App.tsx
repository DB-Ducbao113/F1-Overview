import React, { Suspense, lazy, useEffect } from 'react';
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { useChampionshipStore } from './store/useChampionshipStore';
import { useCollectionStore } from './store/useCollectionStore';
import { useNavigationStore } from './store/useNavigationStore';
import { getRaceResults } from './data/championship';
import { TEAMS_DATA } from './data/teams';
import { SeasonYear, TeamId } from './types';
import { RaceClassificationModal } from './components/championship/RaceClassificationModal';

const HomeView = lazy(() =>
  import('./components/home/HomeView').then((m) => ({ default: m.HomeView })),
);
const ChampionshipView = lazy(() =>
  import('./components/championship/ChampionshipView').then((m) => ({
    default: m.ChampionshipView,
  })),
);
const CollectionView = lazy(() =>
  import('./components/collection/CollectionView').then((m) => ({ default: m.CollectionView })),
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
  const navigate = useNavigate();
  const setSelectedSeason = useChampionshipStore((state) => state.setSelectedSeason);
  const season = (validSeason(year) ? Number(year) : 2026) as SeasonYear;
  useEffect(() => {
    if (validSeason(year)) setSelectedSeason(season);
  }, [year, season, setSelectedSeason]);
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
  const lang = useNavigationStore((state) => state.lang);
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
  const race = detailedResults[season]?.find((item) => item.round === raceRound);
  const summary = getRaceResults(season).find((item) => item.round === raceRound);
  if (!race && !summary) return <NotFound />;
  return (
    <>
      <ChampionshipView season={season} onSeasonChange={(next) => navigate(`/season/${next}`)} />
      {race ? (
        <RaceClassificationModal race={race} onClose={() => navigate(`/season/${season}`)} />
      ) : summary ? (
        <div
          className="fixed inset-0 z-[9998] bg-black/80 flex items-center justify-center p-4"
          onClick={() => navigate(`/season/${season}`)}
        >
          <section
            className="bg-white rounded-2xl p-8 max-w-lg w-full"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-xs text-f1red font-bold uppercase">
              {season} · Round {summary.round}
            </p>
            <h1 className="text-2xl font-black mt-2">{summary.grandPrix}</h1>
            <p className="text-sm text-studio-600 mt-2">
              {summary.circuit} · {summary.date}
            </p>
            <p className="mt-2 text-xs text-studio-500">
              Source: {summary.dataSource || 'Bundled website snapshot'} · Updated:{' '}
              {summary.dataUpdatedAt || 'Not recorded'}
            </p>
            <h2 className="font-bold mt-6 mb-2">Podium</h2>
            {[summary.podium.p1, summary.podium.p2, summary.podium.p3].map((driver, index) => (
              <p className="py-2 border-b" key={driver.driver}>
                {index + 1}. {driver.driver} · {driver.team} · {driver.points} pts
              </p>
            ))}
            <button
              className="mt-6 px-4 py-2 bg-studio-900 text-white rounded-lg"
              onClick={() => navigate(`/season/${season}`)}
            >
              {lang === 'vi' ? 'Đóng' : 'Close'}
            </button>
          </section>
        </div>
      ) : null}
    </>
  );
}

function GalleryRoute() {
  const { teamId } = useParams();
  const selectTeam = useCollectionStore((state) => state.selectTeam);
  const clearTeam = useCollectionStore((state) => state.clearTeam);
  const isValidTeam = !!teamId && Object.keys(TEAMS_DATA).includes(teamId);
  useEffect(() => {
    if (isValidTeam) selectTeam(teamId as TeamId);
    else clearTeam();
  }, [teamId, isValidTeam, selectTeam, clearTeam]);
  if (teamId && !isValidTeam) return <NotFound />;
  return <CollectionView />;
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

  useEffect(() => window.scrollTo({ top: 0, behavior: 'smooth' }), [location.pathname]);
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
              <Route path="/season/:year" element={<SeasonRoute />} />
              <Route path="/season/:year/race/:round" element={<RaceRoute />} />
              <Route path="/gallery" element={<GalleryRoute />} />
              <Route path="/gallery/:teamId" element={<GalleryRoute />} />
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
