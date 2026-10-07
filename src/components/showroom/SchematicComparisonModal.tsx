import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Palette,
  Layers,
  Copy,
  Check,
  Compass,
  FileText,
  Sparkles,
} from 'lucide-react';
import { TeamId } from '../../types';
import { TEAMS_DATA } from '../../data/teams';
import { getTeam3DLivery } from '../../data/showroom/teamLiveries';
import { getTeamSponsors } from '../../data/showroom/teamSponsors';
import { ConstructorLogo } from '../common/ConstructorLogo';
import { CameraPreset } from './CameraController';

interface SchematicComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: TeamId;
  lang: 'vi' | 'en';
  onFocusPart?: (preset: CameraPreset) => void;
}

interface ComponentSpec {
  id: string;
  nameVi: string;
  nameEn: string;
  preset: CameraPreset;
  schematicDetailVi: string;
  schematicDetailEn: string;
  implementationVi: string;
  implementationEn: string;
  colors: { labelVi: string; labelEn: string; hex: string; desc: string }[];
}

export const SchematicComparisonModal: React.FC<SchematicComparisonModalProps> = ({
  isOpen,
  onClose,
  teamId,
  lang,
  onFocusPart,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'schematic' | 'components' | 'palette'>('schematic');
  const [selectedPartId, setSelectedPartId] = useState<string>('mirrors');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const team = useMemo(() => TEAMS_DATA[teamId] || TEAMS_DATA.ferrari, [teamId]);
  const livery = useMemo(() => getTeam3DLivery(teamId), [teamId]);
  const sponsors = useMemo(() => getTeamSponsors(teamId), [teamId]);

  const components: ComponentSpec[] = useMemo(
    () => [
      {
        id: 'mirrors',
        nameVi: 'Gương Chiếu Hậu & Hệ Treo',
        nameEn: 'Wing Mirrors & Suspension',
        preset: 'cockpit',
        schematicDetailVi:
          'Vỏ ốp gương khí động học hai tầng định hình luồng gió vào hốc hút sườn. Thanh đòn treo trước Wishbone carbon với đầu nối titan Grade 5.',
        schematicDetailEn:
          'Dual-tier aerodynamic wing mirror shells conditioning flow into sidepod inlets. Carbon wishbones with titanium spherical bearings.',
        implementationVi:
          'Sơn hoàn thiện vỏ gương theo màu sắc chính của đội đua, bổ sung sọc viền aero highlight, mặt gương phản chiếu bầu trời studio và đinh chốt titan.',
        implementationEn:
          'Mirror housings finished in official constructor livery, aero pinstripe trim, reflective studio horizon glass, and titanium rod ends.',
        colors: [
          {
            labelVi: 'Vỏ gương',
            labelEn: 'Mirror Housing',
            hex: livery.mirrorColor || livery.bodyColor,
            desc: 'Màu nhận diện gương chiếu hậu',
          },
          {
            labelVi: 'Sọc viền',
            labelEn: 'Aero Accent',
            hex: livery.mirrorAccentColor || livery.accentColor,
            desc: 'Sọc định hướng luồng khí',
          },
        ],
      },
      {
        id: 'floor',
        nameVi: 'Sàn Xe & Rãnh Hút Venturi',
        nameEn: 'Ground-Effect Venturi Floor',
        preset: 'overview',
        schematicDetailVi:
          'Bản vẽ CAD quy định kết cấu sàn gầm hiệu ứng mặt đất, ván gỗ ép trung tâm Jabroc (FIA Reference Plank) và các lá chắn biên (Edge Fences).',
        schematicDetailEn:
          'CAD schematic defines Venturi tunnels, central Jabroc reference skid plank, and longitudinal aerodynamic edge fences.',
        implementationVi:
          'Vân dệt sợi carbon đa hướng kết hợp vạch tốc độ sơn màu thương hiệu chạy dọc mép sàn, ván gỗ Jabroc màu hổ phách và 4 đĩa trượt kim loại mạ vàng titan.',
        implementationEn:
          'Twill carbon weave with longitudinal team-colored speedlines on floor edges, amber Jabroc reference plank, and golden titanium skid blocks.',
        colors: [
          {
            labelVi: 'Viền sàn xe',
            labelEn: 'Floor Edge',
            hex: livery.floorEdgeAccentColor || livery.accentColor,
            desc: 'Dải sọc màu mép sàn khí động',
          },
          {
            labelVi: 'Ván Jabroc',
            labelEn: 'Jabroc Plank',
            hex: '#7a5229',
            desc: 'Ván gỗ Beechwood tiêu chuẩn FIA',
          },
          {
            labelVi: 'Đĩa Titan',
            labelEn: 'Skid Blocks',
            hex: '#d4af37',
            desc: 'Khối titan chống mài mòn gầm xe',
          },
        ],
      },
      {
        id: 'diffuser',
        nameVi: 'Bộ Khuếch Tán & Đèn Mưa FIA',
        nameEn: 'Diffuser & FIA Rain Light',
        preset: 'rear',
        schematicDetailVi:
          'Cụm kết cấu va chạm sau (Rear Impact Structure) tích hợp cụm đèn LED cảnh báo trời mưa FIA và các cánh hướng dòng khuếch tán không khí.',
        schematicDetailEn:
          'Rear crash structure integrating FIA 24-LED rain safety light, ERS status diodes, and vertical diffuser expansion strakes.',
        implementationVi:
          'Mô phỏng cụm 24 mắt LED đỏ ruby rực sáng kèm 2 LED xanh ERS, viền cánh chia gió sơn màu tem xe và cổ pô xả Inconel đổi màu tím-vàng nung nhiệt.',
        implementationEn:
          'Simulated 24 ruby-red LEDs + 2 green ERS indicators, team-accented diffuser strakes, and heat-blued titanium/Inconel exhaust tailpipe.',
        colors: [
          {
            labelVi: 'Đèn mưa FIA',
            labelEn: 'FIA Rain Light',
            hex: livery.rainLightColor || '#ff0033',
            desc: 'LED đỏ ruby chuẩn an toàn 2026',
          },
          {
            labelVi: 'Cánh chia gió',
            labelEn: 'Diffuser Strake',
            hex: livery.diffuserAccentColor || livery.accentColor,
            desc: 'Màu viền lá gió khuếch tán',
          },
          {
            labelVi: 'Ống xả Titan',
            labelEn: 'Titanium Exhaust',
            hex: '#1d4ed8',
            desc: 'Hiệu ứng nung nhiệt Inconel/Titan',
          },
        ],
      },
      {
        id: 'cockpit',
        nameVi: 'Khoang Lái & Vô Lăng Kỹ Thuật Số',
        nameEn: 'Cockpit & Digital Steering Wheel',
        preset: 'cockpit',
        schematicDetailVi:
          'Khoang điều khiển trung tâm với vô lăng bọc Alcantara, màn hình màu PCU-8D và dây đai an toàn 6 điểm tiêu chuẩn FIA 8853-2016.',
        schematicDetailEn:
          'Driver cockpit monocoque with Alcantara steering wheel, PCU-8D OLED telemetry, and FIA 8853-2016 6-point harness.',
        implementationVi:
          'Vô lăng tích hợp màn hình OLED hiển thị số 8, tốc độ 332 KM/H, dải 15 đèn LED tua máy xanh-đỏ-lam, nút bấm đa sắc và đai an toàn phối màu đội đua.',
        implementationEn:
          'OLED display showing Gear 8, 332 KM/H, 15 RPM shift LEDs, colorful rotary buttons, and team-colored 6-point harness with rotary alloy buckle.',
        colors: [
          {
            labelVi: 'Đai an toàn',
            labelEn: 'Safety Harness',
            hex: livery.seatbeltColor || livery.accentColor,
            desc: 'Đai đua Sabelt / Willans theo màu đội',
          },
          {
            labelVi: 'Đèn tua máy',
            labelEn: 'Shift LEDs',
            hex: '#00ff66',
            desc: 'Dải LED báo vòng tua RPM',
          },
          {
            labelVi: 'Màn hình OLED',
            labelEn: 'OLED Readout',
            hex: '#00f0ff',
            desc: 'Hiển thị dữ liệu viễn trắc PCU-8D',
          },
        ],
      },
      {
        id: 'halo',
        nameVi: 'Khung Bảo Vệ Titan Halo',
        nameEn: 'Titanium Halo Safety Structure',
        preset: 'cockpit',
        schematicDetailVi:
          'Khung an toàn Grade 5 Titanium đúc liền khối chịu lực nén tĩnh 12.3 tấn (125 kN) bảo vệ vùng đầu tay đua.',
        schematicDetailEn:
          'Monolithic Grade 5 Titanium safety cell withstanding 12.3 tonnes static load protecting driver head region.',
        implementationVi:
          'Cánh lướt gió khí động học trên đỉnh Halo sơn phối màu nhận diện đội đua, tem chứng nhận an toàn FIA 8869-2018 và logo nhà tài trợ chính.',
        implementationEn:
          'Aerodynamic upper fairing painted in constructor livery, official FIA 8869-2018 homologation stamp, and primary sponsor branding.',
        colors: [
          {
            labelVi: 'Thân Halo',
            labelEn: 'Halo Body',
            hex: livery.haloColor,
            desc: 'Màu sơn khí động học đỉnh Halo',
          },
          {
            labelVi: 'Khung Titan',
            labelEn: 'Titanium Base',
            hex: '#64748b',
            desc: 'Hợp kim titan Grade 5 nguyên khối',
          },
        ],
      },
      {
        id: 'nose',
        nameVi: 'Mũi Xe & Cánh Gió Trước',
        nameEn: 'Nose Cone & Front Wing',
        preset: 'front',
        schematicDetailVi:
          'Mũi xe hạ thấp tối đa theo quy chuẩn 2026 dẫn hướng khí xoáy Y250. Cánh gió trước 4 tầng cánh với tấm ốp đầu cánh Endplate.',
        schematicDetailEn:
          'Low-slung 2026 nosecone channeling laminar air. 4-element front wing cascades with sculpted vortex endplates.',
        implementationVi:
          'Sơn chuẩn mã màu Pantone chính hãng, in số xe tay đua, quốc kỳ, logo nhà tài trợ Pirelli / Shell / Mobil 1 và cờ hiệu đội đua.',
        implementationEn:
          'Authentic Pantone team paint, driver race numbers, flags, official technical sponsor emblems and constructor crests.',
        colors: [
          {
            labelVi: 'Mũi xe',
            labelEn: 'Nose Cone',
            hex: livery.noseColor || livery.bodyColor,
            desc: 'Màu sơn chính phần mũi xe',
          },
          {
            labelVi: 'Tấm ốp cánh',
            labelEn: 'Endplates',
            hex: livery.endplateColor || livery.wingColor,
            desc: 'Đầu mút cánh gió trước',
          },
        ],
      },
      {
        id: 'sidepods',
        nameVi: 'Thân Xe & Hốc Gió Làm Mát',
        nameEn: 'Sidepods & Cooling Architecture',
        preset: 'overview',
        schematicDetailVi:
          'Rãnh lượn dốc hốc gió sườn (Downwash undercut channel), khe thoát nhiệt chủ động (Cooling louvres) và nắp động cơ vuốt thon.',
        schematicDetailEn:
          'Downwash undercut sidepod geometry, active cooling extraction louvres, and tapered engine cover spine.',
        implementationVi:
          'Bố trí khe thoát nhiệt Louvres 3D hai bên sườn, vây cá mập Shark Fin gắn cờ hiệu và tem các đối tác kỹ thuật cao.',
        implementationEn:
          'Dual cooling extraction louvre banks, shark fin engine cover with constructor livery and technical partner decals.',
        colors: [
          {
            labelVi: 'Sườn xe',
            labelEn: 'Sidepod Body',
            hex: livery.sidepodColor || livery.bodyColor,
            desc: 'Màu sơn hốc gió sườn',
          },
          {
            labelVi: 'Nắp máy',
            labelEn: 'Engine Cover',
            hex: livery.engineCoverColor || livery.bodyColor,
            desc: 'Vỏ che động cơ V6 Turbo',
          },
        ],
      },
      {
        id: 'wheels',
        nameVi: 'Mâm BBS & Lốp Pirelli 18-Inch',
        nameEn: 'BBS Wheels & 18-Inch Pirelli Tires',
        preset: 'overview',
        schematicDetailVi:
          'Mâm hợp kim Magiê đúc 18 inch của BBS trang bị ốp che khí động học toàn phần hoặc mâm nan hở làm mát phanh đĩa Carbon Brembo.',
        schematicDetailEn:
          '18-inch forged magnesium BBS rims with full aerodynamic carbon covers or exposed multi-spoke Brembo cooling channels.',
        implementationVi:
          'Vòng tròn tốc độ và viền mâm sơn màu sắc riêng biệt cho từng đội đua, thành lốp Pirelli P Zero phân chia hợp chất Đỏ/Vàng/Trắng.',
        implementationEn:
          'Dedicated aero cover rings & BBS rim lips tailored to each constructor, Pirelli P Zero compound colored sidewalls.',
        colors: [
          {
            labelVi: 'Viền ốp mâm',
            labelEn: 'Aero Disc Ring',
            hex: livery.wheelAccentColor || livery.accentColor,
            desc: 'Vòng tròn khí động học trên mâm',
          },
          {
            labelVi: 'Gờ vành BBS',
            labelEn: 'BBS Rim Flange',
            hex: livery.wheelRimColor || '#ffffff',
            desc: 'Màu gờ hợp kim magiê BBS',
          },
        ],
      },
    ],
    [livery],
  );

  const selectedPart = useMemo(
    () => components.find((c) => c.id === selectedPartId) || components[0],
    [components, selectedPartId],
  );

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  // Prevent background scrolling and support Escape key
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className={`bg-studio-950 border border-studio-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white transition-all duration-300 ${
          isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl max-h-[92vh]'
        }`}
      >
        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-studio-800/80 bg-studio-900/60 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <ConstructorLogo teamId={teamId} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-f1red/20 text-f1red border border-f1red/30">
                  {lang === 'vi' ? 'ĐỐI CHIẾU KỸ THUẬT' : 'TECHNICAL BENCHMARK'}
                </span>
                <span className="text-xs font-mono text-studio-400 font-bold">
                  {livery.schematicCode}
                </span>
              </div>
              <h2 className="font-display text-base sm:text-lg font-black uppercase tracking-wide text-white flex items-center gap-2 mt-0.5">
                <span>{lang === 'vi' ? livery.schematicTitleVi : livery.schematicTitleEn}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFullscreen((prev) => !prev)}
              className="p-2 rounded-xl bg-studio-800/80 hover:bg-studio-700 text-studio-300 hover:text-white transition-colors cursor-pointer"
              title={isFullscreen ? 'Thu nhỏ cửa sổ' : 'Phóng to toàn màn hình'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-studio-800/80 hover:bg-red-600/30 text-studio-300 hover:text-red-400 transition-colors cursor-pointer"
              title={lang === 'vi' ? 'Đóng cửa sổ' : 'Close'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Tab Selector Navigation ── */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-studio-950/80 border-b border-studio-800/60 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('schematic')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'schematic'
                ? 'bg-f1red text-white shadow-md shadow-f1red/20'
                : 'text-studio-400 hover:text-white hover:bg-studio-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Bản Vẽ CAD 2D Gốc' : 'Original 2D CAD Blueprint'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('components')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'components'
                ? 'bg-f1red text-white shadow-md shadow-f1red/20'
                : 'text-studio-400 hover:text-white hover:bg-studio-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'So Sánh 8 Bộ Phận Kỹ Thuật' : '8-Component Technical Audit'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('palette')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'palette'
                ? 'bg-f1red text-white shadow-md shadow-f1red/20'
                : 'text-studio-400 hover:text-white hover:bg-studio-800'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Bảng Mã Màu Thực Tế' : 'Livery Color Matrix'}</span>
          </button>
        </div>

        {/* ── Tab Content ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: ORIGINAL 2D SCHEMATIC BLUEPRINT */}
          {activeTab === 'schematic' && (
            <div className="space-y-4">
              {/* Zoom & View Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-studio-900/60 border border-studio-800">
                <div className="flex items-center gap-2 text-xs font-mono text-studio-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    {lang === 'vi'
                      ? 'Bản vẽ CAD kỹ thuật chính hãng 8K được đối chiếu trực tiếp với mô hình 3D'
                      : 'Authentic 8K CAD engineering schematic cross-referenced with 3D model'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((prev) => Math.max(0.75, prev - 0.25))}
                    className="p-1.5 rounded-lg bg-studio-800 hover:bg-studio-700 text-studio-200 cursor-pointer"
                    title={lang === 'vi' ? 'Thu nhỏ' : 'Zoom Out'}
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-studio-950 border border-studio-800">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((prev) => Math.min(2.5, prev + 0.25))}
                    className="p-1.5 rounded-lg bg-studio-800 hover:bg-studio-700 text-studio-200 cursor-pointer"
                    title={lang === 'vi' ? 'Phóng to' : 'Zoom In'}
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(1)}
                    className="px-2.5 py-1 rounded-lg bg-studio-800 hover:bg-studio-700 text-[11px] font-bold text-studio-200 cursor-pointer"
                  >
                    100%
                  </button>
                </div>
              </div>

              {/* High-Resolution Schematic Image Container with Zoom */}
              <div className="relative rounded-2xl border border-studio-800 bg-[#06080c] overflow-hidden min-h-[420px] max-h-[580px] flex items-center justify-center p-2">
                <div
                  className="transition-transform duration-200 ease-out cursor-grab active:cursor-grabbing max-w-full max-h-full flex items-center justify-center"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  <img
                    src={livery.schematicImage}
                    alt={lang === 'vi' ? livery.schematicTitleVi : livery.schematicTitleEn}
                    className="max-h-[540px] w-auto object-contain rounded-xl shadow-2xl select-none pointer-events-none"
                    loading="eager"
                  />
                </div>

                {/* Technical Watermark Tag */}
                <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-studio-400">
                  {team.name.toUpperCase()} · 2026 TECHNICAL SPECIFICATION
                </div>
              </div>

              {/* Quick Component Navigator Under Schematic */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                {components.slice(0, 4).map((comp) => (
                  <div
                    key={comp.id}
                    className="p-3 rounded-xl bg-studio-900/50 border border-studio-800/70 hover:border-studio-700 transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">
                        {lang === 'vi' ? comp.nameVi : comp.nameEn}
                      </span>
                      {onFocusPart && (
                        <button
                          type="button"
                          onClick={() => {
                            onFocusPart(comp.preset);
                            onClose();
                          }}
                          className="p-1 rounded bg-studio-800 hover:bg-f1red text-[10px] font-mono text-studio-300 hover:text-white transition-colors cursor-pointer"
                          title={lang === 'vi' ? 'Xoay camera 3D tới bộ phận này' : 'Focus 3D camera'}
                        >
                          <Compass className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {comp.colors.map((c, i) => (
                        <span
                          key={i}
                          className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: c.hex }}
                          title={`${c.labelVi}: ${c.hex}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: 8-COMPONENT TECHNICAL COMPARISON */}
          {activeTab === 'components' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Component List Selector */}
              <div className="lg:col-span-5 space-y-2">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-studio-400 mb-2">
                  {lang === 'vi' ? 'Chọn Bộ Phận Kỹ Thuật' : 'Select Vehicle Component'}
                </h3>
                <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
                  {components.map((comp) => {
                    const isSelected = comp.id === selectedPartId;
                    return (
                      <button
                        key={comp.id}
                        type="button"
                        onClick={() => setSelectedPartId(comp.id)}
                        className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-studio-800/90 border-f1red text-white shadow-md'
                            : 'bg-studio-900/40 border-studio-800 text-studio-300 hover:bg-studio-900 hover:text-white'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="font-display text-xs font-bold uppercase truncate">
                            {lang === 'vi' ? comp.nameVi : comp.nameEn}
                          </p>
                          <p className="text-[10px] text-studio-400 truncate mt-0.5">
                            {lang === 'vi' ? comp.schematicDetailVi : comp.schematicDetailEn}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {comp.colors.map((c, i) => (
                            <span
                              key={i}
                              className="w-3.5 h-3.5 rounded-full border border-white/30"
                              style={{ backgroundColor: c.hex }}
                            />
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: In-Depth Comparison Details of Selected Part */}
              <div className="lg:col-span-7 bg-studio-900/50 border border-studio-800 rounded-2xl p-5 space-y-5">
                <div className="flex items-start justify-between gap-4 border-b border-studio-800 pb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-2 py-0.5 rounded-full">
                      {lang === 'vi' ? 'CHI TIẾT ĐỐI CHIẾU' : 'COMPONENT BREAKDOWN'}
                    </span>
                    <h3 className="font-display text-lg font-black uppercase text-white mt-1.5">
                      {lang === 'vi' ? selectedPart.nameVi : selectedPart.nameEn}
                    </h3>
                  </div>

                  {onFocusPart && (
                    <button
                      type="button"
                      onClick={() => {
                        onFocusPart(selectedPart.preset);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-f1red hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-f1red/20"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>{lang === 'vi' ? 'Xem 3D Ngay' : 'Focus in 3D'}</span>
                    </button>
                  )}
                </div>

                {/* 2-Column Comparison Box: Original Blueprint vs 3D Implementation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Original CAD Blueprint Spec */}
                  <div className="p-4 rounded-xl bg-studio-950/80 border border-studio-800/80 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{lang === 'vi' ? 'Bản Vẽ CAD Gốc 2D' : 'Original CAD Blueprint'}</span>
                    </div>
                    <p className="text-xs text-studio-300 leading-relaxed">
                      {lang === 'vi'
                        ? selectedPart.schematicDetailVi
                        : selectedPart.schematicDetailEn}
                    </p>
                  </div>

                  {/* 3D Model Implementation & Added Livery Colors */}
                  <div className="p-4 rounded-xl bg-studio-950/80 border border-studio-800/80 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {lang === 'vi'
                          ? 'Mô Hình 3D & Màu Sắc Thêm'
                          : '3D Mesh & Added Livery Colors'}
                      </span>
                    </div>
                    <p className="text-xs text-studio-300 leading-relaxed">
                      {lang === 'vi'
                        ? selectedPart.implementationVi
                        : selectedPart.implementationEn}
                    </p>
                  </div>
                </div>

                {/* Component Color Palette Swatches */}
                <div className="space-y-2.5 pt-2 border-t border-studio-800/60">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-studio-400">
                    {lang === 'vi' ? 'Bảng Màu Trang Bị Cho Bộ Phận Này' : 'Assigned Color Palette'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedPart.colors.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-studio-950/90 border border-studio-800/80"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-7 h-7 rounded-lg border border-white/20 shadow-md shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                          <div>
                            <p className="text-xs font-bold text-white leading-tight">
                              {lang === 'vi' ? c.labelVi : c.labelEn}
                            </p>
                            <p className="text-[10px] text-studio-400">{c.desc}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => copyToClipboard(c.hex)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-studio-800 hover:bg-studio-700 text-[10px] font-mono text-studio-300 hover:text-white transition-colors cursor-pointer"
                          title="Sao chép mã màu HEX"
                        >
                          {copiedHex === c.hex ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{c.hex}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COMPLETE LIVERY COLOR MATRIX */}
          {activeTab === 'palette' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-studio-900/60 border border-studio-800 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="font-display text-base font-black uppercase text-white">
                    {lang === 'vi'
                      ? `Hệ Thống Màu Sắc Nhận Diện · ${team.name} (${livery.carModelName})`
                      : `Official Constructor Color Matrix · ${team.name} (${livery.carModelName})`}
                  </h3>
                  <p className="text-xs text-studio-400 mt-0.5">
                    {lang === 'vi'
                      ? 'Tất cả mã màu được chuẩn hóa hệ màu sRGB và áp dụng trực tiếp lên từng bề mặt UV 3D'
                      : 'All color tokens calibrated to standard sRGB space and baked into procedural 3D UV surfaces'}
                  </p>
                </div>
                <div className="text-xs font-mono text-studio-400">
                  {lang === 'vi' ? 'Nhà tài trợ chính: ' : 'Primary Partner: '}
                  <span className="text-amber-300 font-bold">{sponsors.primarySponsor}</span>
                </div>
              </div>

              {/* Grid of All Color Tokens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {[
                  {
                    nameVi: 'Thân Xe Chính',
                    nameEn: 'Primary Bodywork',
                    hex: livery.bodyColor,
                    desc: 'Màu sơn chủ đạo toàn bộ thân vỏ xe',
                  },
                  {
                    nameVi: 'Chóp Mũi Xe',
                    nameEn: 'Nose Cone',
                    hex: livery.noseColor || livery.bodyColor,
                    desc: 'Vỏ composite mũi xe phía trước',
                  },
                  {
                    nameVi: 'Hốc Gió Sườn',
                    nameEn: 'Sidepod Body',
                    hex: livery.sidepodColor || livery.bodyColor,
                    desc: 'Cấu trúc dẫn khí làm mát hai bên',
                  },
                  {
                    nameVi: 'Gương Chiếu Hậu',
                    nameEn: 'Mirror Housing',
                    hex: livery.mirrorColor || livery.bodyColor,
                    desc: 'Vỏ ốp gương khí động học hai bên',
                  },
                  {
                    nameVi: 'Sọc Gương Accent',
                    nameEn: 'Mirror Accent Line',
                    hex: livery.mirrorAccentColor || livery.accentColor,
                    desc: 'Chỉ viền lướt gió trên gương',
                  },
                  {
                    nameVi: 'Viền Cạnh Sàn Xe',
                    nameEn: 'Floor Edge Speedline',
                    hex: livery.floorEdgeAccentColor || livery.accentColor,
                    desc: 'Dải sọc màu chạy dọc hai bên mép sàn',
                  },
                  {
                    nameVi: 'Đai An Toàn 6 Điểm',
                    nameEn: '6-Point Safety Harness',
                    hex: livery.seatbeltColor || livery.accentColor,
                    desc: 'Dây đai sợi dệt Sabelt trong khoang lái',
                  },
                  {
                    nameVi: 'Cánh Chia Diffuser',
                    nameEn: 'Diffuser Strakes',
                    hex: livery.diffuserAccentColor || livery.accentColor,
                    desc: 'Viền định hướng luồng khí thoát đuôi',
                  },
                  {
                    nameVi: 'Đèn Mưa FIA Ruby',
                    nameEn: 'FIA Rain Light Ruby',
                    hex: livery.rainLightColor || '#ff0033',
                    desc: 'LED cảnh báo mưa chuẩn va chạm sau',
                  },
                  {
                    nameVi: 'Khung An Toàn Halo',
                    nameEn: 'Titanium Halo Cell',
                    hex: livery.haloColor,
                    desc: 'Cánh khí động học trên đỉnh khung Titan',
                  },
                  {
                    nameVi: 'Viền Mâm Khí Động',
                    nameEn: 'Aero Wheel Accent',
                    hex: livery.wheelAccentColor || livery.accentColor,
                    desc: 'Vòng tròn tốc độ quanh mâm xe BBS',
                  },
                  {
                    nameVi: 'Gờ Mâm Hợp Kim BBS',
                    nameEn: 'BBS Rim Flange',
                    hex: livery.wheelRimColor || '#ffffff',
                    desc: 'Gờ vành kim loại mâm 18-inch',
                  },
                ].map((colorItem, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-studio-900/50 border border-studio-800/80 flex items-center justify-between gap-3 hover:border-studio-700 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="w-10 h-10 rounded-xl border border-white/20 shadow-md shrink-0 flex items-center justify-center text-[9px] font-mono font-bold"
                        style={{
                          backgroundColor: colorItem.hex,
                          color: '#ffffff',
                          textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                        }}
                      >
                        ●
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">
                          {lang === 'vi' ? colorItem.nameVi : colorItem.nameEn}
                        </p>
                        <p className="text-[10px] text-studio-400 truncate">{colorItem.desc}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(colorItem.hex)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-studio-950 border border-studio-800 text-[10px] font-mono text-studio-300 hover:text-white transition-colors cursor-pointer shrink-0"
                      title="Sao chép mã màu HEX"
                    >
                      {copiedHex === colorItem.hex ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{colorItem.hex}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Modal Footer ── */}
        <div className="px-5 py-3 border-t border-studio-800/80 bg-studio-950 flex flex-wrap items-center justify-between gap-3 text-xs text-studio-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>
              {lang === 'vi'
                ? 'Độ chính xác chi tiết màu sắc: 100% khớp quy chuẩn kỹ thuật FIA 2026'
                : '100% Color fidelity matched to official 2026 FIA technical directives'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-studio-800 hover:bg-studio-700 text-white font-bold transition-colors cursor-pointer"
            >
              {lang === 'vi' ? 'Đóng' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
