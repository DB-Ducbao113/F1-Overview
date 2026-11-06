import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import {
  Box,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Crosshair,
  Layers,
  RotateCcw,
  ScanLine,
  SlidersHorizontal,
} from 'lucide-react';
import { useNavigationStore } from '../../../store/useNavigationStore';
import { ENGINEERING_SYSTEMS } from '../data/engineeringSystems';
import { EngineeringCanvasBoundary } from './EngineeringCanvasBoundary';
import { EngineeringPoster } from './EngineeringPoster';
import './insideMachine.css';

const Scene = lazy(() => import('../rendering/InsideMachineScene'));
const SYSTEMS = ENGINEERING_SYSTEMS;
const MODEL_URLS = {
  high: '/models/engineering/model-b-cinematic-r4-5-high.glb',
  balanced: '/models/engineering/model-b-cinematic-r4-5-balanced.glb',
  performance: '/models/engineering/model-b-cinematic-r4-5-performance.glb',
} as const;

type Quality = 'high' | 'balanced' | 'performance';
const clamp = (value: number) => Math.min(1, Math.max(0, value));

function getPreferredQuality(): Quality {
  if (typeof navigator === 'undefined') return 'balanced';
  const cores = navigator.hardwareConcurrency ?? 4;
  return cores <= 4 ? 'performance' : 'balanced';
}

