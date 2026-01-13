"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

const NAV = [
  { id: "about", label: "公司簡介", href: "/#about" },
  { id: "pricing", label: "價格", href: "/pricing" },
  { id: "delivery", label: "取貨方式", href: "/#delivery" },
  { id: "contact", label: "聯絡我們", href: "/#contact" },
] as const;

// 價格表數據
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

const DELUXE_PAPER_DATA_1 = [
  {
    material: "星幻紙 / 立體銀",
    single: { "200": 540, "300": 640, "500": 750, "1000": 1250 },
    double: { "200": 650, "300": 790, "500": 900, "1000": 1490 },
  },
];

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
  {
    material: "雷射雕刻請洽服務人員",
    single: { "3": null, "4": null, "5": null },
    double: { "3": null, "4": null, "5": null },
  },
];

type TabType = "名片" | "加工" | "DM海報";

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<TabType>("名片");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [currentVideoSrc, setCurrentVideoSrc] = useState<string>("/flat.mp4");
  const videoRef = useRef<HTMLVideoElement>(null);

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
    <main className="bg-white text-black min-h-screen">
      {/* Header */}
      <header className="relative z-50 pt-8 sm:pt-12 lg:pt-8 lg:pl-8 xl:pl-12">
        <div className="flex items-center justify-between lg:justify-start px-4 sm:px-6 lg:px-0">
          <div className="flex justify-center lg:justify-start flex-1 lg:flex-none">
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
        {isMenuOpen && (
          <nav className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-[60] mt-2 border-t border-black/10">
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
        )}
      </header>

      {/* 標籤切換 */}
      <section className="py-8 px-6 border-b border-black/10">
        <div className="max-w-7xl mx-auto">
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
      <div>
        <h3 className="text-2xl font-light tracking-wide mb-6 text-black/90">
          常用紙材
        </h3>
        <div>
          <table className="w-full border-collapse text-xs sm:text-sm table-fixed">
            <colgroup>
              <col className="w-[40%]" />
              <col className="w-[12%]" />
              <col className="w-[12%]" />
              <col className="w-[12%]" />
              <col className="w-[12%]" />
              <col className="w-[12%]" />
            </colgroup>
            <thead>
              <tr className="border-b-2 border-black/30">
                <th className="text-left py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5">
                  紙材
                </th>
                <th className="text-left py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5">
                  印刷
                </th>
                <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5">
                  2盒
                  <br />
                  200張
                </th>
                <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5">
                  3盒
                  <br />
                  300張
                </th>
                <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5">
                  5盒
                  <br />
                  500張
                </th>
                <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5">
                  10盒
                  <br />
                  1000張
                </th>
              </tr>
            </thead>
            <tbody>
              {COMMON_PAPER_DATA.map((row, idx) => (
                <React.Fragment key={idx}>
                  <tr className="border-b border-black/10 hover:bg-black/2">
                    <td
                      rowSpan={2}
                      className="py-4 px-2 sm:py-5 sm:px-4 align-middle font-medium text-black/90 bg-black/3 border-r border-black/10"
                    >
                      <div className="font-semibold whitespace-nowrap">
                        {row.material === "平面卡（一級卡）" ? (
                          <span
                            className="cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log("Click detected on 平面卡（一級卡）");
                              if (onOpenVideoModal) {
                                onOpenVideoModal("/flat.mp4");
                              }
                            }}
                            role="button"
                            tabIndex={0}
                          >
                            {row.material}
                          </span>
                        ) : row.material === "萊妮紙 / 合成紙 / 象牙紙 / 安格紙" ? (
                          <>
                            <span
                              className="cursor-pointer hover:text-blue-600 transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log("Click detected on 萊妮紙");
                                if (onOpenVideoModal) {
                                  onOpenVideoModal("/leni.mp4");
                                }
                              }}
                              role="button"
                              tabIndex={0}
                            >
                              萊妮紙
                            </span>
                            <span> / </span>
                            <span
                              className="cursor-pointer hover:text-blue-600 transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log("Click detected on 合成紙");
                                if (onOpenVideoModal) {
                                  onOpenVideoModal("/synthetic.mp4");
                                }
                              }}
                              role="button"
                              tabIndex={0}
                            >
                              合成紙
                            </span>
                            <span> / </span>
                            <span
                              className="cursor-pointer hover:text-blue-600 transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log("Click detected on 象牙紙");
                                if (onOpenVideoModal) {
                                  onOpenVideoModal("/Ivory.mp4");
                                }
                              }}
                              role="button"
                              tabIndex={0}
                            >
                              象牙紙
                            </span>
                            <span> / </span>
                            <span
                              className="cursor-pointer hover:text-blue-600 transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log("Click detected on 安格紙");
                                if (onOpenVideoModal) {
                                  onOpenVideoModal("/ange.mp4");
                                }
                              }}
                              role="button"
                              tabIndex={0}
                            >
                              安格紙
                            </span>
                          </>
                        ) : row.material === "雙上霧P / 雙上亮P" ? (
                          <>
                            <span
                              className="cursor-pointer hover:text-blue-600 transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log("Click detected on 雙上霧P");
                                if (onOpenVideoModal) {
                                  onOpenVideoModal("/matt.mp4");
                                }
                              }}
                              role="button"
                              tabIndex={0}
                            >
                              雙上霧P
                            </span>
                            <span> / </span>
                            <span
                              className="cursor-pointer hover:text-blue-600 transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log("Click detected on 雙上亮P");
                                if (onOpenVideoModal) {
                                  onOpenVideoModal("/clear.mp4");
                                }
                              }}
                              role="button"
                              tabIndex={0}
                            >
                              雙上亮P
                            </span>
                          </>
                        ) : row.material === "局部上光（單面局部光）" ? (
                          <span
                            className="cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log("Click detected on 局部上光（單面局部光）");
                              if (onOpenVideoModal) {
                                onOpenVideoModal("/spot_uv.mp4");
                              }
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
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-black/80 font-medium lg:whitespace-nowrap">
                      單面印刷
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                      {row.single["200"] ? `${row.single["200"]}` : "-"}
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                      {row.single["300"] ? `${row.single["300"]}` : "-"}
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                      {row.single["500"] ? `${row.single["500"]}` : "-"}
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                      {row.single["1000"] ? `${row.single["1000"]}` : "-"}
                    </td>
                  </tr>
                  <tr className="border-b border-black/10 hover:bg-black/2">
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-black/80 font-medium lg:whitespace-nowrap">
                      雙面印刷
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                      {row.double["200"] ? `${row.double["200"]}` : "-"}
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                      {row.double["300"] ? `${row.double["300"]}` : "-"}
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                      {row.double["500"] ? `${row.double["500"]}` : "-"}
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                      {row.double["1000"] ? `${row.double["1000"]}` : "-"}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 精緻紙材 */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-[2] w-full md:w-auto">
          <h3 className="text-2xl font-light tracking-wide mb-6 text-black/90">
            精緻紙材
          </h3>

          {/* 第一組：星幻紙 / 立體銀 */}
          <div className="mb-12">
            <table className="w-full border-collapse text-xs sm:text-sm table-fixed">
              <colgroup>
                <col className="w-[50%]" />
                <col className="w-[10%]" />
                <col className="w-[10%]" />
                <col className="w-[10%]" />
                <col className="w-[10%]" />
                <col className="w-[10%]" />
              </colgroup>
              <thead>
                <tr className="border-b-2 border-black/30">
                  <th className="text-left py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5">
                    紙材
                  </th>
                  <th className="text-left py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5">
                    印刷
                  </th>
                  <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5">
                    2盒
                    <br />
                    200張
                  </th>
                  <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5">
                    3盒
                    <br />
                    300張
                  </th>
                  <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5">
                    5盒
                    <br />
                    500張
                  </th>
                  <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5">
                    10盒
                    <br />
                    1000張
                  </th>
                </tr>
              </thead>
              <tbody>
                {DELUXE_PAPER_DATA_1.map((row, idx) => (
                  <React.Fragment key={idx}>
                    <tr className="border-b border-black/10 hover:bg-black/2">
                      <td
                        rowSpan={2}
                        className="py-4 px-2 sm:py-5 sm:px-4 align-middle font-medium text-black/90 bg-black/3 border-r border-black/10"
                      >
                        <div className="font-semibold break-words">
                          {row.material === "星幻紙 / 立體銀" ? (
                            <>
                              <span
                                className="cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  console.log("Click detected on 星幻紙");
                                  if (onOpenVideoModal) {
                                    onOpenVideoModal("/Pearlescent.mp4");
                                  }
                                }}
                                role="button"
                                tabIndex={0}
                              >
                                星幻紙
                              </span>
                              <span> / 立體銀</span>
                            </>
                          ) : (
                            <span>{row.material}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-black/80 font-medium lg:whitespace-nowrap">
                        單面印刷
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                        {row.single["200"] ? `${row.single["200"]}` : "-"}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                        {row.single["300"] ? `${row.single["300"]}` : "-"}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                        {row.single["500"] ? `${row.single["500"]}` : "-"}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                        {row.single["1000"] ? `${row.single["1000"]}` : "-"}
                      </td>
                    </tr>
                    <tr className="border-b border-black/10 hover:bg-black/2">
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-black/80 font-medium lg:whitespace-nowrap">
                        雙面印刷
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                        {row.double["200"] ? `${row.double["200"]}` : "-"}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                        {row.double["300"] ? `${row.double["300"]}` : "-"}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                        {row.double["500"] ? `${row.double["500"]}` : "-"}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                        {row.double["1000"] ? `${row.double["1000"]}` : "-"}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* 第二組：其他精緻紙材 */}
          <div>
            <table className="w-full border-collapse text-xs sm:text-sm table-fixed">
              <colgroup>
                <col className="w-[50%]" />
                <col className="w-[10%]" />
                <col className="w-[13.33%]" />
                <col className="w-[13.33%]" />
                <col className="w-[13.33%]" />
              </colgroup>
              <thead>
                <tr className="border-b-2 border-black/30">
                  <th className="text-left py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5">
                    紙材
                  </th>
                  <th className="text-left py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5">
                    印刷
                  </th>
                  <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5">
                    2.5盒
                    <br />
                    250張
                  </th>
                  <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5">
                    5盒
                    <br />
                    500張
                  </th>
                  <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5">
                    10盒
                    <br />
                    1000張
                  </th>
                </tr>
              </thead>
              <tbody>
                {DELUXE_PAPER_DATA_2.map((row, idx) => (
                  <React.Fragment key={idx}>
                    <tr className="border-b border-black/10 hover:bg-black/2">
                      <td
                        rowSpan={2}
                        className="py-4 px-2 sm:py-5 sm:px-4 align-middle font-medium text-black/90 bg-black/3 border-r border-black/10"
                      >
                        <div className="font-semibold break-words">
                          {row.material === "頂級卡（平面） / 細紋紙" ? (
                            <>
                              <span>頂級卡（平面） / </span>
                              <span
                                className="cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  console.log("Click detected on 細紋紙");
                                  if (onOpenVideoModal) {
                                    onOpenVideoModal("/Canvas_2.mp4");
                                  }
                                }}
                                role="button"
                                tabIndex={0}
                              >
                                細紋紙
                              </span>
                            </>
                          ) : row.material === "細波紙 / 炫光紙 / 頂級雙面上霧P（均須以雙面計價） / 五色一級卡（銀）" ? (
                            <>
                              <span
                                className="cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  console.log("Click detected on 細波紙");
                                  if (onOpenVideoModal) {
                                    onOpenVideoModal("/Canvas.mp4");
                                  }
                                }}
                                role="button"
                                tabIndex={0}
                              >
                                細波紙
                              </span>
                              <span> / 炫光紙 / 頂級雙面上霧P（均須以雙面計價） / 五色一級卡（銀）</span>
                            </>
                          ) : row.material === "頂級象牙（420g） / 永采紙 / 瑞典一級卡 / 雙面局部上光（均須以雙面計價） / 絲絨卡 / 銀箔卡 / 磨砂卡" ? (
                            <>
                              <span
                                className="cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  console.log("Click detected on 頂級象牙（420g）");
                                  if (onOpenVideoModal) {
                                    onOpenVideoModal("/Premium_Ivory.mp4");
                                  }
                                }}
                                role="button"
                                tabIndex={0}
                              >
                                頂級象牙（420g）
                              </span>
                              <span> / 永采紙 / 瑞典一級卡 / 雙面局部上光（均須以雙面計價） / </span>
                              <span
                                className="cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  console.log("Click detected on 絲絨卡");
                                  if (onOpenVideoModal) {
                                    onOpenVideoModal("/Velvet.mp4");
                                  }
                                }}
                                role="button"
                                tabIndex={0}
                              >
                                絲絨卡
                              </span>
                              <span> / 銀箔卡 / 磨砂卡</span>
                            </>
                          ) : row.material === "柳葉紙 / 爵士紙 / 絲絨局部上光 / 霧透卡 / 全透卡（最少五盒） / 磨砂冷燙卡（以雙面計價）" ? (
                            <>
                              <span>柳葉紙 / </span>
                              <span
                                className="cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  console.log("Click detected on 爵士紙");
                                  if (onOpenVideoModal) {
                                    onOpenVideoModal("/jazz.mp4");
                                  }
                                }}
                                role="button"
                                tabIndex={0}
                              >
                                爵士紙
                              </span>
                              <span> / 絲絨局部上光 / 霧透卡 / 全透卡（最少五盒） / 磨砂冷燙卡（以雙面計價）</span>
                            </>
                          ) : (
                            <span>{row.material}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-black/80 font-medium lg:whitespace-nowrap">
                        單面印刷
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                        {row.single["250"] ? `${row.single["250"]}` : "-"}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                        {row.single["500"] ? `${row.single["500"]}` : "-"}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                        {row.single["1000"] ? `${row.single["1000"]}` : "-"}
                      </td>
                    </tr>
                    <tr className="border-b border-black/10 hover:bg-black/2">
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-black/80 font-medium lg:whitespace-nowrap">
                        雙面印刷
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                        {row.double["250"] ? `${row.double["250"]}` : "-"}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                        {row.double["500"] ? `${row.double["500"]}` : "-"}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                        {row.double["1000"] ? `${row.double["1000"]}` : "-"}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* 精緻紙材提醒卡片 */}
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

