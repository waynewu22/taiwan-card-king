"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

const NAV = [
  { id: "about", label: "公司簡介", href: "/#about" },
  { id: "pricing", label: "價格", href: "/pricing" },
  { id: "delivery", label: "取貨方式", href: "/#delivery" },
  { id: "contact", label: "聯絡我們", href: "/#contact" },
] as const;

// 價格表數據 - 重新組織為包含描述和規格的結構
const COMMON_PAPER_DATA_DETAILED = [
  {
    material: "平面卡",
    description: ["紙面平滑色彩飽滿", "價格最實惠的紙材"],
    spec: "250μm",
    single: { "200": null, "300": 250, "500": 295, "1000": 390 },
    double: { "200": null, "300": 350, "500": 480, "1000": 659 },
    video: "/flat.mp4",
  },
  {
    material: "萊妮紙",
    description: ["表面有十字壓紋", "具有文藝質感的紙類"],
    spec: "300μm±20μm",
    single: { "200": 300, "300": 420, "500": 470, "1000": 750 },
    double: null,
    video: "/leni.mp4",
  },
  {
    material: "安格紙",
    description: ["表面有方格狀紋路", "具有的光澤感的紙類"],
    spec: "300g",
    single: null,
    double: null,
    video: "/ange.mp4",
    isCombinedWithPrevious: true, // 與萊妮紙合併顯示
  },
  {
    material: "合成紙",
    description: ["又稱為撕不破", "具有微防水非常耐用"],
    spec: "200g",
    single: null,
    double: { "200": 400, "300": 500, "500": 630, "1000": 850 },
    video: "/synthetic.mp4",
    isCombinedWithPrevious: true, // 與萊妮紙合併顯示
  },
  {
    material: "象牙紙",
    description: ["紙張呈現柔白色", "表面有纖維質感"],
    spec: "250g",
    single: null,
    double: null,
    video: "/Ivory.mp4",
    isCombinedWithPrevious: true, // 與萊妮紙合併顯示
  },
  {
    material: "雙上霧P",
    description: ["霧膜質感", "防水防髒 硬挺度佳"],
    spec: null,
    single: { "200": 360, "300": 450, "500": 530, "1000": 830 },
    double: null,
    video: "/matt.mp4",
  },
  {
    material: "雙上亮P",
    description: ["亮膜質感", "防水防髒 硬挺度佳"],
    spec: null,
    single: null,
    double: { "200": 490, "300": 590, "500": 730, "1000": 950 },
    video: "/clear.mp4",
    isCombinedWithPrevious: true, // 與雙上霧P合併顯示
  },
  {
    material: "局部上光",
    description: ["凸顯局部亮的效果", "(單面局部光)", "增加局部立體感"],
    spec: null,
    single: { "200": 430, "300": 490, "500": 650, "1000": 1150 },
    double: { "200": 530, "300": 640, "500": 800, "1000": 1350 },
    video: "/spot_uv.mp4",
  },
];

// 保留舊的數據結構以向後兼容（用於其他表格）
const COMMON_PAPER_DATA = [
  {
    material: "平面卡（一級卡）",
    single: { "200": null, "300": 250, "500": 295, "1000": 390 },
    double: { "200": null, "300": 350, "500": 480, "1000": 659 },
  },
  {
    material: "萊妮紙 / 合成紙 / 象牙紙 / 安格紙",
    single: { "200": 300, "300": 420, "500": 470, "1000": 750 },
    double: { "200": 400, "300": 500, "500": 630, "1000": 850 },
  },
  {
    material: "雙上霧P / 雙上亮P",
    single: { "200": 360, "300": 450, "500": 530, "1000": 830 },
    double: { "200": 490, "300": 590, "500": 730, "1000": 950 },
  },
  {
    material: "局部上光（單面局部光）",
    single: { "200": 430, "300": 490, "500": 650, "1000": 1150 },
    double: { "200": 530, "300": 640, "500": 800, "1000": 1350 },
  },
];

// 精緻紙材數據 - 重新組織為包含描述和規格的結構（第一組：200/300/500/1000張）
const DELUXE_PAPER_DATA_1_DETAILED = [
  {
    material: "星幻紙",
    description: ["奢華珍珠光澤", "呈現炫亮金屬質感"],
    spec: null,
    single: { "200": 540, "300": 640, "500": 750, "1000": 1250 },
    double: null,
    video: "/Pearlescent.mp4",
  },
  {
    material: "立體銀",
    description: ["單面局部銀蔥加工", "具有浮凸粗糙的觸感"],
    spec: null,
    single: null,
    double: { "200": 650, "300": 790, "500": 900, "1000": 1490 },
    video: null,
    isCombinedWithPrevious: true, // 與星幻紙合併顯示
  },
];

// 保留舊的數據結構以向後兼容
const DELUXE_PAPER_DATA_1 = [
  {
    material: "星幻紙 / 立體銀",
    single: { "200": 540, "300": 640, "500": 750, "1000": 1250 },
    double: { "200": 650, "300": 790, "500": 900, "1000": 1490 },
  },
];

// 精緻紙材數據 - 重新組織為包含描述和規格的結構（第二組：250/500/1000張）
const DELUXE_PAPER_DATA_2_DETAILED = [
  {
    material: "頂級卡",
    description: ["加厚版本的平面卡", "平滑細緻不反光"],
    spec: null,
    single: { "250": 400, "500": 480, "1000": 780 },
    double: null,
    video: null,
  },
  {
    material: "細紋紙",
    description: ["不規則細沙狀的壓紋", "細緻樸實、乾淨"],
    spec: "220g",
    single: null,
    double: { "250": 500, "500": 650, "1000": 930 },
    video: "/Canvas_2.mp4",
    isCombinedWithPrevious: true, // 與頂級卡合併顯示
  },
  {
    material: "細波紙",
    description: ["岩石般紋路", "紙張觸感紮實"],
    spec: "250g",
    single: null,
    double: null,
    video: null,
  },
  {
    material: "頂級雙上霧",
    description: ["頂級卡加雙面上霧P", "須以雙面計價"],
    spec: null,
    single: { "250": 550, "500": 750, "1000": 1150 },
    double: null,
    video: null,
    isCombinedWithPrevious: true, // 與細波紙合併顯示
  },
  {
    material: "炫光紙",
    description: ["左右搖會帶黃光", "呈現銀色金屬光澤"],
    spec: "250g",
    single: null,
    double: { "250": 690, "500": 900, "1000": 1350 },
    video: null,
    isCombinedWithPrevious: true, // 與細波紙合併顯示
  },
  {
    material: "絲絨卡",
    description: ["表面展現絲絨般觸感", "呈現奢華細緻感"],
    spec: null,
    single: null,
    double: null,
    video: "/Velvet.mp4",
  },
  {
    material: "頂級象牙",
    description: ["厚度420µm", "紙色呈柔合米白色"],
    spec: null,
    single: { "250": 580, "500": 790, "1000": 1300 },
    double: null,
    video: "/Premium_Ivory.mp4",
    isCombinedWithPrevious: true, // 與絲絨卡合併顯示
  },
  {
    material: "局部上光",
    description: ["(雙面局部光)", "增加局部立體感", "須以雙面計價"],
    spec: null,
    single: null,
    double: { "250": 730, "500": 930, "1000": 1580 },
    video: "/spot_uv.mp4",
    isCombinedWithPrevious: true, // 與絲絨卡合併顯示
  },
  {
    material: "永采紙/瑞典一級卡/銀箔卡/磨砂卡",
    description: [],
    spec: null,
    single: null,
    double: null,
    video: null,
    isCombinedWithPrevious: true, // 與絲絨卡合併顯示
  },
  {
    material: "柳葉紙/爵士紙/絲絨局部上光/霧透卡/全透卡(最少五盒)/磨砂冷燙卡(以雙面計價)",
    description: [],
    spec: null,
    single: { "250": 790, "500": 1250, "1000": 1800 },
    double: { "250": 980, "500": 1550, "1000": 2400 },
    video: "/jazz.mp4",
  },
];

// 保留舊的數據結構以向後兼容
const DELUXE_PAPER_DATA_2 = [
  {
    material: "頂級卡（平面） / 細紋紙",
    single: { "250": 400, "500": 480, "1000": 780 },
    double: { "250": 500, "500": 650, "1000": 930 },
  },
  {
    material:
      "細波紙 / 炫光紙 / 頂級雙面上霧P（均須以雙面計價） / 五色一級卡（銀）",
    single: { "250": 550, "500": 750, "1000": 1150 },
    double: { "250": 690, "500": 900, "1000": 1350 },
  },
  {
    material:
      "頂級象牙（420g） / 永采紙 / 瑞典一級卡 / 雙面局部上光（均須以雙面計價） / 絲絨卡 / 銀箔卡 / 磨砂卡",
    single: { "250": 580, "500": 790, "1000": 1300 },
    double: { "250": 730, "500": 930, "1000": 1580 },
  },
  {
    material:
      "柳葉紙 / 爵士紙 / 絲絨局部上光 / 霧透卡 / 全透卡（最少五盒） / 磨砂冷燙卡（以雙面計價）",
    single: { "250": 790, "500": 1250, "1000": 1800 },
    double: { "250": 980, "500": 1550, "1000": 2400 },
  },
];

// DM 價格表數據
const DM_DATA_100P_DOUBLE_COATED = {
  material: "100P 雙銅紙",
  prices: [
    { qty: 500, single: 899, double: 1399 },
    { qty: 1000, single: 1299, double: 1890 },
    { qty: 2000, single: 2500, double: 3500 },
    { qty: 4000, single: 3990, double: 5200 },
    { qty: 8000, single: 6800, double: 8000 },
    { qty: 12000, single: 8800, double: 10800 },
    { qty: 16000, single: 11800, double: 13800 },
    { qty: 20000, single: 14000, double: 16800 },
    { qty: 24000, single: "另有優惠", double: "另有優惠" },
  ],
};

const DM_DATA_150P_DOUBLE_COATED = {
  material: "150P 雙銅紙",
  prices: [
    { qty: 500, single: 1199, double: 1980 },
    { qty: 1000, single: 1800, double: 2500 },
    { qty: 2000, single: 3900, double: 4800 },
    { qty: 4000, single: 5600, double: 6500 },
    { qty: 8000, single: 9900, double: 11800 },
    { qty: 12000, single: 14800, double: 16800 },
    { qty: 16000, single: 18000, double: 20800 },
    { qty: 20000, single: 20800, double: 23800 },
    { qty: 24000, single: "另有優惠", double: "另有優惠" },
  ],
};