export default function InsideMachineView() {
  const lang = useNavigationStore((state) => state.lang);
  const vi = lang === 'vi';
  const [progress, setProgress] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [blueprint, setBlueprint] = useState(false);
  const [isolate, setIsolate] = useState(false);
  const [quality, setQuality] = useState<Quality>(getPreferredQuality);
  const [failed, setFailed] = useState(false);
  const [sourceReady, setSourceReady] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const system = SYSTEMS[selectedIndex];
  const modelUrl = MODEL_URLS[quality];

  useEffect(() => {
    const controller = new AbortController();
    setSourceReady(false);
    setFailed(false);

    fetch(modelUrl, { method: 'HEAD', signal: controller.signal })
      .then((response) => {
        const contentType = response.headers.get('content-type') ?? '';
        if (!response.ok || /text\\/html/i.test(contentType)) {
          throw new Error('R4.5 binary model not installed');
        }
        if (!controller.signal.aborted) setSourceReady(true);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted && !(error instanceof Error && error.name === 'AbortError')) {
          setFailed(true);
        }
      });

    return () => controller.abort();
  }, [modelUrl]);

  const selectSystem = useCallback((index: number) => {
    setSelectedIndex(index);
    setIsolate(false);
    setProgress(0.88);
  }, []);

  const reset = () => {
    setProgress(0);
    setIsolate(false);
    setBlueprint(false);
    setSelectedIndex(0);
  };

  return (
    <div className="itm-v2">
      <div className="itm-v2__grain" aria-hidden="true" />
      <div className="itm-v2__masthead">
        <div className="itm-v2__eyebrow">
          <span className="itm-v2__signal" /> PODIUM EDS <span className="itm-v2__slash">/</span>{' '}
          ENGINEERING LAB
        </div>
        <span>
          INTERACTIVE ASSEMBLY <span className="itm-v2__accent">/ R4.5</span>
        </span>
      </div>
      <section className="itm-v2__intro" aria-label="Inside the Machine">
        <div>
          <div className="itm-v2__overline">01 / MATERIAL INTELLIGENCE</div>
          <h1>
            INSIDE <em>THE</em>
            <br />
            <span>MACHINE.</span>
          </h1>
        </div>
        <p>
          {vi
            ? 'Khám phá cấu trúc của chiếc xe đua qua từng lớp cơ khí. Kéo thanh tiến trình để tháo rời và lắp ráp lại.'
            : 'Deconstruct the machinery behind speed. Scrub the timeline to disassemble and rebuild the car.'}
        </p>
      </section>

      <section className="itm-v2__workspace" aria-label="Interactive F1 engineering model">
        <div className="itm-v2__canvas">
          <div className="itm-v2__canvas-hud">
            <span>
              <ScanLine size={14} /> PRECISION / ENGINEERING
            </span>
            <span className="itm-v2__hud-right">
              MODEL B <i /> {sourceReady ? 'RENDER SOURCE READY' : 'STANDBY'}
            </span>
          </div>
          <div className="itm-v2__stage">
            {sourceReady && !failed ? (
              <EngineeringCanvasBoundary key={modelUrl} onFailure={() => setFailed(true)}>
                <Suspense fallback={<EngineeringPoster unavailable={false} />}>
                  <Scene
                    progress={progress}
                    selected={system.id}
                    blueprint={blueprint}
                    isolate={isolate}
                    quality={quality}
                    modelUrl={modelUrl}
                  />
                </Suspense>
              </EngineeringCanvasBoundary>
            ) : (
              <EngineeringPoster unavailable={failed} />
            )}
          </div>
          <div className="itm-v2__crosshair itm-v2__crosshair--tl" aria-hidden="true" />
          <div className="itm-v2__crosshair itm-v2__crosshair--br" aria-hidden="true" />
          <div className="itm-v2__canvas-footer">
            <span>MODEL B / TECHNICAL DEMONSTRATOR</span>
            <span>ORBIT · DRAG &nbsp; / &nbsp; ZOOM · SCROLL</span>
          </div>
        </div>
        <aside className="itm-v2__inspector" aria-label="Component inspector">
          <div className="itm-v2__inspector-head">
            <span>ASSEMBLY INDEX</span>
            <span>{String(selectedIndex + 1).padStart(2, '0')} / {String(SYSTEMS.length).padStart(2, '0')}</span>
          </div>
          <div className="itm-v2__section-overline">ACTIVE SYSTEM</div>
          <h2>{system.label}</h2>
          <p className="itm-v2__category">{system.category}</p>
          <p className="itm-v2__description">{vi ? system.vi : system.en}</p>
          <div className="itm-v2__list">
            {SYSTEMS.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => selectSystem(index)}
                aria-pressed={selectedIndex === index}
                className={
                  selectedIndex === index
                    ? 'itm-v2__system itm-v2__system--active'
                    : 'itm-v2__system'
                }
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <b>{item.label}</b>
                <ChevronRight size={15} />
              </button>
            ))}
          </div>
          <p className="itm-v2__disclaimer">
            {vi
              ? 'Mô hình giáo dục dựa trên Model B. Không đại diện cho cấu hình cơ khí của một đội F1 cụ thể.'
              : 'Educational Model B demonstrator. Not an exact replica of a team-specific Formula 1 chassis.'}
          </p>
        </aside>
      </section>

      <section className="itm-v2__controls" aria-label="Assembly controls">
        <div className="itm-v2__scrubber">
          <div className="itm-v2__scrubber-head">
            <span>
              <span className="itm-v2__accent">02</span> / DISASSEMBLY SEQUENCE
            </span>
            <output htmlFor="itm-explode">{Math.round(progress * 100)}%</output>
          </div>
          <input
            id="itm-explode"
            type="range"
            min="0"
            max="100"
            step="1"
            value={Math.round(progress * 100)}
            onChange={(e) => setProgress(Number(e.target.value) / 100)}
            aria-label={vi ? 'Mức độ tháo rời' : 'Assembly separation progress'}
            style={{
              background: `linear-gradient(90deg,#ff5937 ${progress * 100}%,#34404d ${progress * 100}%)`,
            }}
          />
          <div className="itm-v2__scrubber-foot">
            <span>ASSEMBLED</span>
            <span>EXPLODED</span>
          </div>
          <div className="itm-v2__step-actions">
            <button type="button" onClick={() => setProgress(clamp(progress - 0.1))}>
              <ChevronLeft size={16} /> STEP BACK
            </button>
            <button type="button" onClick={() => setProgress(clamp(progress + 0.1))}>
              STEP FORWARD <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="itm-v2__tool-grid">
          <button type="button" onClick={() => setBlueprint((v) => !v)} aria-pressed={blueprint}>
            <Layers size={17} /> {blueprint ? 'SOLID VIEW' : 'BLUEPRINT'}
          </button>
          <button type="button" onClick={() => setIsolate((v) => !v)} aria-pressed={isolate}>
            <Crosshair size={17} /> {isolate ? 'SHOW ALL' : 'ISOLATE'}
          </button>
          <button type="button" onClick={reset}>
            <RotateCcw size={17} /> RESET
          </button>
          <label className="itm-v2__quality">
            <SlidersHorizontal size={17} />
            <span>QUALITY</span>
            <select
              value={quality}
              onChange={(event) => setQuality(event.target.value as Quality)}
              aria-label="Rendering quality"
            >
              <option value="high">HIGH</option>
              <option value="balanced">BALANCED</option>
              <option value="performance">PERFORMANCE</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => setShowHelp((value) => !value)}
            aria-expanded={showHelp}
          >
            <CircleHelp size={17} /> {showHelp ? 'HIDE HELP' : 'HELP'}
          </button>
        </div>
        {showHelp && (
          <p className="itm-v2__help">
            Use the timeline to control separation, select a component on the right to focus it, and
            drag the 3D scene to orbit. Blueprint and Isolate can be combined. Reset restores the
            original assembly.
          </p>
        )}
      </section>
      <footer className="itm-v2__bottom">
        <Box size={15} /> PODIUM EDS / INSIDE THE MACHINE <span>PRECISION UNDER FIRE — V2</span>
      </footer>
    </div>
  );
}