// 加工區塊（厚棉卡）
function ProcessingSection({ onOpenVideoModal }: { onOpenVideoModal: (videoSrc?: string) => void }) {
  const [showProductImages, setShowProductImages] = useState(false);

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <div className="flex-[2] w-full md:w-auto">
        <h3 className="text-2xl font-light tracking-wide mb-6 text-black/90">
          厚棉卡
        </h3>

        {/* 燙金顏色 */}
        <div className="mb-8">
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
            {/* 實際成品按鈕 */}
            <button
              onClick={() => setShowProductImages(true)}
              className="ml-4 px-3 py-1.5 text-sm text-black/80 bg-white border border-black/20 rounded hover:bg-black/5 hover:border-black/30 transition-colors"
            >
              實際成品
            </button>
          </div>
          <p className="text-sm text-black/60 mt-3">
            （若選擇其它燙金色費用另計）
          </p>
        </div>

        {/* 實際成品圖片 Modal */}
        {showProductImages && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
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

        {/* 厚棉卡價格表 */}
        <div>
          <table className="w-full border-collapse text-xs sm:text-sm table-fixed">
            <colgroup>
              <col className="w-[40%]" />
              <col className="w-[12%]" />
              <col className="w-[16%]" />
              <col className="w-[16%]" />
              <col className="w-[16%]" />
            </colgroup>
            <thead>
              <tr className="border-b-2 border-black/30">
                <th className="text-left py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5">
                  紙材
                </th>
                <th className="text-left py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5">
                  印刷
                </th>
                <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5">
                  3盒
                </th>
                <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5">
                  4盒
                </th>
                <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5">
                  5盒
                </th>
              </tr>
            </thead>
            <tbody>
              {THICK_COTTON_CARD_DATA.map((row, idx) => (
                <React.Fragment key={idx}>
                  <tr className="border-b border-black/10 hover:bg-black/2">
                    <td
                      rowSpan={2}
                      className="py-4 px-2 sm:py-5 sm:px-4 align-middle font-medium text-black/90 bg-black/3 border-r border-black/10"
                    >
                      <div className="font-semibold break-words">
                        {row.material === "超質黑卡(56條),進口美術紙(靛藍250P)" ? (
                          <>
                            <span
                              className="cursor-pointer hover:text-blue-600 transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log("Click detected on 超質黑卡(56條)");
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
                        ) : (
                          <span>{row.material}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-black/80 font-medium lg:whitespace-nowrap">單面印刷</td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                      {row.single["3"] ? `${row.single["3"]}` : "-"}
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                      {row.single["4"] ? `${row.single["4"]}` : "-"}
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                      {row.single["5"] ? `${row.single["5"]}` : "-"}
                    </td>
                  </tr>
                  <tr className="border-b border-black/10 hover:bg-black/2">
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-black/80 font-medium lg:whitespace-nowrap">雙面印刷</td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                      {row.double["3"] ? `${row.double["3"]}` : "-"}
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                      {row.double["4"] ? `${row.double["4"]}` : "-"}
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
                      {row.double["5"] ? `${row.double["5"]}` : "-"}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* 厚棉卡提醒卡片 */}
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
                    <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5 lg:whitespace-nowrap">
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
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
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
                    <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5 lg:whitespace-nowrap">
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
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
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
                    <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5 lg:whitespace-nowrap">
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
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
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
                    <th className="text-center py-3 px-2 sm:py-4 sm:px-4 font-semibold text-black/90 bg-black/5 lg:whitespace-nowrap">
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
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-center text-black/80 whitespace-nowrap font-medium">
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