const DM_DATA_80P_DOWLING = {
  material: "80P 道林紙 / 模造紙",
  prices: [
    { qty: 1000, single: 1600, double: 2200 },
    { qty: 2000, single: 2600, double: 3500 },
    { qty: 4000, single: 4000, double: 4900 },
    { qty: 8000, single: 6200, double: 7500 },
    { qty: 12000, single: 8300, double: 10000 },
    { qty: 16000, single: 11500, double: 13500 },
    { qty: 20000, single: 13800, double: 16500 },
    { qty: "20000以上", single: "另有優惠", double: "另有優惠" },
  ],
};

const DM_DATA_100P_DOWLING = {
  material: "100P 道林 / 模造紙",
  prices: [
    { qty: 1000, single: 2300, double: 3300 },
    { qty: 2000, single: 3300, double: 4200 },
    { qty: 4000, single: 5200, double: 6600 },
    { qty: 8000, single: 7900, double: 9200 },
    { qty: 12000, single: 9900, double: 12500 },
    { qty: 16000, single: 13500, double: 15000 },
    { qty: 20000, single: 15800, double: 18800 },
    { qty: "20000以上", single: "另有優惠", double: "另有優惠" },
  ],
};

// 厚棉卡價格表數據（加工類別）
const THICK_COTTON_CARD_DATA = [
  {
    material: "手工超厚棉質卡(80條)",
    single: { "3": 2450, "4": 2900, "5": 3300 },
    double: { "3": 3200, "4": 3600, "5": 4000 },
  },
  {
    material: "超質黑卡(56條),進口美術紙(靛藍250P)",
    single: { "3": 2350, "4": 2650, "5": 2950 },
    double: { "3": 2900, "4": 3200, "5": 3500 },
  },
];

// 其他加工項目價格表數據
// 第一區塊：壓線、切圓角、打孔
const PROCESSING_GROUP_1 = [
  {
    material: "壓線",
    description: ["最小尺寸:80x80MM"],
    baseFee: 300,
    per100Sheets: 40,
    combinedItems: ["切圓角", "打孔"],
  },
];

// 第二區塊：流水號(燙金)
const PROCESSING_GROUP_2 = [
  {
    material: "流水號(燙金)",
    description: [],
    baseFee: 600,
    perSheet: 2,
  },
];

// 第三區塊：軋型費
const PROCESSING_GROUP_3 = [
  {
    material: "軋型費(刀模費另計)",
    description: [],
    within1000: 1500,
    within2000: 2600,
  },
];

// 第四區塊：燙金
const PROCESSING_GROUP_4 = [
  {
    size: "2cm以內",
    plateFee: 200,
    baseFee: 600,
    perSheet: 2,
  },
  {
    size: "2-3cm",
    plateFee: 300,
    baseFee: 750,
    perSheet: 3.5,
  },
  {
    size: "3-5cm",
    plateFee: 450,
    baseFee: 900,
    perSheet: 4.5,
  },
];

// 第五區塊：打凸
const PROCESSING_GROUP_5 = [
  {
    size: "3cm以內",
    plateFee: 400,
    baseFee: 750,
    perSheet: 2.5,
  },
  {
    size: "3-5cm",
    plateFee: 600,
    baseFee: 950,
    perSheet: 4.5,
  },
];

// 其他項目
const OTHER_PROCESSING_DATA: any[] = [];

type TabType = "名片" | "加工" | "DM海報";

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<TabType>("名片");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [currentVideoSrc, setCurrentVideoSrc] = useState<string>("/flat.mp4");
  const [scrollY, setScrollY] = useState(0);
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 滾動監聽
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setScrollY(currentScrollY);
          // 當滾動超過 100px 時，固定 header（僅手機版和平板版）
          setIsHeaderFixed(currentScrollY > 100);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 當 modal 打開時，重置並播放影片
  useEffect(() => {
    console.log("useEffect triggered, isVideoModalOpen:", isVideoModalOpen, "currentVideoSrc:", currentVideoSrc);
    if (isVideoModalOpen && videoRef.current) {
      const video = videoRef.current;
      // 設置新的影片源
      video.src = currentVideoSrc;
      // 重置影片
      video.currentTime = 0;
      video.load();
      // 嘗試播放（可能需要用戶互動）
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("影片自動播放失敗（可能需要用戶點擊）:", error);
        });
      }
    } else if (!isVideoModalOpen && videoRef.current) {
      // 關閉 modal 時暫停影片
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isVideoModalOpen, currentVideoSrc]);

  // 開啟影片 Modal
  const handleOpenVideoModal = (videoSrc: string = "/flat.mp4") => {
    console.log("handleOpenVideoModal called with video:", videoSrc);
    setCurrentVideoSrc(videoSrc);
    setIsVideoModalOpen(true);
    console.log("isVideoModalOpen set to true");
  };

  // 關閉影片 Modal
  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
  };


  return (
    <main className="bg-white text-black min-h-screen relative">
      {/* Header - 固定在頂部（手機版和平板版，僅在滾動時） */}
      <header className={`${isHeaderFixed ? 'fixed' : 'sticky'} lg:relative top-0 left-0 right-0 z-50 py-4 sm:py-6 lg:pt-8 lg:pb-8 lg:pl-8 xl:pl-12 ${isHeaderFixed ? 'bg-white/60 backdrop-blur-md shadow-sm' : 'bg-white lg:bg-transparent'} lg:bg-transparent transition-all duration-300`}>
        <div className="flex items-center justify-between lg:justify-start px-4 sm:px-6 lg:px-0 h-full">
          <div className="flex justify-center lg:justify-start flex-1 lg:flex-none absolute left-1/2 -translate-x-1/2 lg:static lg:left-auto lg:translate-x-0">
            <Link href="/">
              <img
                src="/brand/logo.svg"
                alt="名片王"
                className="h-16 sm:h-24 lg:h-16"
              />
            </Link>
          </div>

          {/* 桌面版導航菜單 */}
          <nav className="hidden lg:flex items-center gap-8 ml-8">
            {NAV.map((item) => (
              item.href.startsWith('/#') ? (
                <a
                  key={item.id}
                  href={item.href}
                  className="hover:opacity-70 transition-opacity text-sm tracking-wide cursor-pointer"
                  style={{ color: 'rgb(255, 127, 127)' }}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.id}
                  href={item.href}
                  className="hover:opacity-70 transition-opacity text-sm tracking-wide cursor-pointer"
                  style={{ color: 'rgb(255, 127, 127)' }}
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          {/* 手機和平板版本的MENU圖標 */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 focus:outline-none"
            style={{ color: 'rgb(255, 127, 127)' }}
            aria-label="選單"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                // X 圖標（關閉）
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                // 漢堡圖標（開啟）
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* 手機和平板版本的導航菜單 */}
        <nav 
          className={`lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-[60] mt-2 overflow-hidden transition-all duration-500 ease-out border-t border-black/10 ${
            isMenuOpen 
              ? 'opacity-100 translate-y-0 max-h-96' 
              : 'opacity-0 -translate-y-4 max-h-0 pointer-events-none'
          }`}
        >
          <div className="flex flex-col px-4 py-4">
              {NAV.map((item) => (
                item.href.startsWith('/#') ? (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-left py-3 px-4 hover:bg-black/5 transition-colors text-base cursor-pointer"
                    style={{ color: 'rgb(255, 127, 127)' }}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-left py-3 px-4 hover:bg-black/5 transition-colors text-base cursor-pointer"
                    style={{ color: 'rgb(255, 127, 127)' }}
                  >
                    {item.label}
                  </Link>
                )
              ))}
          </div>
        </nav>
      </header>

      {/* 標籤切換 */}
      <section className={`py-8 px-6 border-b border-black/10 ${isHeaderFixed ? 'lg:pt-8 pt-24 sm:pt-28' : ''}`}>
        <div className="max-w-7xl mx-auto">
          {/* H1 標題 */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black/70 mb-8 text-center">
            價格表
          </h1>
          {/* 標籤切換 */}
          <div className="flex justify-start gap-4">
            <button
              onClick={() => {
                setIsContentVisible(false);
                setTimeout(() => {
                  setActiveTab("名片");
                  setIsContentVisible(true);
                }, 150);
              }}
              className={`px-6 py-3 text-lg font-medium transition-all duration-300 ${
                activeTab === "名片"
                  ? "text-black border-b-2 border-black"
                  : "text-black/50 hover:text-black/70"
              }`}
            >
              名片
            </button>
            <button
              onClick={() => {
                setIsContentVisible(false);
                setTimeout(() => {
                  setActiveTab("加工");
                  setIsContentVisible(true);
                }, 150);
              }}
              className={`px-6 py-3 text-lg font-medium transition-all duration-300 ${
                activeTab === "加工"
                  ? "text-black border-b-2 border-black"
                  : "text-black/50 hover:text-black/70"
              }`}
            >
              加工
            </button>
            <button
              onClick={() => {
                setIsContentVisible(false);
                setTimeout(() => {
                  setActiveTab("DM海報");
                  setIsContentVisible(true);
                }, 150);
              }}
              className={`px-6 py-3 text-lg font-medium transition-all duration-300 ${
                activeTab === "DM海報"
                  ? "text-black border-b-2 border-black"
                  : "text-black/50 hover:text-black/70"
              }`}
            >
              DM海報
            </button>
          </div>
        </div>
      </section>

      {/* 內容區域 */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div
            className={`transition-all duration-300 ${
              isContentVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {activeTab === "名片" && <BusinessCardSection onOpenVideoModal={handleOpenVideoModal} />}
            {activeTab === "加工" && <ProcessingSection onOpenVideoModal={handleOpenVideoModal} />}
            {activeTab === "DM海報" && <DMPosterSection />}
          </div>
        </div>
      </section>

      <Footer />

      {/* 影片播放 Modal */}
      {(() => {
        console.log("Modal render check, isVideoModalOpen:", isVideoModalOpen);
        return isVideoModalOpen;
      })() && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/80"
          onClick={handleCloseVideoModal}
          style={{ zIndex: 9999, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div
            className="relative w-full max-w-4xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 關閉按鈕 */}
            <button
              onClick={handleCloseVideoModal}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="關閉"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {/* 影片播放器 */}
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                src={currentVideoSrc}
                controls
                autoPlay
                preload="auto"
                playsInline
                muted={false}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const video = e.currentTarget;
                  console.error("影片載入錯誤:", {
                    error: video.error,
                    networkState: video.networkState,
                    readyState: video.readyState,
                  });
                }}
                onLoadedData={() => {
                  console.log("影片資料載入完成");
                }}
                onCanPlay={() => {
                  console.log("影片可以播放");
                }}
              >
                您的瀏覽器不支援影片播放。
              </video>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// Footer 組件
function Footer() {
  return (
    <footer className="mt-40 border-t border-black/5 bg-white px-6 py-24 text-black/60">
      <div className="mx-auto max-w-7xl">
        {/* 上層 */}
        <div className="mb-16 max-w-xl">
          <Link href="/" className="text-sm tracking-[0.28em] text-black/80 hover:text-black transition-colors inline-block">
            台灣名片王
          </Link>
          <p className="mt-4 text-sm leading-relaxed">
            專注於平面設計與印刷製作，  
            為品牌完成每一次重要的呈現。
          </p>
        </div>

        {/* 中層 */}
        <div className="grid gap-12 text-sm md:grid-cols-3">
          <div>
            <div className="mb-3 tracking-wide text-black/80">
              聯絡方式
            </div>
            <div className="space-y-1">
              <div>Tel. 04-22549828</div>
              <div>Email. yunseng.design@msa.hinet.net</div>
              <div className="mt-2">
                <a
                  href="https://line.me/ti/p/@bbh4672t"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-all duration-300"
                  aria-label="LINE ID: @bbh4672t"
                >
                  <img src="/line-icon.svg" alt="LINE" className="w-6 h-6 opacity-50 hover:opacity-100" />
                </a>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-3 tracking-wide text-black/80">
              服務項目
            </div>
            <div className="space-y-1">
              <div>平面設計</div>
              <div>名片與各類印刷品</div>
              <div>後加工製作</div>
            </div>
          </div>

          <div>
            <div className="space-y-1">
              <Link href="/" className="block hover:text-black/80 transition-colors">
                首頁
              </Link>
              <Link href="/pricing" className="block hover:text-black/80 transition-colors">
                價格表
              </Link>
              <Link href="/#contact" className="block hover:text-black/80 transition-colors">
                聯絡我們
              </Link>
            </div>
          </div>
        </div>

        {/* 下層 */}
        <div className="mt-24 text-xs text-black/40">
          © {new Date().getFullYear()} 台灣名片王
        </div>
      </div>
    </footer>
  );
}

// 名片區塊
function BusinessCardSection({ onOpenVideoModal }: { onOpenVideoModal: (videoSrc?: string) => void }) {
  return (
    <div className="space-y-16">
      {/* 常用紙材 */}
      <div className="relative">
        <div className="bg-gray-200 rounded-lg p-4 sm:p-6">
          <table className="w-full border-collapse border border-gray-600 text-xs sm:text-sm">
            <thead>
              {/* 標題和數量標頭 - 同一行 */}
              <tr>
                <th colSpan={2} className="p-0 border-b border-gray-600">
                  <div className="py-3 px-4 text-left">
                    <h3 className="text-2xl font-bold text-black">
                      常用紙材
                    </h3>
                  </div>
                </th>
                <th colSpan={4} className="p-0 border-b border-gray-600">
                  <div className="flex gap-0">
                    <div className="flex-1 text-center py-3 px-2">
                      <span className="text-sm sm:text-base" style={{ color: 'rgb(255, 127, 127)', fontWeight: 800 }}>200張</span>
                    </div>
                    <div className="flex-1 text-center py-3 px-2">
                      <span className="text-sm sm:text-base" style={{ color: 'rgb(255, 127, 127)', fontWeight: 800 }}>300張</span>
                    </div>
                    <div className="flex-1 text-center py-3 px-2">
                      <span className="text-sm sm:text-base" style={{ color: 'rgb(255, 127, 127)', fontWeight: 800 }}>500張</span>
                    </div>
                    <div className="flex-1 text-center py-3 px-2">
                      <span className="text-sm sm:text-base" style={{ color: 'rgb(255, 127, 127)', fontWeight: 800 }}>1000張</span>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <colgroup>
              <col className="w-[35%]" />
              <col className="w-[10%]" />
              <col className="w-[13.75%]" />
              <col className="w-[13.75%]" />
              <col className="w-[13.75%]" />
              <col className="w-[13.75%]" />
            </colgroup>
            <tbody>
              {COMMON_PAPER_DATA_DETAILED.map((row, idx) => {
                // 跳過需要與前一個項目合併的項目
                if ((row as any).isCombinedWithPrevious) {
                  return null;
                }
                
                const hasSingle = row.single !== null;
                const hasDouble = row.double !== null;
                
                // 收集所有後續需要合併的項目
                const combinedRows: typeof row[] = [];
                let nextIdx = idx + 1;
                while (nextIdx < COMMON_PAPER_DATA_DETAILED.length) {
                  const nextRow = COMMON_PAPER_DATA_DETAILED[nextIdx];
                  if ((nextRow as any).isCombinedWithPrevious) {
                    combinedRows.push(nextRow);
                    nextIdx++;
                  } else {
                    break;
                  }
                }
                
                // 從合併項目中提取 single 和 double
                let combinedSingle = null;
                let combinedDouble = null;
                combinedRows.forEach(combinedRow => {
                  if (combinedRow.single) {
                    combinedSingle = combinedRow.single;
                  }
                  if (combinedRow.double) {
                    combinedDouble = combinedRow.double;
                  }
                });
                
                // 確定最終的 single 和 double
                const finalSingle = hasSingle ? row.single : combinedSingle;
                const finalDouble = hasDouble ? row.double : combinedDouble;
                const finalHasSingle = finalSingle !== null;
                const finalHasDouble = finalDouble !== null;
                
                const rowSpan = (finalHasSingle && finalHasDouble) ? 2 : 1;
                
                // 如果有合併項目或者主項目有價格，才渲染
                if (!finalHasSingle && !finalHasDouble) {
                  return null;
                }
                
                return (
                  <React.Fragment key={idx}>
                    {finalHasSingle && (
                      <tr className={`border-b border-gray-600 ${idx === 0 ? 'border-t border-gray-600' : ''}`}>
                        <td
                          rowSpan={rowSpan}
                          className="py-4 px-3 sm:py-5 sm:px-4 align-top border-r border-gray-600"
                        >
                          <div className="space-y-1">
                            <div
                              className="text-black text-lg sm:text-xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={(e) => {
                                if (row.video && onOpenVideoModal) {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  onOpenVideoModal(row.video);
                                }
                              }}
                              role={row.video ? "button" : undefined}
                              tabIndex={row.video ? 0 : undefined}
                            >
                              {row.material}
                            </div>
                            {row.description.map((desc, i) => (
                              <div key={i} className="text-gray-600 text-xs sm:text-sm">
                                {desc}
                              </div>
                            ))}
                            {row.spec && (
                              <div className="text-gray-600 text-xs sm:text-sm">
                                {row.spec}
                              </div>
                            )}
                            {/* 顯示所有合併項目的信息 */}
                            {combinedRows.map((combinedRow, combinedIdx) => (
                              <React.Fragment key={combinedIdx}>
                                <div className="text-black text-lg sm:text-xl font-bold mt-2 cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={(e) => {
                                    if (combinedRow.video && onOpenVideoModal) {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      onOpenVideoModal(combinedRow.video);
                                    }
                                  }}
                                  role={combinedRow.video ? "button" : undefined}
                                  tabIndex={combinedRow.video ? 0 : undefined}
                                >
                                  {combinedRow.material}
                                </div>
                                {combinedRow.description.map((desc, i) => (
                                  <div key={`combined-${combinedIdx}-${i}`} className="text-gray-600 text-xs sm:text-sm">
                                    {desc}
                                  </div>
                                ))}
                                {combinedRow.spec && (
                                  <div className="text-gray-600 text-xs sm:text-sm">
                                    {combinedRow.spec}
                                  </div>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-bold text-sm sm:text-base border-r border-gray-600">
                          單面
                        </td>
                        <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600">
                          {finalSingle?.["200"] ? `$${finalSingle["200"]}` : <span className="text-gray-500">/</span>}
                        </td>
                        <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600">
                          {finalSingle?.["300"] ? `$${finalSingle["300"]}` : <span className="text-gray-500">/</span>}
                        </td>
                        <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600">
                          {finalSingle?.["500"] ? `$${finalSingle["500"]}` : <span className="text-gray-500">/</span>}
                        </td>
                        <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600">
                          {finalSingle?.["1000"] ? `$${finalSingle["1000"]}` : <span className="text-gray-500">/</span>}
                        </td>
                      </tr>
                    )}
                    {finalHasDouble && (
                      <tr className={`border-b border-gray-600 ${idx === 0 && !finalHasSingle ? 'border-t border-gray-600' : ''}`}>
                        {!finalHasSingle && (
                          <td
                            rowSpan={1}
                            className="py-4 px-3 sm:py-5 sm:px-4 align-top border-r border-gray-600"
                          >
                            <div className="space-y-1">
                              <div
                                className="text-black text-lg sm:text-xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={(e) => {
                                  if (row.video && onOpenVideoModal) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onOpenVideoModal(row.video);
                                  }
                                }}
                                role={row.video ? "button" : undefined}
                                tabIndex={row.video ? 0 : undefined}
                              >
                                {row.material}
                              </div>
                              {row.description.map((desc, i) => (
                                <div key={i} className="text-gray-600 text-xs sm:text-sm">
                                  {desc}
                                </div>
                              ))}
                              {row.spec && (
                                <div className="text-gray-600 text-xs sm:text-sm">
                                  {row.spec}
                                </div>
                              )}
                              {/* 顯示所有合併項目的信息 */}
                              {combinedRows.map((combinedRow, combinedIdx) => (
                                <React.Fragment key={combinedIdx}>
                                  <div className="text-black text-lg sm:text-xl font-bold mt-2 cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={(e) => {
                                      if (combinedRow.video && onOpenVideoModal) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onOpenVideoModal(combinedRow.video);
                                      }
                                    }}
                                    role={combinedRow.video ? "button" : undefined}
                                    tabIndex={combinedRow.video ? 0 : undefined}
                                  >
                                    {combinedRow.material}
                                  </div>
                                  {combinedRow.description.map((desc, i) => (
                                    <div key={`combined-${combinedIdx}-${i}`} className="text-gray-600 text-xs sm:text-sm">
                                      {desc}
                                    </div>
                                  ))}
                                  {combinedRow.spec && (
                                    <div className="text-gray-600 text-xs sm:text-sm">
                                      {combinedRow.spec}
                                    </div>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </td>
                        )}
                        <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-bold text-sm sm:text-base border-r border-gray-600 bg-gray-300">
                          雙面
                        </td>
                        <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600 bg-gray-300">
                          {finalDouble?.["200"] ? `$${finalDouble["200"]}` : <span className="text-gray-500">/</span>}
                        </td>
                        <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600 bg-gray-300">
                          {finalDouble?.["300"] ? `$${finalDouble["300"]}` : <span className="text-gray-500">/</span>}
                        </td>
                        <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600 bg-gray-300">
                          {finalDouble?.["500"] ? `$${finalDouble["500"]}` : <span className="text-gray-500">/</span>}
                        </td>
                        <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600 bg-gray-300">
                          {finalDouble?.["1000"] ? `$${finalDouble["1000"]}` : <span className="text-gray-500">/</span>}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 精緻紙材 */}
      <div className="space-y-16">
        {/* 第一組：星幻紙 / 立體銀（200/300/500/1000張） */}
        <div className="relative">
          <div className="bg-gray-200 rounded-lg p-4 sm:p-6">
            <table className="w-full border-collapse border border-gray-600 text-xs sm:text-sm">
              <thead>
                {/* 標題和數量標頭 - 同一行 */}
                <tr>
                  <th colSpan={2} className="p-0 border-b border-gray-600">
                    <div className="py-3 px-4 text-left">
                      <h3 className="text-2xl font-bold text-black">
                        精緻紙材
                      </h3>
                    </div>
                  </th>
                  <th colSpan={4} className="p-0 border-b border-gray-600">
                    <div className="flex gap-0">
                      <div className="flex-1 text-center py-3 px-2">
                        <span className="text-sm sm:text-base" style={{ color: 'rgb(255, 127, 127)', fontWeight: 800 }}>200張</span>
                      </div>
                      <div className="flex-1 text-center py-3 px-2">
                        <span className="text-sm sm:text-base" style={{ color: 'rgb(255, 127, 127)', fontWeight: 800 }}>300張</span>
                      </div>
                      <div className="flex-1 text-center py-3 px-2">
                        <span className="text-sm sm:text-base" style={{ color: 'rgb(255, 127, 127)', fontWeight: 800 }}>500張</span>
                      </div>
                      <div className="flex-1 text-center py-3 px-2">
                        <span className="text-sm sm:text-base" style={{ color: 'rgb(255, 127, 127)', fontWeight: 800 }}>1000張</span>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <colgroup>
                <col className="w-[35%]" />
                <col className="w-[10%]" />
                <col className="w-[13.75%]" />
                <col className="w-[13.75%]" />
                <col className="w-[13.75%]" />
                <col className="w-[13.75%]" />
              </colgroup>
              <tbody>
                {DELUXE_PAPER_DATA_1_DETAILED.map((row, idx) => {
                  // 跳過需要與前一個項目合併的項目
                  if ((row as any).isCombinedWithPrevious) {
                    return null;
                  }
                  
                  const hasSingle = row.single !== null;
                  const hasDouble = row.double !== null;
                  
                  // 收集所有後續需要合併的項目
                  const combinedRows: typeof row[] = [];
                  let nextIdx = idx + 1;
                  while (nextIdx < DELUXE_PAPER_DATA_1_DETAILED.length) {
                    const nextRow = DELUXE_PAPER_DATA_1_DETAILED[nextIdx];
                    if ((nextRow as any).isCombinedWithPrevious) {
                      combinedRows.push(nextRow);
                      nextIdx++;
                    } else {
                      break;
                    }
                  }
                  
                  // 從合併項目中提取 single 和 double
                  let combinedSingle = null;
                  let combinedDouble = null;
                  combinedRows.forEach(combinedRow => {
                    if (combinedRow.single) {
                      combinedSingle = combinedRow.single;
                    }
                    if (combinedRow.double) {
                      combinedDouble = combinedRow.double;
                    }
                  });
                  
                  // 確定最終的 single 和 double
                  const finalSingle = hasSingle ? row.single : combinedSingle;
                  const finalDouble = hasDouble ? row.double : combinedDouble;
                  const finalHasSingle = finalSingle !== null;
                  const finalHasDouble = finalDouble !== null;
                  
                  const rowSpan = (finalHasSingle && finalHasDouble) ? 2 : 1;
                  
                  // 如果有合併項目或者主項目有價格，才渲染
                  if (!finalHasSingle && !finalHasDouble) {
                    return null;
                  }
                  
                  return (
                    <React.Fragment key={idx}>
                      {finalHasSingle && (
                        <tr className={`border-b border-gray-600 ${idx === 0 ? 'border-t border-gray-600' : ''}`}>
                          <td
                            rowSpan={rowSpan}
                            className="py-4 px-3 sm:py-5 sm:px-4 align-top border-r border-gray-600"
                          >
                            <div className="space-y-1">
                              <div
                                className="text-black text-lg sm:text-xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={(e) => {
                                  if (row.video && onOpenVideoModal) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onOpenVideoModal(row.video);
                                  }
                                }}
                                role={row.video ? "button" : undefined}
                                tabIndex={row.video ? 0 : undefined}
                              >
                                {row.material}
                              </div>
                              {row.description.map((desc, i) => (
                                <div key={i} className="text-gray-600 text-xs sm:text-sm">
                                  {desc}
                                </div>
                              ))}
                              {row.spec && (
                                <div className="text-gray-600 text-xs sm:text-sm">
                                  {row.spec}
                                </div>
                              )}
                              {/* 顯示所有合併項目的信息 */}
                              {combinedRows.map((combinedRow, combinedIdx) => (
                                <React.Fragment key={combinedIdx}>
                                  <div className="text-black text-lg sm:text-xl font-bold mt-2 cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={(e) => {
                                      if (combinedRow.video && onOpenVideoModal) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onOpenVideoModal(combinedRow.video);
                                      }
                                    }}
                                    role={combinedRow.video ? "button" : undefined}
                                    tabIndex={combinedRow.video ? 0 : undefined}
                                  >
                                    {combinedRow.material}
                                  </div>
                                  {combinedRow.description.map((desc, i) => (
                                    <div key={`combined-${combinedIdx}-${i}`} className="text-gray-600 text-xs sm:text-sm">
                                      {desc}
                                    </div>
                                  ))}
                                  {combinedRow.spec && (
                                    <div className="text-gray-600 text-xs sm:text-sm">
                                      {combinedRow.spec}
                                    </div>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-bold text-sm sm:text-base border-r border-gray-600">
                            單面
                          </td>
                          <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600">
                            {finalSingle?.["200"] ? `$${finalSingle["200"]}` : <span className="text-gray-500">/</span>}
                          </td>
                          <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600">
                            {finalSingle?.["300"] ? `$${finalSingle["300"]}` : <span className="text-gray-500">/</span>}
                          </td>
                          <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600">
                            {finalSingle?.["500"] ? `$${finalSingle["500"]}` : <span className="text-gray-500">/</span>}
                          </td>
                          <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600">
                            {finalSingle?.["1000"] ? `$${finalSingle["1000"]}` : <span className="text-gray-500">/</span>}
                          </td>
                        </tr>
                      )}
                      {finalHasDouble && (
                        <tr className={`border-b border-gray-600 ${idx === 0 && !finalHasSingle ? 'border-t border-gray-600' : ''}`}>
                          {!finalHasSingle && (
                            <td
                              rowSpan={1}
                              className="py-4 px-3 sm:py-5 sm:px-4 align-top border-r border-gray-600"
                            >
                              <div className="space-y-1">
                                <div
                                  className="text-black text-lg sm:text-xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={(e) => {
                                    if (row.video && onOpenVideoModal) {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      onOpenVideoModal(row.video);
                                    }
                                  }}
                                  role={row.video ? "button" : undefined}
                                  tabIndex={row.video ? 0 : undefined}
                                >
                                  {row.material}
                                </div>
                                {row.description.map((desc, i) => (
                                  <div key={i} className="text-gray-600 text-xs sm:text-sm">
                                    {desc}
                                  </div>
                                ))}
                                {row.spec && (
                                  <div className="text-gray-600 text-xs sm:text-sm">
                                    {row.spec}
                                  </div>
                                )}
                                {/* 顯示所有合併項目的信息 */}
                                {combinedRows.map((combinedRow, combinedIdx) => (
                                  <React.Fragment key={combinedIdx}>
                                    <div className="text-black text-lg sm:text-xl font-bold mt-2 cursor-pointer hover:opacity-80 transition-opacity"
                                      onClick={(e) => {
                                        if (combinedRow.video && onOpenVideoModal) {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          onOpenVideoModal(combinedRow.video);
                                        }
                                      }}
                                      role={combinedRow.video ? "button" : undefined}
                                      tabIndex={combinedRow.video ? 0 : undefined}
                                    >
                                      {combinedRow.material}
                                    </div>
                                    {combinedRow.description.map((desc, i) => (
                                      <div key={`combined-${combinedIdx}-${i}`} className="text-gray-600 text-xs sm:text-sm">
                                        {desc}
                                      </div>
                                    ))}
                                    {combinedRow.spec && (
                                      <div className="text-gray-600 text-xs sm:text-sm">
                                        {combinedRow.spec}
                                      </div>
                                    )}
                                  </React.Fragment>
                                ))}
                            </div>
                          </td>
                        )}
                        <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-bold text-sm sm:text-base border-r border-gray-600 bg-gray-300">
                          雙面
                        </td>
                        <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600 bg-gray-300">
                          {finalDouble?.["200"] ? `$${finalDouble["200"]}` : <span className="text-gray-500">/</span>}
                        </td>
                        <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600 bg-gray-300">
                          {finalDouble?.["300"] ? `$${finalDouble["300"]}` : <span className="text-gray-500">/</span>}
                        </td>
                        <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600 bg-gray-300">
                          {finalDouble?.["500"] ? `$${finalDouble["500"]}` : <span className="text-gray-500">/</span>}
                        </td>
                        <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600 bg-gray-300">
                          {finalDouble?.["1000"] ? `$${finalDouble["1000"]}` : <span className="text-gray-500">/</span>}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        </div>

        {/* 第二組：其他精緻紙材（250/500/1000張） */}
        <div className="relative">
          <div className="bg-gray-200 rounded-lg p-4 sm:p-6">
            <table className="w-full border-collapse border border-gray-600 text-xs sm:text-sm">
              <thead>
                {/* 標題和數量標頭 - 同一行 */}
                <tr>
                  <th colSpan={2} className="p-0 border-b border-gray-600">
                    <div className="py-3 px-4 text-left">
                      <h3 className="text-2xl font-bold text-black">
                        精緻紙材
                      </h3>
                    </div>
                  </th>
                  <th colSpan={3} className="p-0 border-b border-gray-600">
                    <div className="flex gap-0">
                      <div className="flex-1 text-center py-3 px-2">
                        <span className="text-sm sm:text-base" style={{ color: 'rgb(255, 127, 127)', fontWeight: 800 }}>250張</span>
                      </div>
                      <div className="flex-1 text-center py-3 px-2">
                        <span className="text-sm sm:text-base" style={{ color: 'rgb(255, 127, 127)', fontWeight: 800 }}>500張</span>
                      </div>
                      <div className="flex-1 text-center py-3 px-2">
                        <span className="text-sm sm:text-base" style={{ color: 'rgb(255, 127, 127)', fontWeight: 800 }}>1000張</span>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <colgroup>
                <col className="w-[35%]" />
                <col className="w-[10%]" />
                <col className="w-[18.33%]" />
                <col className="w-[18.33%]" />
                <col className="w-[18.33%]" />
              </colgroup>
              <tbody>
                {DELUXE_PAPER_DATA_2_DETAILED.map((row, idx) => {
                  // 跳過需要與前一個項目合併的項目
                  if ((row as any).isCombinedWithPrevious) {
                    return null;
                  }
                  
                  const hasSingle = row.single !== null;
                  const hasDouble = row.double !== null;
                  
                  // 收集所有後續需要合併的項目
                  const combinedRows: typeof row[] = [];
                  let nextIdx = idx + 1;
                  while (nextIdx < DELUXE_PAPER_DATA_2_DETAILED.length) {
                    const nextRow = DELUXE_PAPER_DATA_2_DETAILED[nextIdx];
                    if ((nextRow as any).isCombinedWithPrevious) {
                      combinedRows.push(nextRow);
                      nextIdx++;
                    } else {
                      break;
                    }
                  }
                  
                  // 從合併項目中提取 single 和 double
                  let combinedSingle = null;
                  let combinedDouble = null;
                  combinedRows.forEach(combinedRow => {
                    if (combinedRow.single) {
                      combinedSingle = combinedRow.single;
                    }
                    if (combinedRow.double) {
                      combinedDouble = combinedRow.double;
                    }
                  });
                  
                  // 確定最終的 single 和 double
                  const finalSingle = hasSingle ? row.single : combinedSingle;
                  const finalDouble = hasDouble ? row.double : combinedDouble;
                  const finalHasSingle = finalSingle !== null;
                  const finalHasDouble = finalDouble !== null;
                  
                  const rowSpan = (finalHasSingle && finalHasDouble) ? 2 : 1;
                  
                  // 如果有合併項目或者主項目有價格，才渲染
                  if (!finalHasSingle && !finalHasDouble) {
                    return null;
                  }
                  
                  return (
                    <React.Fragment key={idx}>
                      {finalHasSingle && (
                        <tr className={`border-b border-gray-600 ${idx === 0 ? 'border-t border-gray-600' : ''}`}>
                          <td
                            rowSpan={rowSpan}
                            className="py-4 px-3 sm:py-5 sm:px-4 align-top border-r border-gray-600"
                          >
                            <div className="space-y-1">
                              <div
                                className="text-black text-lg sm:text-xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={(e) => {
                                  if (row.video && onOpenVideoModal) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onOpenVideoModal(row.video);
                                  }
                                }}
                                role={row.video ? "button" : undefined}
                                tabIndex={row.video ? 0 : undefined}
                              >
                                {row.material}
                              </div>
                              {row.description.length > 0 && row.description.map((desc: string, i: number) => (
                                <div key={i} className="text-gray-600 text-xs sm:text-sm">
                                  {desc}
                                </div>
                              ))}
                              {row.spec && (
                                <div className="text-gray-600 text-xs sm:text-sm">
                                  {row.spec}
                                </div>
                              )}
                              {/* 顯示所有合併項目的信息 */}
                              {combinedRows.map((combinedRow, combinedIdx) => (
                                <React.Fragment key={combinedIdx}>
                                  <div className="text-black text-lg sm:text-xl font-bold mt-2 cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={(e) => {
                                      if (combinedRow.video && onOpenVideoModal) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onOpenVideoModal(combinedRow.video);
                                      }
                                    }}
                                    role={combinedRow.video ? "button" : undefined}
                                    tabIndex={combinedRow.video ? 0 : undefined}
                                  >
                                    {combinedRow.material}
                                  </div>
                                  {combinedRow.description.length > 0 && combinedRow.description.map((desc, i) => (
                                    <div key={`combined-${combinedIdx}-${i}`} className="text-gray-600 text-xs sm:text-sm">
                                      {desc}
                                    </div>
                                  ))}
                                  {combinedRow.spec && (
                                    <div className="text-gray-600 text-xs sm:text-sm">
                                      {combinedRow.spec}
                                    </div>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-bold text-sm sm:text-base border-r border-gray-600">
                            單面
                          </td>
                          <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600">
                            {finalSingle?.["250"] ? `$${finalSingle["250"]}` : <span className="text-gray-500">/</span>}
                          </td>
                          <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600">
                            {finalSingle?.["500"] ? `$${finalSingle["500"]}` : <span className="text-gray-500">/</span>}
                          </td>
                          <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600">
                            {finalSingle?.["1000"] ? `$${finalSingle["1000"]}` : <span className="text-gray-500">/</span>}
                          </td>
                        </tr>
                      )}
                      {finalHasDouble && (
                        <tr className="border-b border-gray-600">
                          {!finalHasSingle && (
                            <td
                              rowSpan={1}
                              className="py-4 px-3 sm:py-5 sm:px-4 align-top border-r border-gray-600"
                            >
                              <div className="space-y-1">
                                <div
                                  className="text-black text-lg sm:text-xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={(e) => {
                                    if (row.video && onOpenVideoModal) {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      onOpenVideoModal(row.video);
                                    }
                                  }}
                                  role={row.video ? "button" : undefined}
                                  tabIndex={row.video ? 0 : undefined}
                                >
                                  {row.material}
                                </div>
                                {row.description.length > 0 && row.description.map((desc: string, i: number) => (
                                  <div key={i} className="text-gray-600 text-xs sm:text-sm">
                                    {desc}
                                  </div>
                                ))}
                                {row.spec && (
                                  <div className="text-gray-600 text-xs sm:text-sm">
                                    {row.spec}
                                  </div>
                                )}
                                {/* 顯示所有合併項目的信息 */}
                                {combinedRows.map((combinedRow, combinedIdx) => (
                                  <React.Fragment key={combinedIdx}>
                                    <div className="text-black text-lg sm:text-xl font-bold mt-2 cursor-pointer hover:opacity-80 transition-opacity"
                                      onClick={(e) => {
                                        if (combinedRow.video && onOpenVideoModal) {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          onOpenVideoModal(combinedRow.video);
                                        }
                                      }}
                                      role={combinedRow.video ? "button" : undefined}
                                      tabIndex={combinedRow.video ? 0 : undefined}
                                    >
                                      {combinedRow.material}
                                    </div>
                                    {combinedRow.description.length > 0 && combinedRow.description.map((desc, i) => (
                                      <div key={`combined-${combinedIdx}-${i}`} className="text-gray-600 text-xs sm:text-sm">
                                        {desc}
                                      </div>
                                    ))}
                                    {combinedRow.spec && (
                                      <div className="text-gray-600 text-xs sm:text-sm">
                                        {combinedRow.spec}
                                      </div>
                                    )}
                                  </React.Fragment>
                                ))}
                              </div>
                            </td>
                          )}
                          <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-bold text-sm sm:text-base border-r border-gray-600 bg-gray-300">
                            雙面
                          </td>
                          <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600 bg-gray-300">
                            {finalDouble?.["250"] ? `$${finalDouble["250"]}` : <span className="text-gray-500">/</span>}
                          </td>
                          <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600 bg-gray-300">
                            {finalDouble?.["500"] ? `$${finalDouble["500"]}` : <span className="text-gray-500">/</span>}
                          </td>
                          <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600 bg-gray-300">
                            {finalDouble?.["1000"] ? `$${finalDouble["1000"]}` : <span className="text-gray-500">/</span>}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 精緻紙材提醒卡片 */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-[1] w-full md:w-auto space-y-6">
          <div className="bg-white border border-black/10 rounded-lg p-4 sm:p-6 shadow-sm">
            <h3 className="text-xl font-light tracking-wide mb-6 text-black/90">
              注意事項
            </h3>
            <div className="space-y-4 text-sm text-black/70 leading-relaxed">
              <ul className="space-y-2 list-disc list-inside">
                <li>價格為現金價，不含 5% 營業稅及運費。</li>
                <li>若需開立發票或收據，請提前告知。</li>
                <li>請自備完整的美工繪圖電子檔（以上報價均不含設計）。</li>
                <li>
                  名片校稿無誤後，
                  <strong className="text-black/90">3 個工作天</strong>
                  交貨（印刷時間為星期一至星期五）。
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white border border-black/10 rounded-lg p-4 sm:p-6 shadow-sm">
            <h3 className="text-xl font-light tracking-wide mb-6 text-black/90">
              代客製作檔案費用
            </h3>
            <div className="space-y-6 text-sm text-black/70 leading-relaxed">
              <div>
                <p className="mb-2">
                  <strong className="text-black/90">1. 設計加排版：</strong>
                </p>
                <ul className="ml-6 space-y-1 list-disc">
                  <li>
                    單面：
                    <span className="text-red-600 font-medium">1,980</span>
                  </li>
                  <li>
                    雙面：
                    <span className="text-red-600 font-medium">2,980</span>
                  </li>
                  <li>
                    以上報價含
                    <strong className="text-black/90">二次校稿</strong>
                    ，超過每次加收{" "}
                    <span className="text-red-600 font-medium">100</span>。
                  </li>
                </ul>
              </div>

              <div>
                <p className="mb-2">
                  <strong className="text-black/90">2. 純文字排版：</strong>
                </p>
                <ul className="ml-6 space-y-1 list-disc">
                  <li>
                    單面：
                    <span className="text-red-600 font-medium">800</span>
                  </li>
                  <li>
                    雙面：
                    <span className="text-red-600 font-medium">1,600</span>
                  </li>
                  <li>
                    以上報價含
                    <strong className="text-black/90">二次校稿</strong>
                    ，超過每次加收{" "}
                    <span className="text-red-600 font-medium">100</span>。
                  </li>
                </ul>
              </div>

              <div>
                <p className="mb-2">
                  <strong className="text-black/90">
                    3. 以上設計費為搭配本公司印刷之優惠價，恕不提供印刷檔案。
                  </strong>
                </p>
                <p className="ml-6">
                  如需提供印刷檔案，需補足差額：單面{" "}
                  <span className="text-red-600 font-medium">600</span>、雙面{" "}
                  <span className="text-red-600 font-medium">800</span>。
                </p>
              </div>

              <div>
                <p className="mb-2">
                  <strong className="text-black/90">
                    4. 若不搭配本公司印刷優惠價：
                  </strong>
                </p>
                <p className="ml-6">
                  設計排版費用則為單面{" "}
                  <span className="text-red-600 font-medium">2,580</span>
                  、雙面{" "}
                  <span className="text-red-600 font-medium">3,780</span>。
                </p>
              </div>

              <div>
                <p>
                  <strong className="text-black/90">
                    5. 設計費只收第一次製版費用
                  </strong>
                  ，更改姓名以及內容資料文字不另加收費用。
                </p>
              </div>

              <div>
                <p>
                  <strong className="text-black/90">
                    6. 稿件確認無誤後，需先支付印製費用方可進行印刷
                  </strong>
                  （貨到付款方式除外）。
                </p>
              </div>

              <div>
                <p>
                  <strong className="text-black/90">
                    7.
                    本公司網頁之名片及海報公版版權皆屬於本公司所擁有，拷貝翻印必究。
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 加工區塊（燙金名片）
function ProcessingSection({ onOpenVideoModal }: { onOpenVideoModal: (videoSrc?: string) => void }) {
  const [showProductImages, setShowProductImages] = useState(false);

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <div className="flex-[2] w-full md:w-auto">
        {/* 實際成品圖片 Modal */}
        {showProductImages && (
          <div
            className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4"
            onClick={() => setShowProductImages(false)}
          >
            <div
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-black/90">
                  實際成品
                </h3>
                <button
                  onClick={() => setShowProductImages(false)}
                  className="text-black/60 hover:text-black/90 transition-colors"
                  aria-label="關閉"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <img
                  src="/cottoncard-1.jpg"
                  alt="實際成品 1"
                  className="w-full h-auto rounded"
                />
                <img
                  src="/cottoncard-2.jpg"
                  alt="實際成品 2"
                  className="w-full h-auto rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* 優惠燙金名片價格表 */}
        <div className="bg-gray-200 rounded-lg p-4 sm:p-6">
          <table className="w-full border-collapse border border-gray-600 text-xs sm:text-sm">
            <thead>
              {/* 標題和數量標頭 - 同一行 */}
              <tr>
                <th colSpan={2} className="p-0 border-b border-gray-600">
                  <div className="py-3 px-4 text-left">
                    <h3 className="text-2xl font-bold text-black">
                      優惠燙金名片
                    </h3>
                  </div>
                </th>
                <th colSpan={3} className="p-0 border-b border-gray-600">
                  <div className="flex gap-0">
                    <div className="flex-1 text-center py-3 px-2">
                      <span className="text-sm sm:text-base" style={{ color: 'rgb(255, 127, 127)', fontWeight: 800 }}>3盒</span>
                    </div>
                    <div className="flex-1 text-center py-3 px-2">
                      <span className="text-sm sm:text-base" style={{ color: 'rgb(255, 127, 127)', fontWeight: 800 }}>4盒</span>
                    </div>
                    <div className="flex-1 text-center py-3 px-2">
                      <span className="text-sm sm:text-base" style={{ color: 'rgb(255, 127, 127)', fontWeight: 800 }}>5盒</span>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <colgroup>
              <col className="w-[35%]" />
              <col className="w-[15%]" />
              <col className="w-[16.67%]" />
              <col className="w-[16.67%]" />
              <col className="w-[16.67%]" />
            </colgroup>
            <tbody>
              {THICK_COTTON_CARD_DATA.map((row, idx) => (
                <React.Fragment key={idx}>
                  <tr className={`border-b border-gray-600 ${idx === 0 ? 'border-t border-gray-600' : ''}`}>
                    <td
                      rowSpan={2}
                      className="py-4 px-3 sm:py-5 sm:px-4 align-top border-r border-gray-600"
                    >
                      <div className="space-y-1">
                        <div className="text-black text-lg sm:text-xl font-bold break-words">
                          {row.material === "超質黑卡(56條),進口美術紙(靛藍250P)" ? (
                            <>
                              <span
                                className="cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (onOpenVideoModal) {
                                    onOpenVideoModal("/black_card.mp4");
                                  }
                                }}
                                role="button"
                                tabIndex={0}
                              >
                                超質黑卡(56條)
                              </span>
                              <span>,進口美術紙(靛藍250P)</span>
                            </>
                          ) : row.material === "手工超厚棉質卡(80條)" ? (
                            <span
                              className="cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowProductImages(true);
                              }}
                              role="button"
                              tabIndex={0}
                            >
                              {row.material}
                            </span>
                          ) : (
                            <span>{row.material}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-bold text-sm sm:text-base border-r border-gray-600">
                      單面
                    </td>
                    <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600">
                      {row.single["3"] ? `$${row.single["3"]}` : <span className="text-gray-500">/</span>}
                    </td>
                    <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600">
                      {row.single["4"] ? `$${row.single["4"]}` : <span className="text-gray-500">/</span>}
                    </td>
                    <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600">
                      {row.single["5"] ? `$${row.single["5"]}` : <span className="text-gray-500">/</span>}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-600">
                    <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-bold text-sm sm:text-base border-r border-gray-600 bg-gray-300">
                      雙面
                    </td>
                    <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600 bg-gray-300">
                      {row.double["3"] ? `$${row.double["3"]}` : <span className="text-gray-500">/</span>}
                    </td>
                    <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600 bg-gray-300">
                      {row.double["4"] ? `$${row.double["4"]}` : <span className="text-gray-500">/</span>}
                    </td>
                    <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600 bg-gray-300">
                      {row.double["5"] ? `$${row.double["5"]}` : <span className="text-gray-500">/</span>}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {/* 燙金顏色 */}
          <div className="mt-6">
            <h4 className="text-lg font-medium mb-3 text-black/80">燙金顏色</h4>
            <div className="flex flex-wrap gap-3 items-center">
              {/* 黑金 */}
              <div className="relative group cursor-pointer">
                <img
                  src="/black.svg"
                  alt="黑金"
                  className="w-6 h-6"
                />
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black/80 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  黑金
                </span>
              </div>
              {/* 金色 */}
              <div className="relative group cursor-pointer">
                <img
                  src="/gold.svg"
                  alt="金色"
                  className="w-6 h-6"
                />
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black/80 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  金色
                </span>
              </div>
              {/* 古銅金 */}
              <div className="relative group cursor-pointer">
                <img
                  src="/Bronze.svg"
                  alt="古銅金"
                  className="w-6 h-6"
                />
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black/80 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  古銅金
                </span>
              </div>
              {/* 銀色 */}
              <div className="relative group cursor-pointer">
                <img
                  src="/silver.svg"
                  alt="銀色"
                  className="w-6 h-6"
                />
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black/80 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  銀色
                </span>
              </div>
              {/* 深銅亮金 */}
              <div className="relative group cursor-pointer">
                <img
                  src="/rose-gold.svg"
                  alt="深銅亮金"
                  className="w-6 h-6"
                />
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black/80 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  深銅亮金
                </span>
              </div>
            </div>
            <p className="text-sm text-black/60 mt-3">
              （若選擇其它燙金色費用另計）
            </p>
          </div>
        </div>

        {/* 其他加工項目價格表 */}
        <div className="mt-16 space-y-8">
          {/* 第一區塊：壓線、切圓角、打孔 */}
          <div className="bg-gray-200 rounded-lg p-4 sm:p-6">
            <table className="w-full border-collapse border border-gray-600 text-xs sm:text-sm">
              <thead>
                <tr>
                  <th colSpan={1} className="p-0 border-b border-gray-600">
                    <div className="py-3 px-4 text-left">
                      <h3 className="text-2xl font-bold text-black">
                        其他加工項目
                      </h3>
                    </div>
                  </th>
                  <th colSpan={1} className="p-0 border-b border-gray-600">
                    <div className="py-3 px-4 text-center">
                      <span className="text-sm sm:text-base" style={{ color: 'rgb(255, 127, 127)', fontWeight: 800 }}>基本費</span>
                    </div>
                  </th>
                  <th colSpan={1} className="p-0 border-b border-gray-600">
                    <div className="py-3 px-4 text-center">
                      <span className="text-sm sm:text-base" style={{ color: 'rgb(255, 127, 127)', fontWeight: 800 }}>100張</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <colgroup>
                <col className="w-[40%]" />
                <col className="w-[30%]" />
                <col className="w-[30%]" />
              </colgroup>
              <tbody>
                {PROCESSING_GROUP_1.map((row, idx) => {
                  const combinedItemsCount = row.combinedItems ? row.combinedItems.length : 0;
                  const totalRowSpan = 1 + combinedItemsCount;
                  
                  return (
                    <tr key={idx} className={`border-b border-gray-600 ${idx === 0 ? 'border-t border-gray-600' : ''}`}>
                      <td
                        rowSpan={totalRowSpan}
                        className="py-4 px-3 sm:py-5 sm:px-4 align-top border-r border-gray-600"
                      >
                        <div className="space-y-1">
                          <div className="text-black text-lg sm:text-xl font-bold break-words">
                            {row.material}
                          </div>
                          {row.description.length > 0 && row.description.map((desc: string, i: number) => (
                            <div key={i} className="text-gray-600 text-xs sm:text-sm">
                              {desc}
                            </div>
                          ))}
                          {row.combinedItems && row.combinedItems.map((combinedItem, combinedIdx) => (
                            <div key={combinedIdx} className="text-black text-lg sm:text-xl font-bold break-words mt-2">
                              {combinedItem}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600">
                        ${row.baseFee}
                      </td>
                      <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600">
                        ${row.per100Sheets}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 第二區塊：流水號(燙金) */}
          <div className="bg-gray-200 rounded-lg p-4 sm:p-6">
            <table className="w-full border-collapse border border-gray-600 text-xs sm:text-sm">
              <thead>
                <tr>
                  <th colSpan={1} className="p-0 border-b border-gray-600">
                    <div className="py-3 px-4 text-left">
                      <h3 className="text-2xl font-bold text-black">
                        其他加工項目
                      </h3>
                    </div>
                  </th>
                  <th colSpan={1} className="p-0 border-b border-gray-600">
                    <div className="py-3 px-4 text-center">
                      <span className="text-sm sm:text-base" style={{ color: 'rgb(255, 127, 127)', fontWeight: 800 }}>基本費</span>
                    </div>
                  </th>
                  <th colSpan={1} className="p-0 border-b border-gray-600">
                    <div className="py-3 px-4 text-center">
                      <span className="text-sm sm:text-base" style={{ color: 'rgb(255, 127, 127)', fontWeight: 800 }}>每張</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <colgroup>
                <col className="w-[40%]" />
                <col className="w-[30%]" />
                <col className="w-[30%]" />
              </colgroup>
              <tbody>
                {PROCESSING_GROUP_2.map((row, idx) => (
                  <tr key={idx} className={`border-b border-gray-600 ${idx === 0 ? 'border-t border-gray-600' : ''}`}>
                    <td className="py-4 px-3 sm:py-5 sm:px-4 align-top border-r border-gray-600">
                      <div className="space-y-1">
                        <div className="text-black text-lg sm:text-xl font-bold break-words">
                          {row.material}
                        </div>
                        {row.description.length > 0 && row.description.map((desc: string, i: number) => (
                          <div key={i} className="text-gray-600 text-xs sm:text-sm">
                            {desc}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600">
                      ${row.baseFee}
                    </td>
                    <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600">
                      ${row.perSheet}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 第三區塊：軋型費 */}
          <div className="bg-gray-200 rounded-lg p-4 sm:p-6">
            <table className="w-full border-collapse border border-gray-600 text-xs sm:text-sm">
              <thead>
                <tr>
                  <th colSpan={1} className="p-0 border-b border-gray-600">
                    <div className="py-3 px-4 text-left">
                      <h3 className="text-2xl font-bold text-black">
                        其他加工項目
                      </h3>
                    </div>
                  </th>
                  <th colSpan={1} className="p-0 border-b border-gray-600">
                    <div className="py-3 px-4 text-center">
                      <span className="text-sm sm:text-base" style={{ color: 'rgb(255, 127, 127)', fontWeight: 800 }}>1000張內</span>
                    </div>
                  </th>
                  <th colSpan={1} className="p-0 border-b border-gray-600">
                    <div className="py-3 px-4 text-center">
                      <span className="text-sm sm:text-base" style={{ color: 'rgb(255, 127, 127)', fontWeight: 800 }}>2000張內</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <colgroup>
                <col className="w-[40%]" />
                <col className="w-[30%]" />
                <col className="w-[30%]" />
              </colgroup>
              <tbody>
                {PROCESSING_GROUP_3.map((row, idx) => (
                  <tr key={idx} className={`border-b border-gray-600 ${idx === 0 ? 'border-t border-gray-600' : ''}`}>
                    <td className="py-4 px-3 sm:py-5 sm:px-4 align-top border-r border-gray-600">
                      <div className="space-y-1">
                        <div className="text-black text-lg sm:text-xl font-bold break-words">
                          {row.material}
                        </div>
                        {row.description.length > 0 && row.description.map((desc: string, i: number) => (
                          <div key={i} className="text-gray-600 text-xs sm:text-sm">
                            {desc}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600">
                      ${row.within1000.toLocaleString()}
                    </td>
                    <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600">
                      ${row.within2000.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 第四區塊：燙金 */}
          <div className="bg-gray-200 rounded-lg p-4 sm:p-6">
            <table className="w-full border-collapse border border-gray-600 text-xs sm:text-sm">
              <thead>
                <tr>
                  <th colSpan={1} className="p-0 border-b border-gray-600">
                    <div className="py-3 px-4 text-left">
                      <h3 className="text-2xl font-bold text-black">
                        燙金
                      </h3>
                    </div>
                  </th>
                  <th colSpan={1} className="p-0 border-b border-gray-600">
                    <div className="py-3 px-4 text-center">
                      <span className="text-sm sm:text-base" style={{ color: 'rgb(255, 127, 127)', fontWeight: 800 }}>製版費</span>
                    </div>
                  </th>
                  <th colSpan={1} className="p-0 border-b border-gray-600">
                    <div className="py-3 px-4 text-center">
                      <span className="text-sm sm:text-base" style={{ color: 'rgb(255, 127, 127)', fontWeight: 800 }}>加工基本費</span>
                    </div>
                  </th>
                  <th colSpan={1} className="p-0 border-b border-gray-600">
                    <div className="py-3 px-4 text-center">
                      <span className="text-sm sm:text-base" style={{ color: 'rgb(255, 127, 127)', fontWeight: 800 }}>每張</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <colgroup>
                <col className="w-[25%]" />
                <col className="w-[25%]" />
                <col className="w-[25%]" />
                <col className="w-[25%]" />
              </colgroup>
              <tbody>
                {PROCESSING_GROUP_4.map((row, idx) => (
                  <tr key={idx} className={`border-b border-gray-600 ${idx === 0 ? 'border-t border-gray-600' : ''}`}>
                    <td className="py-4 px-3 sm:py-5 sm:px-4 text-black text-lg sm:text-xl font-bold border-r border-gray-600">
                      {row.size}
                    </td>
                    <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600">
                      ${row.plateFee}
                    </td>
                    <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600">
                      ${row.baseFee}
                    </td>
                    <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600">
                      ${row.perSheet}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-center text-sm text-black/70 mt-4">
              滿版燙金請聯繫專人報價
            </p>
          </div>

          {/* 第五區塊：打凸 */}
          <div className="bg-gray-200 rounded-lg p-4 sm:p-6">
            <table className="w-full border-collapse border border-gray-600 text-xs sm:text-sm">
              <thead>
                <tr>
                  <th colSpan={1} className="p-0 border-b border-gray-600">
                    <div className="py-3 px-4 text-left">
                      <h3 className="text-2xl font-bold text-black">
                        打凸
                      </h3>
                    </div>
                  </th>
                  <th colSpan={1} className="p-0 border-b border-gray-600">
                    <div className="py-3 px-4 text-center">
                      <span className="text-sm sm:text-base" style={{ color: 'rgb(255, 127, 127)', fontWeight: 800 }}>製版費</span>
                    </div>
                  </th>
                  <th colSpan={1} className="p-0 border-b border-gray-600">
                    <div className="py-3 px-4 text-center">
                      <span className="text-sm sm:text-base" style={{ color: 'rgb(255, 127, 127)', fontWeight: 800 }}>加工基本費</span>
                    </div>
                  </th>
                  <th colSpan={1} className="p-0 border-b border-gray-600">
                    <div className="py-3 px-4 text-center">
                      <span className="text-sm sm:text-base" style={{ color: 'rgb(255, 127, 127)', fontWeight: 800 }}>每張</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <colgroup>
                <col className="w-[25%]" />
                <col className="w-[25%]" />
                <col className="w-[25%]" />
                <col className="w-[25%]" />
              </colgroup>
              <tbody>
                {PROCESSING_GROUP_5.map((row, idx) => (
                  <tr key={idx} className={`border-b border-gray-600 ${idx === 0 ? 'border-t border-gray-600' : ''}`}>
                    <td className="py-4 px-3 sm:py-5 sm:px-4 text-black text-lg sm:text-xl font-bold border-r border-gray-600">
                      {row.size}
                    </td>
                    <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600">
                      ${row.plateFee}
                    </td>
                    <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600">
                      ${row.baseFee}
                    </td>
                    <td className="py-4 px-3 sm:py-5 sm:px-4 text-center text-black font-medium border-r border-gray-600">
                      ${row.perSheet}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-center text-sm text-black/70 mt-4">
              滿版打凸請聯繫專人報價
            </p>
          </div>

          {/* 其他項目 */}
          {OTHER_PROCESSING_DATA.length > 0 && (
            <div className="bg-gray-200 rounded-lg p-4 sm:p-6">
              <table className="w-full border-collapse border border-gray-600 text-xs sm:text-sm">
                <thead>
                  <tr>
                    <th colSpan={2} className="p-0 border-b border-gray-600">
                      <div className="py-3 px-4 text-left">
                        <h3 className="text-2xl font-bold text-black">
                          其他加工項目
                        </h3>
                      </div>
                    </th>
                  </tr>
                </thead>
                <colgroup>
                  <col className="w-[40%]" />
                  <col className="w-[60%]" />
                </colgroup>
                <tbody>
                  {OTHER_PROCESSING_DATA.map((row, idx) => {
                    const subItemsCount = row.subItems ? row.subItems.length : 0;
                    const totalRowSpan = 1 + (subItemsCount > 0 ? subItemsCount + 1 : 0);
                    
                    return (
                      <React.Fragment key={idx}>
                        <tr className={`border-b border-gray-600 ${idx === 0 ? 'border-t border-gray-600' : ''}`}>
                          <td
                            rowSpan={totalRowSpan}
                            className="py-4 px-3 sm:py-5 sm:px-4 align-top border-r border-gray-600"
                          >
                            <div className="space-y-1">
                              <div className="text-black text-lg sm:text-xl font-bold break-words">
                                {row.material}
                              </div>
                              {row.description.length > 0 && row.description.map((desc: string, i: number) => (
                                <div key={i} className="text-gray-600 text-xs sm:text-sm">
                                  {desc}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-3 sm:py-5 sm:px-4 text-black font-medium border-r border-gray-600">
                            {row.price}
                          </td>
                        </tr>
                        {row.subItems && (
                          <>
                            <tr className="border-b border-gray-600">
                              <td className="py-4 px-3 sm:py-5 sm:px-4 text-black font-medium border-r border-gray-600">
                                <div className="text-black text-base sm:text-lg font-semibold">
                                  {row.subItems[0].material}
                                </div>
                                {row.subItems[0].price && (
                                  <div className="text-black text-sm mt-1">
                                    {row.subItems[0].price}
                                  </div>
                                )}
                              </td>
                            </tr>
                            {row.subItems.slice(1).map((subItem: any, subIdx: number) => (
                              <tr key={`sub-${subIdx}`} className="border-b border-gray-600">
                                <td className="py-4 px-3 sm:py-5 sm:px-4 text-black font-medium border-r border-gray-600">
                                  <div className="text-black text-base sm:text-lg font-semibold">
                                    {subItem.material}
                                  </div>
                                  {subItem.price && (
                                    <div className="text-black text-sm mt-1">
                                      {subItem.price}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {/* 燙金名片提醒卡片 */}
      <div className="flex-[1] w-full md:w-auto space-y-6">
        <div className="bg-white border border-black/10 rounded-lg p-4 sm:p-6 shadow-sm">
          <h4 className="text-lg font-light tracking-wide mb-4 text-black/90">
            注意事項
          </h4>
          <div className="space-y-4 text-sm text-black/70 leading-relaxed">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                本價格為現金價，為不含 5%
                營業稅及運費，若需開立發票或收據請先告知。
              </li>
              <li>
                請自備完整美工繪圖電子檔（以上報價均不含設計及檔案製作）。
              </li>
              <li>
                名片 - 校稿無誤後，
                <strong className="text-black/90">3~7 個工作天</strong>
                交貨，因屬純手工製作需視加工情況而定（印刷時間為星期一~星期五）。
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-lg p-6 shadow-sm">
          <h4 className="text-lg font-light tracking-wide mb-4 text-black/90">
            代客製作檔案費用
          </h4>
          <div className="space-y-6 text-sm text-black/70 leading-relaxed">
            <div>
              <p className="mb-2">
                <strong className="text-black/90">
                  1. 厚卡純文字排版（不含圖像處理）：
                </strong>
              </p>
              <ul className="ml-6 space-y-1 list-disc">
                <li>
                  單面：
                  <span className="text-red-600 font-medium">1,200</span>
                </li>
                <li>
                  雙面：
                  <span className="text-red-600 font-medium">1,600</span>
                </li>
                <li>
                  以上報價含
                  <strong className="text-black/90">二次校稿</strong>
                  ，超過每次加收{" "}
                  <span className="text-red-600 font-medium">100</span>。
                </li>
              </ul>
            </div>

            <div>
              <p className="mb-2">
                <strong className="text-black/90">
                  2. 以上設計費為搭配本公司印刷之優惠價，恕不提供印刷檔案。
                </strong>
              </p>
            </div>

            <div>
              <p className="mb-2">
                <strong className="text-black/90">
                  3. 若不搭配本公司印刷優惠價，設計排版費用則為單面{" "}
                  <span className="text-red-600 font-medium">1,800</span>
                  、雙面{" "}
                  <span className="text-red-600 font-medium">2,400</span>。
                </strong>
              </p>
            </div>

            <div>
              <p>
                <strong className="text-black/90">
                  4. 設計費只收第一次製版費用
                </strong>
                ，更改姓名以及內容資料文字不另加收費用。
              </p>
            </div>

            <div>
              <p>
                <strong className="text-black/90">
                  5. 稿件確認無誤後，需先支付印製費用方可進行印刷
                </strong>
                （貨到付款方式除外）。
              </p>
            </div>

            <div>
              <p>
                <strong className="text-black/90">
                  6.
                  本公司網頁之名片及海報公版版權皆屬於本公司所擁有，拷貝翻印必究。
                </strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// DM海報區塊
function DMPosterSection() {
  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <div className="flex-[2] w-full md:w-auto">
        <h3 className="text-2xl font-light tracking-wide mb-8 text-black/90">
          彩色 A4 DM
        </h3>
        <div className="space-y-12">
          {/* 100P 雙銅紙 */}
          <div>
            <h4 className="text-lg font-medium mb-4 text-black/80">
              紙材：{DM_DATA_100P_DOUBLE_COATED.material}
            </h4>
            <div>
              <table className="w-full border-collapse text-xs sm:text-sm table-fixed">
                <colgroup>
                  <col className="w-[20%]" />
                  <col className="w-[40%]" />
                  <col className="w-[40%]" />
                </colgroup>
                <thead>
                  <tr className="border-b-2 border-black/30">
                    <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5">
                      數量（張）
                    </th>
                    <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5 lg:whitespace-nowrap">
                      單面印刷
                    </th>
                    <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-gray-300 lg:whitespace-nowrap">
                      雙面印刷
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DM_DATA_100P_DOUBLE_COATED.prices.map((row, idx) => (
                    <tr key={idx} className="border-b border-black/10 hover:bg-black/2">
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 font-medium">
                        {row.qty}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                        {typeof row.single === "number"
                          ? `${row.single}`
                          : row.single}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium bg-gray-300">
                        {typeof row.double === "number"
                          ? `${row.double}`
                          : row.double}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-black/60">A3=A4 價格 x2</p>
          </div>

          {/* 150P 雙銅紙 */}
          <div>
            <h4 className="text-lg font-medium mb-4 text-black/80">
              紙材：{DM_DATA_150P_DOUBLE_COATED.material}
            </h4>
            <div>
              <table className="w-full border-collapse text-xs sm:text-sm table-fixed">
                <colgroup>
                  <col className="w-[20%]" />
                  <col className="w-[40%]" />
                  <col className="w-[40%]" />
                </colgroup>
                <thead>
                  <tr className="border-b-2 border-black/30">
                    <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5">
                      數量（張）
                    </th>
                    <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5 lg:whitespace-nowrap">
                      單面印刷
                    </th>
                    <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-gray-300 lg:whitespace-nowrap">
                      雙面印刷
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DM_DATA_150P_DOUBLE_COATED.prices.map((row, idx) => (
                    <tr key={idx} className="border-b border-black/10 hover:bg-black/2">
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 font-medium">
                        {row.qty}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                        {typeof row.single === "number"
                          ? `${row.single}`
                          : row.single}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium bg-gray-300">
                        {typeof row.double === "number"
                          ? `${row.double}`
                          : row.double}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-black/60">A3=A4 價格 x2</p>
          </div>

          {/* 80P 道林紙 / 模造紙 */}
          <div>
            <h4 className="text-lg font-medium mb-4 text-black/80">
              紙材：{DM_DATA_80P_DOWLING.material}
            </h4>
            <div>
              <table className="w-full border-collapse text-xs sm:text-sm table-fixed">
                <colgroup>
                  <col className="w-[20%]" />
                  <col className="w-[40%]" />
                  <col className="w-[40%]" />
                </colgroup>
                <thead>
                  <tr className="border-b-2 border-black/30">
                    <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5">
                      數量（張）
                    </th>
                    <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5 lg:whitespace-nowrap">
                      單面印刷
                    </th>
                    <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-gray-300 lg:whitespace-nowrap">
                      雙面印刷
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DM_DATA_80P_DOWLING.prices.map((row, idx) => (
                    <tr key={idx} className="border-b border-black/10 hover:bg-black/2">
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 font-medium">
                        {row.qty}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                        {typeof row.single === "number"
                          ? `${row.single}`
                          : row.single}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium bg-gray-300">
                        {typeof row.double === "number"
                          ? `${row.double}`
                          : row.double}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-black/60">A3=A4 價格 x2</p>
          </div>

          {/* 100P 道林 / 模造紙 */}
          <div>
            <h4 className="text-lg font-medium mb-4 text-black/80">
              紙材：{DM_DATA_100P_DOWLING.material}
            </h4>
            <div>
              <table className="w-full border-collapse text-xs sm:text-sm table-fixed">
                <colgroup>
                  <col className="w-[20%]" />
                  <col className="w-[40%]" />
                  <col className="w-[40%]" />
                </colgroup>
                <thead>
                  <tr className="border-b-2 border-black/30">
                    <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5">
                      數量（張）
                    </th>
                    <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5 lg:whitespace-nowrap">
                      單面印刷
                    </th>
                    <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-gray-300 lg:whitespace-nowrap">
                      雙面印刷
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DM_DATA_100P_DOWLING.prices.map((row, idx) => (
                    <tr key={idx} className="border-b border-black/10 hover:bg-black/2">
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 font-medium">
                        {row.qty}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                        {typeof row.single === "number"
                          ? `${row.single}`
                          : row.single}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium bg-gray-300">
                        {typeof row.double === "number"
                          ? `${row.double}`
                          : row.double}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-black/60">A3=A4 價格 x2</p>
          </div>
        </div>
      </div>
      {/* DM 與海報提醒卡片 */}
      <div className="flex-[1] w-full md:w-auto space-y-6">
        <div className="bg-white border border-black/10 rounded-lg p-4 sm:p-6 shadow-sm">
          <h3 className="text-xl font-light tracking-wide mb-6 text-black/90">
            注意事項
          </h3>
          <div className="space-y-4 text-sm text-black/70 leading-relaxed">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                本價格為現金價，為不含 5%
                營業稅及運費，若需開立發票或收據請先告知。
              </li>
              <li>請自備完整美工繪圖電子檔（以上報價均不含設計）。</li>
              <li>
                校稿無誤後，
                <strong className="text-black/90">2~3 個工作天</strong>
                交貨（印刷時間為星期一~星期五）。
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-light tracking-wide mb-6 text-black/90">
            代客製作檔案費用
          </h3>
          <div className="space-y-6 text-sm text-black/70 leading-relaxed">
            <div>
              <p className="mb-2">
                <strong className="text-black/90">1. 排版與設計費用：</strong>
              </p>
              <ul className="ml-6 space-y-1 list-disc">
                <li>
                  純文字排版：一面{" "}
                  <span className="text-red-600 font-medium">1,300</span>
                </li>
                <li>
                  設計加排版：單面{" "}
                  <span className="text-red-600 font-medium">3,500</span>
                  、雙面{" "}
                  <span className="text-red-600 font-medium">4,900</span>
                </li>
              </ul>
            </div>

            <div>
              <p className="mb-2">
                <strong className="text-black/90">
                  2. 海報公版使用與圖片更換：
                </strong>
              </p>
              <ul className="ml-6 space-y-1 list-disc">
                <li>
                  套用海報公版版費{" "}
                  <span className="text-red-600 font-medium">800</span>
                </li>
                <li>
                  若需更換自行提供圖片另加收換圖費用{" "}
                  <span className="text-red-600 font-medium">600</span>
                  （不含修圖）
                </li>
              </ul>
            </div>

            <div>
              <p className="mb-2">
                <strong className="text-black/90">3. 海報公版修改：</strong>
              </p>
              <p className="ml-6">
                海報公版如需更換指定顏色或者字體每變更一樣均加收{" "}
                <span className="text-red-600 font-medium">300</span>{" "}
                改稿費。
              </p>
            </div>

            <div>
              <p className="mb-2">
                <strong className="text-black/90">
                  4. 以上為搭配本公司印刷之優惠價。
                </strong>
              </p>
              <p className="ml-6">
                若不搭配本公司印刷優惠價，設計排版費用則為單面{" "}
                <span className="text-red-600 font-medium">4,500</span>
                、雙面{" "}
                <span className="text-red-600 font-medium">5,800</span>。
              </p>
            </div>

            <div>
              <p>
                <strong className="text-black/90">
                  5. 以上報價含二次校稿
                </strong>
                ，超過每次加收{" "}
                <span className="text-red-600 font-medium">100</span>。
              </p>
            </div>

            <div>
              <p>
                <strong className="text-black/90">
                  6. 稿件確認無誤後，需先支付印製費用方可進行印刷
                </strong>
                （貨到付款方式除外）。
              </p>
            </div>

            <div>
              <p>
                <strong className="text-black/90">
                  7.
                  本公司網頁之名片及海報公版版權皆屬於本公司所擁有，拷貝翻印必究。
                </strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

