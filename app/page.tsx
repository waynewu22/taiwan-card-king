"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

const NAV = [
  { id: "about", label: "公司簡介", href: null },
  { id: "pricing", label: "價格", href: "/pricing" },
  { id: "delivery", label: "取貨方式", href: null },
  { id: "contact", label: "聯絡我們", href: null },
] as const;

export default function HomePage() {
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(0); // 桌電版預設第一張卡片放大
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null); // 手機版展開的卡片索引
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640; // sm 斷點是 640px
    }
    return false;
  });
  const [cardMinHeight, setCardMinHeight] = useState<string>('400px'); // 預設平板高度
  const [counters, setCounters] = useState({ stat1: 0, stat2: 0, stat3: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [heroHeight, setHeroHeight] = useState<number>(800);
  const hasAnimatedRef = useRef(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // 檢測是否為手機版和設置卡片高度
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640); // sm 斷點是 640px
      // 設置卡片最小高度：平板 400px，桌電 500px
      setCardMinHeight(width >= 1024 ? '500px' : '400px');
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 設置 hero section 高度
  useEffect(() => {
    const updateHeroHeight = () => {
      requestAnimationFrame(() => {
        if (heroSectionRef.current) {
          setHeroHeight(heroSectionRef.current.offsetHeight);
        } else if (typeof window !== 'undefined') {
          setHeroHeight(window.innerHeight);
        }
      });
    };
    updateHeroHeight();
    window.addEventListener('resize', updateHeroHeight);
    return () => window.removeEventListener('resize', updateHeroHeight);
  }, []);

  // 計數器動畫效果
  useEffect(() => {
    if (hasAnimatedRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            
            // 目標數字
            const targets = { stat1: 20, stat2: 3000, stat3: 100000 };
            const duration = 2000; // 2秒動畫時間
            const startTime = Date.now();

            const animate = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              
              // 使用 easeOutCubic 緩動函數
              const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
              const easedProgress = easeOutCubic(progress);

              setCounters({
                stat1: Math.floor(targets.stat1 * easedProgress),
                stat2: Math.floor(targets.stat2 * easedProgress),
                stat3: Math.floor(targets.stat3 * easedProgress),
              });

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                // 確保最終值正確
                setCounters({
                  stat1: targets.stat1,
                  stat2: targets.stat2,
                  stat3: targets.stat3,
                });
              }
            };

            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.3 } // 當30%的元素可見時觸發
    );

    const currentRef = statsRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // 導航滾動功能
  const handleNavClick = useCallback((id: string, href: string | null) => {
    setIsMenuOpen(false); // 關閉移動端菜單
    if (href) {
      // 如果是外部連結，使用 window.location.assign 導航
      window.location.assign(href);
      return;
    }
    // 否則滾動到對應區塊
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const heroSectionRef = useRef<HTMLElement>(null);
  const currentPosition = useRef({ x: 50, y: 50 });
  const targetPosition = useRef({ x: 50, y: 50 });
  const animationFrameId = useRef<number | null>(null);
  const autoFlowTime = useRef(0);
  const lastMouseTime = useRef(0);
  
  // 初始化 lastMouseTime
  useEffect(() => {
    lastMouseTime.current = Date.now();
  }, []);
  const isMouseActive = useRef(false);
  const isScrolling = useRef(false);


  // 標題進場動畫
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsTitleVisible(true);
    });
  }, []);

  // 監聽滾動事件，實現 SVG 遠離和淡化效果（使用節流優化性能）
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      // 如果正在執行滾動動畫，跳過更新以避免卡頓
      if (isScrolling.current) return;
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 啟動自動流動動畫
  useEffect(() => {
    const animate = () => {
      const current = currentPosition.current;
      const now = Date.now();
      const timeSinceMouse = now - lastMouseTime.current;

      // 如果鼠標超過 2 秒沒有移動，切換到自動流動
      if (timeSinceMouse > 2000) {
        isMouseActive.current = false;
        autoFlowTime.current += 0.008;
        // 創建緩慢的圓形流動效果
        const flowX = 50 + Math.sin(autoFlowTime.current) * 35;
        const flowY = 50 + Math.cos(autoFlowTime.current * 0.7) * 25;
        targetPosition.current = { x: flowX, y: flowY };
      } else {
        // 鼠標移動時，重置自動流動時間
        autoFlowTime.current = 0;
      }

      const target = targetPosition.current;
      const dx = target.x - current.x;
      const dy = target.y - current.y;

      // 持續更新位置，即使距離很小也繼續動畫以保持流動
      const newX = current.x + dx * 0.15;
      const newY = current.y + dy * 0.15;
      currentPosition.current = { x: newX, y: newY };

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);


  return (
    <main className="bg-white text-black overflow-x-hidden w-full">
      {/* HERO / STAGE */}
      <section ref={heroSectionRef} className="relative min-h-screen overflow-hidden bg-white">
        {/* 背景圖 */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: "url(/background.png)",
          }}
        />

        {/* 背景中間卡片 SVG */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{ zIndex: 1 }}>
          {(() => {
            // 計算滾動進度（0 到 1），基於首頁高度
            const scrollProgress = Math.min(scrollY / heroHeight, 1);
            
            // 遠離效果：scale 從 1 到 0.4（變小，看起來更遠）
            const scale = 1 - scrollProgress * 0.6;
            
            // 淡化效果：opacity 從 1 到 0
            const opacity = 1 - scrollProgress;
            
            // 向上移動加強遠離感（增加移動距離）
            const translateY = -scrollProgress * 100;
            
            return (
              <>
                {/* 手機和平板版本：使用 background-card-2.svg */}
                <img
                  src="/background-card-2.svg"
                  alt=""
                  className="lg:hidden w-[200%] sm:w-[180%] h-[200%] sm:h-[180%] object-contain transition-transform duration-75 ease-out"
                  style={{
                    transform: `scale(${scale}) translateY(${translateY}px)`,
                    opacity: opacity,
                  }}
                />
                {/* 桌面版本：使用 background-card.svg */}
                <img
                  src="/background-card.svg"
                  alt=""
                  className="hidden lg:block w-full h-full object-contain transition-transform duration-75 ease-out"
                  style={{
                    transform: `scale(${scale}) translateY(${translateY}px)`,
                    opacity: opacity,
                  }}
                />
              </>
            );
          })()}
        </div>

        {/* 品牌標誌 */}
        <header className="relative z-50 pt-8 sm:pt-12 lg:pt-8 lg:pl-8 xl:pl-12">
          <div className="flex items-center justify-between lg:justify-start px-4 sm:px-6 lg:px-0">
            <div className="flex justify-center lg:justify-start flex-1 lg:flex-none absolute left-1/2 -translate-x-1/2 lg:static lg:left-auto lg:translate-x-0">
              <img
                src="/brand/logo.svg"
                alt="名片王"
                className="h-16 sm:h-24 lg:h-16"
              />
                </div>

            {/* 桌面版導航菜單 */}
            <nav className="hidden lg:flex items-center gap-8 ml-8">
  {NAV.map((item) => (
                item.href ? (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="hover:opacity-70 transition-opacity text-sm tracking-wide cursor-pointer"
                    style={{ color: 'rgb(255, 127, 127)' }}
                  >
        {item.label}
                  </Link>
                ) : (
                  <button
                    key={item.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleNavClick(item.id, item.href);
                    }}
                    className="hover:opacity-70 transition-opacity text-sm tracking-wide cursor-pointer"
                    style={{ color: 'rgb(255, 127, 127)' }}
                  >
                    {item.label}
                  </button>
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
            <nav className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-[60] mt-2">
              <div className="flex flex-col px-4 py-4">
                {NAV.map((item) => (
                  item.href ? (
    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-left py-3 px-4 hover:bg-black/5 transition-colors text-base cursor-pointer"
                      style={{ color: 'rgb(255, 127, 127)' }}
                    >
                      {item.label}
    </Link>
                  ) : (
                    <button
                      key={item.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleNavClick(item.id, item.href);
                      }}
                      className="text-left py-3 px-4 hover:bg-black/5 transition-colors text-base cursor-pointer"
                      style={{ color: 'rgb(255, 127, 127)' }}
                    >
                      {item.label}
                    </button>
                  )
                ))}
  </div>
</nav>
          )}
        </header>

        {/* 主要內容區域 */}
        <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-8 sm:px-12 lg:px-16" style={{ marginTop: '-10vh' }}>
          {(() => {
            // 計算滾動進度（0 到 1），基於首頁高度
            const scrollProgress = Math.min(scrollY / heroHeight, 1);
            
            // 標題縮小效果：scale 從 1 到 0.7（減少變化幅度）
            const titleScale = 1 - scrollProgress * 0.3;
            
            return (
              <div 
                className="max-w-4xl text-center"
                style={{
                  transform: `scale(${titleScale})`,
                }}
              >
                {/* 中央標題 */}
                <h1 
                  className={`text-4xl sm:text-6xl lg:text-7xl font-bold text-black mb-6 leading-tight whitespace-nowrap ${
                    isTitleVisible ? 'animate-fade-in-up' : 'opacity-0'
                  }`}
                >
                  20周年服務不間斷
                </h1>

                {/* 說明文字 */}
                <div 
                  className={`text-xl sm:text-2xl text-black mb-8 space-y-2 ${
                    isTitleVisible ? 'animate-fade-in-up-delay-1' : 'opacity-0'
                  }`}
                >
                  <p>我們協助你從看得到(想得到?)</p>
                  <p>變成摸得到</p>
            </div>

                {/* 向下滾動提示箭頭 */}
                <div 
                  className={`flex flex-col items-center mt-8 ${
                    isTitleVisible ? 'animate-fade-in-up-delay-2' : 'opacity-0'
                  }`}
                >
                  <div className="animate-bounce-down">
                    <svg
                      xmlns="https://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-8 h-8 text-black/60"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
                      />
                    </svg>
        </div>
            </div>
          </div>
            );
          })()}
        </div>

      </section>

      {/* SECTIONS - 公司介紹 */}
      <section
        id="about"
        className="scroll-mt-24 overflow-x-hidden"
        style={{ backgroundColor: "rgb(128, 128, 128)" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* 服務流程 */}
          <div className="mb-20">
            <div 
              className="grid grid-cols-2 sm:flex sm:flex-row sm:items-stretch gap-3 lg:gap-4 max-w-7xl mx-auto w-full"
              onMouseLeave={() => !isMobile && setHoveredCardIndex(0)}
            >
              {/* 卡片 1 - 深灰色背景 */}
              <div 
                className="relative bg-gray-900 rounded-lg overflow-hidden flex flex-col w-full sm:w-auto service-card-mobile cursor-pointer"
                style={{
                  flex: !isMobile ? (hoveredCardIndex === 0 ? '2 1 0%' : hoveredCardIndex === null ? '2 1 0%' : '1 1 0%') : undefined,
                  height: !isMobile ? cardMinHeight : (expandedCardIndex === 0 ? 'auto' : cardMinHeight),
                  maxHeight: !isMobile ? cardMinHeight : undefined,
                  minHeight: !isMobile ? cardMinHeight : cardMinHeight,
                  alignSelf: !isMobile ? 'stretch' : undefined,
                  overflow: !isMobile ? 'hidden' : undefined,
                  zIndex: !isMobile ? (hoveredCardIndex === 0 ? 20 : 10) : (expandedCardIndex === 0 ? 20 : 10),
                  transition: !isMobile ? 'flex 600ms cubic-bezier(0.4, 0, 0.2, 1), z-index 300ms ease-out' : 'height 300ms ease-out, z-index 300ms ease-out',
                  willChange: !isMobile ? 'flex' : undefined,
                } as React.CSSProperties}
                onMouseEnter={() => !isMobile && setHoveredCardIndex(0)}
                onMouseLeave={() => !isMobile && setHoveredCardIndex(0)}
                onClick={() => isMobile && setExpandedCardIndex(expandedCardIndex === 0 ? null : 0)}
              >
                {/* 背景圖片 */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: 'url(/g1_street.png)',
                  }}
                />
                
                {/* 手機版內容 */}
                <div className="sm:hidden relative z-10 flex flex-col items-center justify-center h-full px-4 py-6">
                  {expandedCardIndex === 0 ? (
                    <div 
                      className="space-y-3 text-center"
                      style={{
                        animation: 'fadeInUp 0.5s ease-out forwards',
                        opacity: 0
                      }}
                      onAnimationEnd={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                    >
                      <h4 className="text-xs font-bold text-white uppercase whitespace-nowrap">北屯巷弄內</h4>
                      <p className="text-xs text-white/70">老舊公寓裡的一人工作室</p>
                      <p className="text-xs text-white/80 leading-relaxed">
                        創辦人於2000年初，於台中遼陽四街成立名片王的母公司，「宇森廣告」開始長達20年的設計業務。
                      </p>
                    </div>
                  ) : (
                    <h4 
                      className="text-xs font-bold text-white uppercase whitespace-nowrap transition-all duration-300"
                      style={{
                        opacity: expandedCardIndex === null ? 1 : 0,
                        transform: expandedCardIndex === null ? 'translateY(0)' : 'translateY(-10px)'
                      }}
                    >
                      北屯巷弄內
                    </h4>
                  )}
                </div>

                {/* 桌電版內容 */}
                <div className="hidden sm:flex sm:flex-col p-6 flex-grow">

                  {/* 主標題 */}
                  <h4 className="relative z-10 text-xl sm:text-2xl font-bold text-white uppercase mb-1 mt-8 whitespace-nowrap">
                    北屯巷弄內
                  </h4>
                  <p className="relative z-10 text-white/70 text-xs sm:text-sm mb-4 whitespace-nowrap">
                    老舊公寓裡的一人工作室
                  </p>

                  {/* 描述文字 */}
                  <p className="relative z-10 text-white/80 text-xs sm:text-sm mb-6 flex-grow">
                    創辦人於2000年初，於台中遼陽四街成立名片王的母公司，「宇森廣告」開始長達20年的設計業務。
                  </p>

        </div>
              </div>

              {/* 卡片 2 - 中灰色背景 */}
              <div 
                className="relative bg-gray-600 rounded-lg overflow-hidden flex flex-col w-full sm:w-auto service-card-mobile cursor-pointer"
                style={{
                  flex: !isMobile ? (hoveredCardIndex === 1 ? '2 1 0%' : '1 1 0%') : undefined,
                  height: !isMobile ? cardMinHeight : (expandedCardIndex === 1 ? 'auto' : cardMinHeight),
                  maxHeight: !isMobile ? cardMinHeight : undefined,
                  minHeight: !isMobile ? cardMinHeight : cardMinHeight,
                  alignSelf: !isMobile ? 'stretch' : undefined,
                  overflow: !isMobile ? 'hidden' : undefined,
                  zIndex: !isMobile ? (hoveredCardIndex === 1 ? 20 : 10) : (expandedCardIndex === 1 ? 20 : 10),
                  transition: !isMobile ? 'flex 600ms cubic-bezier(0.4, 0, 0.2, 1), z-index 300ms ease-out' : 'height 300ms ease-out, z-index 300ms ease-out',
                  willChange: !isMobile ? 'flex' : undefined,
                } as React.CSSProperties}
                onMouseEnter={() => !isMobile && setHoveredCardIndex(1)}
                onMouseLeave={() => !isMobile && setHoveredCardIndex(0)}
                onClick={() => isMobile && setExpandedCardIndex(expandedCardIndex === 1 ? null : 1)}
              >
                {/* 背景圖片 */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: 'url(/g2_street.png)',
                  }}
                />
                
                {/* 手機版內容 */}
                <div className="sm:hidden relative z-10 flex flex-col items-center justify-center h-full px-4 py-6">
                  {expandedCardIndex === 1 ? (
                    <div 
                      className="space-y-3 text-center"
                      style={{
                        animation: 'fadeInUp 0.5s ease-out forwards',
                        opacity: 0
                      }}
                      onAnimationEnd={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                    >
                      <h4 className="text-xs font-bold text-white uppercase whitespace-nowrap">實體門市</h4>
                      <p className="text-xs text-white/70">河南路上的服務據點</p>
                      <p className="text-xs text-white/80 leading-relaxed">
                        2005年3月，我們成立了實體門市，開始提供一般平價設計與印刷項目，服務全台地區超過3,000位以上的客戶。
                      </p>
                    </div>
                  ) : (
                    <h4 
                      className="text-xs font-bold text-white uppercase whitespace-nowrap transition-all duration-300"
                      style={{
                        opacity: expandedCardIndex === null ? 1 : 0,
                        transform: expandedCardIndex === null ? 'translateY(0)' : 'translateY(-10px)'
                      }}
                    >
                      實體門市
                    </h4>
                  )}
                </div>

                {/* 桌電版內容 */}
                <div className="hidden sm:flex sm:flex-col p-6 flex-grow">

                  {/* 主標題 */}
                  <h4 className="relative z-10 text-xl sm:text-2xl font-bold text-white uppercase mb-1 mt-8 whitespace-nowrap">
                    實體門市
                  </h4>
                  <p className="relative z-10 text-white/70 text-xs sm:text-sm mb-4 whitespace-nowrap">
                    河南路上的服務據點
                  </p>

                  {/* 描述文字 */}
                  <p className="relative z-10 text-white/80 text-xs sm:text-sm mb-6 flex-grow">
                    2005年3月，我們成立了實體門市，開始提供一般平價設計與印刷項目，服務全台地區超過3,000位以上的客戶。
                  </p>

                </div>
              </div>

              {/* 卡片 3 - 淺灰色背景 */}
              <div 
                className="relative bg-gray-300 rounded-lg overflow-hidden flex flex-col w-full sm:w-auto service-card-mobile cursor-pointer"
                style={{
                  flex: !isMobile ? (hoveredCardIndex === 2 ? '2 1 0%' : '1 1 0%') : undefined,
                  height: !isMobile ? cardMinHeight : (expandedCardIndex === 2 ? 'auto' : cardMinHeight),
                  maxHeight: !isMobile ? cardMinHeight : undefined,
                  minHeight: !isMobile ? cardMinHeight : cardMinHeight,
                  alignSelf: !isMobile ? 'stretch' : undefined,
                  overflow: !isMobile ? 'hidden' : undefined,
                  zIndex: !isMobile ? (hoveredCardIndex === 2 ? 20 : 10) : (expandedCardIndex === 2 ? 20 : 10),
                  transition: !isMobile ? 'flex 600ms cubic-bezier(0.4, 0, 0.2, 1), z-index 300ms ease-out' : 'height 300ms ease-out, z-index 300ms ease-out',
                  willChange: !isMobile ? 'flex' : undefined,
                } as React.CSSProperties}
                onMouseEnter={() => !isMobile && setHoveredCardIndex(2)}
                onMouseLeave={() => !isMobile && setHoveredCardIndex(0)}
                onClick={() => isMobile && setExpandedCardIndex(expandedCardIndex === 2 ? null : 2)}
              >
                {/* 背景圖片 */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: 'url(/g3_website.png)',
                  }}
                />
                
                {/* 手機版內容 */}
                <div className="sm:hidden relative z-10 flex flex-col items-center justify-center h-full px-4 py-6">
                  {expandedCardIndex === 2 ? (
                    <div 
                      className="space-y-3 text-center"
                      style={{
                        animation: 'fadeInUp 0.5s ease-out forwards',
                        opacity: 0
                      }}
                      onAnimationEnd={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                    >
                      <h4 className="text-xs font-bold text-white uppercase whitespace-nowrap">建立網站及公版</h4>
                      <p className="text-xs text-white/70">提供超過200種以上不同名片公版</p>
                      <p className="text-xs text-white/80 leading-relaxed">
                        2007年，名片王第一代網站正式上線，為全台第一家提供線上公版服務的平面設計公司，讓顧客可以快速選擇想要的版型並專人服務套版，且免收設計費，落實平價與快速的企業理念。
                      </p>
                    </div>
                  ) : (
                    <h4 
                      className="text-xs font-bold text-white uppercase whitespace-nowrap transition-all duration-300"
                      style={{
                        opacity: expandedCardIndex === null ? 1 : 0,
                        transform: expandedCardIndex === null ? 'translateY(0)' : 'translateY(-10px)'
                      }}
                    >
                      建立網站及公版
                    </h4>
                  )}
                </div>

                {/* 桌電版內容 */}
                <div className="hidden sm:flex sm:flex-col p-6 flex-grow">

                  {/* 主標題 */}
                  <h4 className="relative z-10 text-xl sm:text-2xl font-bold text-white uppercase mb-1 mt-8 whitespace-nowrap">
                    建立網站及公版
                  </h4>
                  <p className="relative z-10 text-white/70 text-xs sm:text-sm mb-4 whitespace-nowrap">
                    提供超過200種以上不同名片公版
                  </p>

                  {/* 描述文字 */}
                  <p className="relative z-10 text-white/80 text-xs sm:text-sm mb-6 flex-grow">
                    2007年，名片王第一代網站正式上線，為全台第一家提供線上公版服務的平面設計公司，讓顧客可以快速選擇想要的版型並專人服務套版，且免收設計費，落實平價與快速的企業理念。
                  </p>

                </div>
              </div>

              {/* 卡片 4 - 中深灰色背景 */}
              <div 
                className="relative bg-gray-700 rounded-lg overflow-hidden flex flex-col w-full sm:w-auto service-card-mobile cursor-pointer"
                style={{
                  flex: !isMobile ? (hoveredCardIndex === 3 ? '2 1 0%' : '1 1 0%') : undefined,
                  height: !isMobile ? cardMinHeight : (expandedCardIndex === 3 ? 'auto' : cardMinHeight),
                  maxHeight: !isMobile ? cardMinHeight : undefined,
                  minHeight: !isMobile ? cardMinHeight : cardMinHeight,
                  alignSelf: !isMobile ? 'stretch' : undefined,
                  overflow: !isMobile ? 'hidden' : undefined,
                  zIndex: !isMobile ? (hoveredCardIndex === 3 ? 20 : 10) : (expandedCardIndex === 3 ? 20 : 10),
                  transition: !isMobile ? 'flex 600ms cubic-bezier(0.4, 0, 0.2, 1), z-index 300ms ease-out' : 'height 300ms ease-out, z-index 300ms ease-out',
                  willChange: !isMobile ? 'flex' : undefined,
                } as React.CSSProperties}
                onMouseEnter={() => !isMobile && setHoveredCardIndex(3)}
                onMouseLeave={() => !isMobile && setHoveredCardIndex(0)}
                onClick={() => isMobile && setExpandedCardIndex(expandedCardIndex === 3 ? null : 3)}
              >
                {/* 背景圖片 */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: 'url(/g4_website.png)',
                  }}
                />
                
                {/* 手機版內容 */}
                <div className="sm:hidden relative z-10 flex flex-col items-center justify-center h-full px-4 py-6">
                  {expandedCardIndex === 3 ? (
                    <div 
                      className="space-y-3 text-center"
                      style={{
                        animation: 'fadeInUp 0.5s ease-out forwards',
                        opacity: 0
                      }}
                      onAnimationEnd={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                    >
                      <h4 className="text-xs font-bold text-white uppercase whitespace-nowrap">全線上服務</h4>
                      <p className="text-xs text-white/70">結束實體店面服務</p>
                      <p className="text-xs text-white/80 leading-relaxed">
                        2023年，因應網路技術以及線下物流網路的進步，我們結束實體店面服務更專注於線上服務以及印刷成品把關，雖然少了與我們面對面溝通的機會，但我們與客戶的對話將更加迅速且效率。
                      </p>
                    </div>
                  ) : (
                    <h4 
                      className="text-xs font-bold text-white uppercase whitespace-nowrap transition-all duration-300"
                      style={{
                        opacity: expandedCardIndex === null ? 1 : 0,
                        transform: expandedCardIndex === null ? 'translateY(0)' : 'translateY(-10px)'
                      }}
                    >
                      全線上服務
                    </h4>
                  )}
                </div>

                {/* 桌電版內容 */}
                <div className="hidden sm:flex sm:flex-col p-6 flex-grow">

                  {/* 主標題 */}
                  <h4 className="relative z-10 text-xl sm:text-2xl font-bold text-white uppercase mb-1 mt-8 whitespace-nowrap">
                    全線上服務
                  </h4>
                  <p className="relative z-10 text-white/70 text-xs sm:text-sm mb-4 whitespace-nowrap">
                    結束實體店面服務
                  </p>

                  {/* 描述文字 */}
                  <p className="relative z-10 text-white/80 text-xs sm:text-sm mb-6 flex-grow">
                    2023年，因應網路技術以及線下物流網路的進步，我們結束實體店面服務更專注於線上服務以及印刷成品把關，雖然少了與我們面對面溝通的機會，但我們與客戶的對話將更加迅速且效率。
                  </p>

                </div>
              </div>
            </div>
          </div>

          {/* 公司介紹 */}
          <div className="mb-20 p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-8 lg:gap-12 max-w-6xl mx-auto items-start lg:items-center">
              {/* 左側：標題、描述 */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white">
                  關於台灣名片王
                </h3>
                <div className="text-white/80 text-base lg:text-lg leading-relaxed space-y-4">
                  <p className="text-justify">
                    台灣名片王，成立至今已逾二十年，專注於平面設計與印刷製作。
                    我們從名片出發，延伸至各類印刷品與品牌視覺，協助品牌將設計轉化為被看見、被觸摸的實體作品。
                  </p>
                  <p className="text-justify">
                    在快速變化的市場中，我們選擇以穩定與細節為核心。
                    從設計構思、紙張選擇，到印刷與後加工，每一個環節都以實際質感與完成品質為優先考量，而非過度包裝或短期效率。
                  </p>
                  <p className="text-justify">
                    名片、型錄、宣傳品與各類印刷需求，看似形式不同，卻有相同的本質——
                    設計，必須在實體媒介中被正確呈現。
                  </p>
                  <p className="text-justify">
                    二十年的經驗，讓我們清楚哪些地方不能妥協，也讓我們能以更成熟的方式，與設計師、企業及品牌長期合作。
                    我們提供清楚的製作流程、穩定的品質，以及能隨需求調整的整合服務。
                  </p>
                  <p className="text-justify">
                    台灣名片王，為需要被記住的品牌，完成每一次重要的呈現。
                  </p>
                </div>
              </div>

              {/* 右側：統計數據 */}
              <div ref={statsRef} className="flex flex-row lg:flex-col gap-6 lg:gap-8 items-start lg:items-end justify-start lg:justify-start">
                {/* 統計 1 */}
                <div className="space-y-2 text-left lg:text-right">
                  <div className="text-4xl lg:text-5xl font-bold text-white">{counters.stat1}</div>
                  <div className="text-sm lg:text-base text-white/70">
                    二十年服務不間斷
                  </div>
                </div>
                {/* 統計 2 */}
                <div className="space-y-2 text-left lg:text-right">
                  <div className="text-4xl lg:text-5xl font-bold text-white">{counters.stat2}+</div>
                  <div className="text-sm lg:text-base text-white/70">
                    服務顧客總數超過
                  </div>
                </div>
                {/* 統計 3 */}
                <div className="space-y-2 text-left lg:text-right">
                  <div className="text-4xl lg:text-5xl font-bold text-white">{counters.stat3}+</div>
                  <div className="text-sm lg:text-base text-white/70">
                    完成案件數超過
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 價格試算表 */}
      <section id="calculator" className="py-28 px-6 scroll-mt-24 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <PriceCalculator />
        </div>
      </section>

      <DeliverySection id="delivery" title="取貨方式">
        <DeliveryOptions />
      </DeliverySection>

      <Section id="contact" title="聯絡我們">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* 左側：聯絡表單 */}
          <div className="flex-1 w-full space-y-8">
            <p className="text-black/70">聯絡我們開始製作你的名片。</p>
            
            {/* 聯絡表單 */}
            <ContactForm />

            {/* 聯絡方式 */}
            <div className="flex items-center gap-4 pt-6 border-t border-black/10">
              <a
                href="https://line.me/ti/p/@bbh4672t"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-all duration-300"
                aria-label="LINE ID: @bbh4672t"
              >
                <img src="/line-icon.svg" alt="LINE" className="w-8 h-8 transition-all duration-300 opacity-50 hover:opacity-100" />
              </a>
              <a
                href="mailto:yunseng.design@msa.hinet.net"
                className="inline-block transition-all duration-300"
                aria-label="Email: yunseng.design@msa.hinet.net"
              >
                <img src="/email-icon.svg" alt="Email" className="w-8 h-8 transition-all duration-300 opacity-50 hover:opacity-100" />
              </a>
              <a
                href="tel:0422549828"
                className="inline-block transition-all duration-300"
                aria-label="電話: 04-22549828"
              >
                <img src="/tel.svg" alt="電話" className="w-8 h-8 transition-all duration-300 opacity-50 hover:opacity-100" />
              </a>
            </div>
          </div>

          {/* 右側：檔案準備注意事項卡片（桌面版） */}
          <div className="flex-1 w-full lg:max-w-lg">
            <FilePreparationCard />
          </div>
        </div>
      </Section>

      <Footer />
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

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="py-28 px-6 scroll-mt-24 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold tracking-wide mb-8 text-center">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

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
      "細波紙 / 炫光紙 / 頂級雙面上霧P（均須以雙面計價） / 五色一級卡（銀）-最少五盒",
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

// 厚棉卡價格表數據
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

// 價格試算表組件
function PriceCalculator() {
  // 從價格表數據中提取名片材質選項
  const getCardMaterialOptions = () => {
    const materials: string[] = [];
    
    // 從常用紙材提取
    COMMON_PAPER_DATA.forEach((item) => {
      const parts = item.material.split(" / ");
      parts.forEach((part) => {
        const cleanPart = part.trim();
        if (cleanPart && !materials.includes(cleanPart)) {
          materials.push(cleanPart);
        }
      });
    });
    
    // 從高級紙材1提取
    DELUXE_PAPER_DATA_1.forEach((item) => {
      const parts = item.material.split(" / ");
      parts.forEach((part) => {
        const cleanPart = part.trim();
        if (cleanPart && !materials.includes(cleanPart)) {
          materials.push(cleanPart);
        }
      });
    });
    
    // 從高級紙材2提取（保留完整名稱，因為有些材質名稱很長）
    DELUXE_PAPER_DATA_2.forEach((item) => {
      const parts = item.material.split(" / ");
      parts.forEach((part) => {
        let cleanPart = part.trim();
        // 移除「全透卡（最少五盒）」中的「（最少五盒）」
        if (cleanPart.includes("全透卡（最少五盒）")) {
          cleanPart = "全透卡";
        }
        // 移除「五色一級卡（銀）-最少五盒」中的「-最少五盒」
        if (cleanPart.includes("五色一級卡（銀）-最少五盒")) {
          cleanPart = "五色一級卡（銀）";
        }
        if (cleanPart && !materials.includes(cleanPart)) {
          materials.push(cleanPart);
        }
      });
    });
    
    return materials.sort();
  };

  // 從價格表數據中提取DM材質選項
  const getDMMaterialOptions = () => {
    const materials: string[] = [];
    
    // 從DM價格表數據提取，使用完整且明確的名稱
    materials.push(DM_DATA_100P_DOUBLE_COATED.material.split(" / ")[0].trim()); // "100P 雙銅紙"
    materials.push(DM_DATA_150P_DOUBLE_COATED.material.split(" / ")[0].trim()); // "150P 雙銅紙"
    materials.push("80P 模造紙"); // 明確指定為模造紙
    materials.push("100P 道林紙"); // 明確指定為道林紙
    materials.push("100P 模造紙"); // 明確指定為模造紙
    
    return materials.sort();
  };

  const [service, setService] = React.useState("彩色名片");
  const [material, setMaterial] = React.useState("");
  const [printType, setPrintType] = React.useState("雙面印刷");
  const [quantity, setQuantity] = React.useState("250張");
  const [showPriceResult, setShowPriceResult] = React.useState(false);
  const [animatedPrice, setAnimatedPrice] = React.useState(0);
  const [showLines, setShowLines] = React.useState({
    material: false,
    printType: false,
    quantity: false,
    price: false,
    days: false,
  });

  // 檢查材質是否只支援雙面印刷
  const isDoubleSideOnly = React.useMemo(() => {
    if (!material) return false;
    
    // 檢查材質名稱中是否包含這些關鍵字
    const doubleSideOnlyKeywords = [
      "磨砂冷燙卡",
      "雙面局部上光",
      "頂級雙面上霧P",
    ];
    
    return doubleSideOnlyKeywords.some(keyword => 
      material.includes(keyword) || keyword.includes(material.split("（")[0].split("(")[0].trim())
    );
  }, [material]);

  // 當選擇只支援雙面印刷的材質時，自動切換為雙面印刷
  React.useEffect(() => {
    if (isDoubleSideOnly && printType === "單面印刷") {
      setPrintType("雙面印刷");
    }
  }, [isDoubleSideOnly, printType]);
  
  // 從價格表數據中提取厚棉卡材質選項
  const getThickCottonCardMaterialOptions = () => {
    const materials: string[] = [];
    
    THICK_COTTON_CARD_DATA.forEach((item) => {
      // 排除「雷射雕刻請洽服務人員」這種特殊選項
      if (item.material !== "雷射雕刻請洽服務人員") {
        materials.push(item.material);
      }
    });
    
    return materials;
  };

  // 根據服務項目動態獲取材質選項
  const materialOptions = React.useMemo(() => {
    if (service === "A4 DM") {
      return getDMMaterialOptions();
    } else if (service === "厚棉卡") {
      return getThickCottonCardMaterialOptions();
    } else {
      return getCardMaterialOptions();
    }
  }, [service]);

  // 當服務項目改變時，重置材質選擇
  React.useEffect(() => {
    if (materialOptions.length > 0) {
      // 如果當前選擇的材質不在新選項中，則重置為第一個選項
      if (!materialOptions.includes(material)) {
        if (service === "A4 DM") {
          setMaterial(materialOptions[0]);
        } else if (service === "厚棉卡") {
          setMaterial(materialOptions[0]);
        } else {
          // 彩色名片：優先選擇包含"頂級象牙"的材質
          const defaultMaterial = materialOptions.find(m => m.includes("頂級象牙")) || materialOptions[0];
          setMaterial(defaultMaterial);
        }
      }
    }
  }, [service, materialOptions]);

  // 初始化材質選項
  React.useEffect(() => {
    if (!material && materialOptions.length > 0) {
      if (service === "A4 DM") {
        setMaterial(materialOptions[0]);
      } else if (service === "厚棉卡") {
        setMaterial(materialOptions[0]);
      } else {
        // 彩色名片：優先選擇包含"頂級象牙"的材質
        const defaultMaterial = materialOptions.find(m => m.includes("頂級象牙")) || materialOptions[0];
        setMaterial(defaultMaterial);
      }
    }
  }, [material, materialOptions, service]);

  // 價格計算邏輯
  const calculatePrice = () => {
    // 從數量字串中提取數字（支援「張」和「盒」）
    const qtyNum = parseInt(quantity.replace("張", "").replace("盒", ""));
    
    // 根據材質和印刷類型查找對應的價格
    let price = 0;
    
    // 如果是A4 DM，使用DM價格表
    if (service === "A4 DM") {
      const dmDataList = [
        DM_DATA_100P_DOUBLE_COATED,
        DM_DATA_150P_DOUBLE_COATED,
        DM_DATA_80P_DOWLING,
        DM_DATA_100P_DOWLING,
      ];
      
      const dmData = dmDataList.find((item) => {
        // 處理特殊情況：80P 模造紙 對應 80P 道林紙 / 模造紙
        if (material === "80P 模造紙") {
          return item.material.includes("80P") && item.material.includes("模造紙");
        }
        // 處理特殊情況：100P 道林紙 對應 100P 道林 / 模造紙
        if (material === "100P 道林紙") {
          return item.material.includes("100P") && item.material.includes("道林");
        }
        // 處理特殊情況：100P 模造紙 對應 100P 道林 / 模造紙
        if (material === "100P 模造紙") {
          return item.material.includes("100P") && item.material.includes("模造紙");
        }
        // 其他材質的匹配邏輯
        const parts = item.material.split(" / ");
        return parts.some((part) => {
          const cleanPart = part.trim();
          return cleanPart === material || 
                 material.includes(cleanPart) || 
                 cleanPart.includes(material);
        });
      });
      
      if (dmData && dmData.prices) {
        // 找到最接近的數量階梯（從大到小查找）
        let matchedPrice = null;
        for (let i = dmData.prices.length - 1; i >= 0; i--) {
          const p = dmData.prices[i];
          if (typeof p.qty === "number" && qtyNum >= p.qty) {
            matchedPrice = p;
            break;
          }
        }
        
        if (matchedPrice) {
          const priceValue = printType === "雙面印刷" ? matchedPrice.double : matchedPrice.single;
          if (typeof priceValue === "number") {
            price = priceValue;
          }
        }
      }
    } else if (service === "厚棉卡") {
      // 厚棉卡價格計算
      // 厚棉卡的數量單位是張，但價格表使用盒（1盒=100張）
      const materialData = THICK_COTTON_CARD_DATA.find((item) => {
        return item.material === material;
      });
      
      if (materialData) {
        const priceData = printType === "雙面印刷" ? materialData.double : materialData.single;
        // 將張數轉換為盒數（1盒=100張）
        const qtyInBoxes = Math.floor(qtyNum / 100);
        const qtyStr = qtyInBoxes.toString();
        
        if (qtyStr in priceData) {
          const priceValue = priceData[qtyStr as keyof typeof priceData];
          if (priceValue !== null && typeof priceValue === "number") {
            price = priceValue;
          }
        }
      }
    } else {
      // 彩色名片價格計算
      const allMaterials = [
        ...COMMON_PAPER_DATA,
        ...DELUXE_PAPER_DATA_1,
        ...DELUXE_PAPER_DATA_2,
      ];
      
      // 改進材質匹配邏輯
      const materialData = allMaterials.find((m) => {
        // 直接匹配完整材質名稱
        if (m.material === material) {
          return true;
        }
        
        // 檢查材質名稱是否包含在數據中，或數據是否包含材質名稱
        const materialParts = m.material.split(" / ");
        return materialParts.some((part) => {
          const cleanPart = part.trim();
          // 精確匹配或包含匹配
          return cleanPart === material || 
                 material.includes(cleanPart) || 
                 cleanPart.includes(material) ||
                 // 處理括號情況：移除括號內容後匹配
                 (cleanPart.split("（")[0].split("(")[0].trim() === material.split("（")[0].split("(")[0].trim());
        });
      });
      
      if (materialData) {
        const priceData = printType === "雙面印刷" ? materialData.double : materialData.single;
        
        // 根據數量找到最接近的價格階梯
        // 優先順序：1000 > 500 > 300 > 250 > 200
        if (qtyNum >= 1000 && "1000" in priceData) {
          const price1000 = priceData["1000"];
          if (price1000 !== null && typeof price1000 === "number") {
            price = price1000;
          }
        } else if (qtyNum >= 500 && "500" in priceData) {
          const price500 = priceData["500"];
          if (price500 !== null && typeof price500 === "number") {
            price = price500;
          }
        } else if (qtyNum >= 300 && "300" in priceData) {
          const price300 = priceData["300"];
          if (price300 !== null && typeof price300 === "number") {
            price = price300;
          }
        } else if (qtyNum >= 250 && "250" in priceData) {
          const price250 = priceData["250"];
          if (price250 !== null && typeof price250 === "number") {
            price = price250;
          }
        } else if (qtyNum >= 200 && "200" in priceData) {
          const price200 = priceData["200"];
          if (price200 !== null && typeof price200 === "number") {
            price = price200;
          }
        }
      }
    }
    
    return price;
  };

  const price = calculatePrice();

  // 當顯示價格結果時，啟動動畫
  React.useEffect(() => {
    if (showPriceResult) {
      // 重置動畫狀態
      setAnimatedPrice(0);
      setShowLines({
        material: false,
        printType: false,
        quantity: false,
        price: false,
        days: false,
      });

      // 逐行顯示動畫（降低速度增加質感）
      const timer1 = setTimeout(() => setShowLines(prev => ({ ...prev, material: true })), 200);
      const timer2 = setTimeout(() => setShowLines(prev => ({ ...prev, printType: true })), 500);
      const timer3 = setTimeout(() => setShowLines(prev => ({ ...prev, quantity: true })), 800);
      const timer4 = setTimeout(() => setShowLines(prev => ({ ...prev, price: true })), 1100);
      const timer5 = setTimeout(() => setShowLines(prev => ({ ...prev, days: true })), 1400);

      // 數字遞增動畫（降低速度增加質感）
      if (price > 0) {
        const duration = 1500; // 1.5秒動畫時間
        const startTime = Date.now();
        const startPrice = 0;
        const targetPrice = price;

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // 使用 easeOutCubic 緩動函數
          const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
          const easedProgress = easeOutCubic(progress);

          const currentPrice = Math.floor(startPrice + (targetPrice - startPrice) * easedProgress);
          setAnimatedPrice(currentPrice);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setAnimatedPrice(targetPrice);
          }
        };

        // 在價格行顯示後開始數字動畫
        setTimeout(() => {
          requestAnimationFrame(animate);
        }, 1100);
      }

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
      };
    }
  }, [showPriceResult, price]);

  // 根據服務項目和材質動態設置數量選項
  const quantityOptions = React.useMemo(() => {
    if (service === "A4 DM") {
      // A4 DM：根據選擇的材質動態生成數量選項
      if (!material) {
        return [];
      }
      
      const dmDataList = [
        DM_DATA_100P_DOUBLE_COATED,
        DM_DATA_150P_DOUBLE_COATED,
        DM_DATA_80P_DOWLING,
        DM_DATA_100P_DOWLING,
      ];
      
      // 找到對應的DM材質數據
      const dmData = dmDataList.find((item) => {
        // 處理特殊情況：80P 模造紙 對應 80P 道林紙 / 模造紙
        if (material === "80P 模造紙") {
          return item.material.includes("80P") && item.material.includes("模造紙");
        }
        // 處理特殊情況：100P 道林紙 對應 100P 道林 / 模造紙
        if (material === "100P 道林紙") {
          return item.material.includes("100P") && item.material.includes("道林");
        }
        // 處理特殊情況：100P 模造紙 對應 100P 道林 / 模造紙
        if (material === "100P 模造紙") {
          return item.material.includes("100P") && item.material.includes("模造紙");
        }
        // 其他材質的匹配邏輯
        const parts = item.material.split(" / ");
        return parts.some((part) => {
          const cleanPart = part.trim();
          return cleanPart === material || 
                 material.includes(cleanPart) || 
                 cleanPart.includes(material);
        });
      });
      
      if (dmData && dmData.prices) {
        // 從價格數據中提取所有可用的數量選項
        const availableQuantities = new Set<string>();
        
        dmData.prices.forEach((priceEntry) => {
          // 只添加數字類型的數量（排除"20000以上"等字串）
          if (typeof priceEntry.qty === "number") {
            const priceValue = printType === "雙面印刷" ? priceEntry.double : priceEntry.single;
            // 只有當價格是數字時才加入選項（排除"另有優惠"等字串）
            if (typeof priceValue === "number" && !isNaN(priceValue)) {
              availableQuantities.add(priceEntry.qty.toString());
            }
          }
        });
        
        // 轉換為選項格式並排序
        const options = Array.from(availableQuantities)
          .map(qty => `${qty}張`)
          .sort((a, b) => {
            const numA = parseInt(a.replace("張", ""));
            const numB = parseInt(b.replace("張", ""));
            return numA - numB;
          });
        
        return options;
      }
      
      // 如果找不到DM材質數據，返回空陣列
      return [];
    } else if (service === "厚棉卡") {
      // 厚棉卡：根據選擇的材質動態生成數量選項
      if (!material) {
        return [];
      }
      
      const materialData = THICK_COTTON_CARD_DATA.find((item) => {
        return item.material === material;
      });
      
      if (materialData) {
        const priceData = printType === "雙面印刷" ? materialData.double : materialData.single;
        const availableQuantities = new Set<string>();
        
        // 厚棉卡的數量是3、4、5盒，轉換為張數（1盒=100張）
        for (const qty in priceData) {
          if (Object.prototype.hasOwnProperty.call(priceData, qty)) {
            const priceValue = priceData[qty as keyof typeof priceData];
            if (priceValue !== null && typeof priceValue === "number" && !isNaN(priceValue)) {
              // 將盒數轉換為張數（1盒=100張）
              const qtyNum = parseInt(qty);
              const qtyInSheets = qtyNum * 100;
              availableQuantities.add(qtyInSheets.toString());
            }
          }
        }
        
        // 轉換為選項格式並排序（厚棉卡使用「張」）
        const options = Array.from(availableQuantities)
          .map(qty => `${qty}張`)
          .sort((a, b) => {
            const numA = parseInt(a.replace("張", ""));
            const numB = parseInt(b.replace("張", ""));
            return numA - numB;
          });
        
        return options;
      }
      
      return [];
    } else {
      // 彩色名片：根據選擇的材質動態生成數量選項
      const allMaterials = [
        ...COMMON_PAPER_DATA,
        ...DELUXE_PAPER_DATA_1,
        ...DELUXE_PAPER_DATA_2,
      ];
      
      // 找到對應的材質數據
      const materialData = allMaterials.find((m) => {
        // 直接匹配完整材質名稱
        if (m.material === material) {
          return true;
        }
        // 檢查材質名稱是否包含在數據中，或數據是否包含材質名稱
        const materialParts = m.material.split(" / ");
        return materialParts.some((part) => {
          const cleanPart = part.trim();
          // 移除括號內容後匹配
          const cleanMaterial = material.split("（")[0].split("(")[0].trim();
          const cleanPartNoBracket = cleanPart.split("（")[0].split("(")[0].trim();
          // 精確匹配（移除括號後）
          if (cleanMaterial === cleanPartNoBracket) {
            return true;
          }
          // 部分匹配：材質選項包含在數據部分中，或數據部分包含在材質選項中
          if (cleanMaterial.includes(cleanPartNoBracket) || cleanPartNoBracket.includes(cleanMaterial)) {
            return true;
          }
          return false;
        });
      });
      
      if (!material) {
        // 如果還沒有選擇材質，返回空陣列
        return [];
      }
      
      if (materialData) {
        // 檢查該材質有哪些數量選項（檢查single和double中存在的key）
        const availableQuantities = new Set<string>();
        const priceData = printType === "雙面印刷" ? materialData.double : materialData.single;
        
        // 直接遍歷priceData的所有key，而不是預設的數量列表
        // 使用 for...in 確保只遍歷實際存在的屬性
        for (const qty in priceData) {
          if (Object.prototype.hasOwnProperty.call(priceData, qty)) {
            const priceValue = priceData[qty as keyof typeof priceData];
            // 只有當價格不是null且是數字時才加入選項
            if (priceValue !== null && typeof priceValue === "number" && !isNaN(priceValue)) {
              // 如果是全透卡或五色一級卡（銀），排除250張選項
              if ((material === "全透卡" || material === "五色一級卡（銀）") && qty === "250") {
                continue;
              }
              availableQuantities.add(qty);
            }
          }
        }
        
        // 轉換為選項格式並排序
        const options = Array.from(availableQuantities)
          .map(qty => `${qty}張`)
          .sort((a, b) => {
            const numA = parseInt(a.replace("張", ""));
            const numB = parseInt(b.replace("張", ""));
            return numA - numB;
          });
        
        // 如果找到選項就返回，否則返回空陣列
        return options;
      }
      
      // 如果找不到材質數據，返回空陣列
      return [];
    }
  }, [service, material, printType]);

  // 當服務項目、材質或印刷類型改變時，重置數量選擇和隱藏價格結果
  React.useEffect(() => {
    // 當選擇改變時，隱藏價格結果
    setShowPriceResult(false);
    
    if (quantityOptions.length > 0) {
      // 如果當前選擇的數量不在新選項中，則重置為第一個選項
      if (!quantityOptions.includes(quantity)) {
        setQuantity(quantityOptions[0]);
      }
    } else if (material && quantityOptions.length === 0) {
      // 如果選擇了材質但沒有可用選項，可能是匹配失敗，保持當前選擇或設置為空
      // 不設置預設值，讓用戶知道該材質沒有可用選項
    }
  }, [service, material, printType, quantityOptions, quantity]);

  // 價格試算表的服務項目選項
  const calculatorServices = ["彩色名片", "A4 DM", "厚棉卡"];

  return (
    <div className="bg-gray-200 rounded-lg p-6 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {/* 左側面板 */}
        <div className="bg-gray-300 rounded-lg p-4 space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              服務項目
            </label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full bg-gray-600 text-white rounded-lg px-4 py-3 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {calculatorServices.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              材質
            </label>
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full bg-gray-600 text-white rounded-lg px-4 py-3 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {materialOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 中間面板 */}
        <div className="bg-gray-500 rounded-lg p-4 space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              印刷單/雙面
            </label>
            <select
              value={printType}
              onChange={(e) => setPrintType(e.target.value)}
              className="w-full bg-gray-400 text-white rounded-lg px-4 py-3 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              {!isDoubleSideOnly && (
                <option value="單面印刷">單面印刷</option>
              )}
              <option value="雙面印刷">雙面印刷</option>
            </select>
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              數量
            </label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={quantityOptions.length === 0}
              className="w-full bg-gray-400 text-white rounded-lg px-4 py-3 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {quantityOptions.length === 0 ? (
                <option value="">請先選擇材質</option>
              ) : (
                quantityOptions.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* 右側面板 - 計算結果 */}
        <div className="bg-gray-300 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
          {!showPriceResult ? (
            <button
              onClick={() => setShowPriceResult(true)}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              試算價格
            </button>
          ) : (
            <div className="text-black text-right w-full space-y-3">
              <div 
                className={`text-sm transition-all duration-700 ease-out ${
                  showLines.material 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-4'
                }`}
              >
                {material}
              </div>
              <div 
                className={`text-sm transition-all duration-700 ease-out ${
                  showLines.printType 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-4'
                }`}
              >
                {printType}
              </div>
              <div 
                className={`text-sm transition-all duration-700 ease-out ${
                  showLines.quantity 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-4'
                }`}
              >
                {quantity}
              </div>
              <div 
                className={`text-2xl font-bold transition-all duration-700 ease-out ${
                  showLines.price 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-4'
                }`}
              >
                金額 {animatedPrice.toLocaleString()}
              </div>
              <div 
                className={`text-xs text-black/70 transition-all duration-700 ease-out ${
                  showLines.days 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-4'
                }`}
              >
                預計印刷天數2-3日
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 服務項目列表（用於表單下拉選單）
const SERVICES = [
  "開店整體規劃",
  "彩色名片",
  "店卡/會員卡",
  "傳單DM",
  "三聯單",
  "大圖輸出",
  "團體制服",
  "信封信紙/貼紙",
  "手提袋/資料夾",
  "喜帖/邀請卡",
  "廣告贈品",
  "廣告布旗",
  "獎牌/獎座",
  "logo設計",
  "CI規劃",
];

// 檔案準備注意事項卡片組件
function FilePreparationCard() {
  const [showModal, setShowModal] = React.useState(false);

  const cardContent = (
    <>
      <h3 className="text-xl font-bold tracking-wide mb-6 text-black/90">
        自備檔案注意事項
      </h3>
      
      <div className="space-y-6 text-sm text-black/70 leading-relaxed">
        {/* 可接受之檔案軟體 */}
        <div>
          <h4 className="font-semibold text-black/90 mb-2">可接受之檔案軟體</h4>
          <p>僅接受 ai、psd、Jpg、png、pdf 圖檔，其他軟體製作之檔案不予接受。</p>
        </div>

        {/* 字體及文字 */}
        <div>
          <h4 className="font-semibold text-black/90 mb-2">字體及文字</h4>
          <ul className="space-y-2 list-disc list-inside ml-2">
            <li>
              <strong className="text-red-600">注意：</strong>
              請勿使用「華康舊字」、「新細明」、「細明體」、「標楷體」等字體，轉曲後可能會造成字體破裂，請特別注意！
            </li>
            <li>稿件內所有文字必須轉曲（外框化）。</li>
            <li>文字請放置在邊框內 3mm，以免被裁切。</li>
          </ul>
        </div>

        {/* 顏色及印刷 */}
        <div>
          <h4 className="font-semibold text-black/90 mb-2">顏色及印刷</h4>
          <ul className="space-y-2 list-disc list-inside ml-2">
            <li>
              圖片庫顏色或自訂填色請使用 CMYK。
              <strong className="text-red-600">注意：</strong>
              請勿使用色盤填色、自訂色盤填色或 RGB 顏色。
            </li>
            <li>
              印刷顏色無法與螢幕或印樣顏色保證一致，請以 CMYK 色票百分比為準。
              <strong className="text-red-600">注意：</strong>
              CMYK 填色不可低於 5%。
            </li>
            <li>邊框內外請使用 CMYK 填色，否則會造成色差，無法退件。</li>
            <li>印刷顏色每次會有些微色差，10% 色差為正常現象。</li>
          </ul>
        </div>

        {/* 名片尺寸 */}
        <div>
          <h4 className="font-semibold text-black/90 mb-2">名片尺寸</h4>
          <ul className="space-y-2 list-disc list-inside ml-2">
            <li>常用名片尺寸：9x5.4cm、9x5cm、9x4.5cm、9x4cm。</li>
            <li>
              製作檔案時，四邊（上下左右）各留 1mm 出血，檔案尺寸應為 9.2x5.6cm（1080x660 像素）；
              其他例如：9.2x5.2cm、9.2x4.7cm、9.2x4.2cm。
            </li>
          </ul>
        </div>

        {/* 檔案製作 */}
        <div>
          <h4 className="font-semibold text-black/90 mb-2">檔案製作</h4>
          <ul className="space-y-2 list-disc list-inside ml-2">
            <li>使用 CorelDraw 繪圖時，請關閉「隨影像縮放」功能（外框筆刷）。</li>
            <li>DM、海報請附上色樣，以免出錯。</li>
            <li>
              物件請裁切在出血區域外，請勿繪製裁切線或十字線，但請繪製印刷物外框。
              <br />
              （例：名片應繪製 9.2x5.6cm 外框；DM 應繪製 21.4x30.1cm 外框）
            </li>
            <li>
              點陣圖請使用 TIF 或 JPG 格式，350dpi，CMYK 模式。
              <br />
              （匯入 PSD 檔時，請至 &lt;點陣圖&gt; → &lt;轉換成點陣圖&gt; 轉換一次）
            </li>
          </ul>
        </div>
      </div>

      {/* 名片稿件規格 */}
      <div className="mt-8 pt-6 border-t border-black/10">
        <h3 className="text-xl font-bold tracking-wide mb-4 text-black/90">
          名片稿件規格
        </h3>
        <ul className="space-y-2 text-sm text-black/70 leading-relaxed list-disc list-inside ml-2">
          <li>檔案格式需為 AI</li>
          <li>頁面設定為 A4 或以上</li>
          <li>外框繪製 9.2x5.6cm</li>
          <li>請勿繪製裁切線</li>
          <li>完成尺寸 9x5.4cm</li>
          <li>文字需轉外框</li>
          <li>圖檔需使用 CMYK 模式</li>
          <li>陰影、漸層等特效請分離</li>
          <li>透明度、材質填色請轉為點陣圖（300dpi）</li>
          <li>請勿使用「隨影像縮放」功能</li>
          <li>
            <strong className="text-red-600">注意：</strong>
            大面積色塊請上膜（選擇亮 P 或霧 P 紙材），以免裁切時顏色轉印到背面，未依此辦理造成問題無法退件。
          </li>
        </ul>
      </div>
    </>
  );

  return (
    <>
      {/* 桌面版：顯示卡片 */}
      <div className="hidden lg:block bg-white border border-black/10 rounded-lg p-6 shadow-sm">
        {cardContent}
      </div>

      {/* 手機/平板版：浮動按鈕 */}
      <button
        onClick={() => setShowModal(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        style={{ backgroundColor: "rgb(255, 127, 127)" }}
        aria-label="檔案準備注意事項"
      >
        <svg
          xmlns="https://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6 text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </button>

      {/* Modal */}
      {showModal && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-black/90">
                檔案準備注意事項
              </h2>
              <button
                onClick={() => setShowModal(false)}
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
            <div className="bg-white">{cardContent}</div>
          </div>
        </div>
      )}
    </>
  );
}

// 聯絡表單組件
function ContactForm() {
  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    inquiry: "",
    email: "",
    file: null as File | null,
    note: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<
    "idle" | "success" | "error"
  >("idle");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 清除該欄位的錯誤
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // 檢查檔案大小（Vercel 限制為 4.5MB，我們設定為 4MB）
      const maxFileSize = 4 * 1024 * 1024; // 4MB
      if (file.size > maxFileSize) {
        setErrors((prev) => ({
          ...prev,
          file: `檔案大小超過限制（最大 4MB），您的檔案大小為 ${(file.size / 1024 / 1024).toFixed(2)}MB`,
        }));
        e.target.value = "";
        setFormData((prev) => ({ ...prev, file: null }));
        return;
      }
      
      const allowedExtensions = [".ai", ".psd", ".pdf", ".jpeg", ".jpg", ".png"];
      const fileExtension = file.name
        .toLowerCase()
        .substring(file.name.lastIndexOf("."));
      
      if (!allowedExtensions.includes(fileExtension)) {
        setErrors((prev) => ({
          ...prev,
          file: "只接受 ai、psd、pdf、jpeg、png 格式的檔案",
        }));
        e.target.value = "";
        setFormData((prev) => ({ ...prev, file: null }));
        return;
      }
      
      // 清除檔案錯誤
      if (errors.file) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.file;
          return newErrors;
        });
      }
      
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "姓名為必填項目";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "聯絡電話為必填項目";
    } else {
      // 移除所有空格和連字符，只保留數字
      const cleanPhone = formData.phone.replace(/[\s\-()]/g, "");
      // 驗證台灣手機號碼格式：09開頭，總共10位數字
      if (!/^09\d{8}$/.test(cleanPhone)) {
        newErrors.phone = "請輸入有效的台灣手機號碼（格式：09XX-XXX-XXX）";
      }
    }

    if (!formData.inquiry) {
      newErrors.inquiry = "詢問項目為必填項目";
    }

    if (!formData.email.trim()) {
      newErrors.email = "電子信箱為必填項目";
    } else {
      // 更嚴格的電子信箱驗證
      const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "請輸入有效的電子信箱格式";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("inquiry", formData.inquiry);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("note", formData.note);
      
      // 如果有檔案，使用 API route；否則使用 Formspree
      const hasFile = formData.file !== null;
      if (formData.file) {
        formDataToSend.append("file", formData.file);
      }

      const url = hasFile ? "/api/contact" : "https://formspree.io/f/xzddbjvo";
      const headers: HeadersInit = hasFile 
        ? {} 
        : { Accept: "application/json" };

      const response = await fetch(url, {
        method: "POST",
        body: formDataToSend,
        headers,
      });

      if (response.ok) {
        setSubmitStatus("success");
        setErrors({}); // 清除所有錯誤
        setFormData({
          name: "",
          phone: "",
          inquiry: "",
          email: "",
          file: null,
          note: "",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("表單提交失敗:", response.status, errorData);
        setSubmitStatus("error");
        // 顯示具體錯誤訊息
        if (response.status === 413) {
          setErrors({ submit: errorData.error || "檔案大小超過限制（最大 4MB），請壓縮檔案後再試或直接透過電話/Email 與我們聯絡。" });
        } else if (errorData.error) {
          setErrors({ submit: errorData.error });
        } else {
          setErrors({ submit: "送出失敗，請稍後再試或直接透過電話/Email 與我們聯絡。" });
        }
      }
    } catch (error) {
      console.error("表單提交錯誤:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {/* 姓名 */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-black/80 mb-2"
        >
          姓名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7F7F] ${
            errors.name ? "border-red-500" : "border-black/20"
          }`}
          placeholder="請輸入您的姓名"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      {/* 聯絡電話 */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-black/80 mb-2"
        >
          聯絡電話 <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7F7F] ${
            errors.phone ? "border-red-500" : "border-black/20"
          }`}
          placeholder="請輸入您的聯絡電話"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
        )}
      </div>

      {/* 詢問項目 */}
      <div>
        <label
          htmlFor="inquiry"
          className="block text-sm font-medium text-black/80 mb-2"
        >
          詢問項目 <span className="text-red-500">*</span>
        </label>
        <select
          id="inquiry"
          name="inquiry"
          value={formData.inquiry}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7F7F] ${
            errors.inquiry ? "border-red-500" : "border-black/20"
          }`}
        >
          <option value="">請選擇詢問項目</option>
          {SERVICES.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
          <option value="其他">其他</option>
        </select>
        {errors.inquiry && (
          <p className="mt-1 text-sm text-red-500">{errors.inquiry}</p>
        )}
      </div>

      {/* 電子信箱 */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-black/80 mb-2"
        >
          電子信箱 <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7F7F] ${
            errors.email ? "border-red-500" : "border-black/20"
          }`}
          placeholder="請輸入您的電子信箱"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      {/* 上傳檔案 */}
      <div>
        <label
          htmlFor="file"
          className="block text-sm font-medium text-black/80 mb-2"
        >
          上傳檔案（選填）
        </label>
        <input
          type="file"
          id="file"
          name="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".ai,.psd,.pdf,.jpeg,.jpg,.png"
          className="w-full px-4 py-2 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7F7F] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#FF7F7F] file:text-white hover:file:bg-[#4A90E2] file:cursor-pointer"
        />
        {formData.file && (
          <p className="mt-2 text-sm text-black/60">
            已選擇檔案: {formData.file.name}
          </p>
        )}
        {errors.file && (
          <p className="mt-1 text-sm text-red-500">{errors.file}</p>
        )}
      </div>

      {/* 備註 */}
      <div>
        <label
          htmlFor="note"
          className="block text-sm font-medium text-black/80 mb-2"
        >
          備註（選填）
        </label>
        <textarea
          id="note"
          name="note"
          value={formData.note}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7F7F] resize-y"
          placeholder="請輸入您的備註或需求說明..."
        />
      </div>

      {/* 提交按鈕 */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 rounded-full text-white text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: isSubmitting
              ? "rgb(156, 163, 175)"
              : "rgb(255, 127, 127)",
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.backgroundColor = "rgb(74, 144, 226)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.backgroundColor = "rgb(255, 127, 127)";
            }
          }}
        >
          {isSubmitting ? "送出中..." : "送出"}
        </button>
      </div>

      {/* 提交狀態訊息 */}
      {submitStatus === "success" && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          我們已經收到您的信件囉！我將盡快回覆您！
        </div>
      )}
      {submitStatus === "error" && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {errors.submit || "送出失敗，請稍後再試或直接透過電話/Email 與我們聯絡。"}
        </div>
      )}
    </form>
  );
}

// 取貨方式區塊（帶流動背景）
function DeliverySection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  const [flowTime, setFlowTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlowTime((prev) => prev + 0.02);
    }, 50); // 每50ms更新一次，創造流動效果

    return () => clearInterval(interval);
  }, []);

  // 計算流動的漸層位置
  const flowX = 50 + Math.sin(flowTime) * 30;
  const flowY = 50 + Math.cos(flowTime * 0.7) * 25;

  // 顏色一和顏色二
  const color1 = { r: 78, g: 205, b: 196 }; // 中等青綠色 #4ECDC4
  const color2 = { r: 44, g: 120, b: 115 }; // 深青綠色 #2C7873

  // 根據流動位置計算混合顏色
  const xNorm = flowX / 100;
  const color1Weight = 1 - xNorm;
  const color2Weight = xNorm;

  const mixColor = () => {
    const r = Math.round(color1.r * color1Weight + color2.r * color2Weight);
    const g = Math.round(color1.g * color1Weight + color2.g * color2Weight);
    const b = Math.round(color1.b * color1Weight + color2.b * color2Weight);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const centerColor = mixColor();
  const color1Value = `rgb(${color1.r}, ${color1.g}, ${color1.b})`;
  const color2Value = `rgb(${color2.r}, ${color2.g}, ${color2.b})`;

  return (
    <section id={id} className="py-28 scroll-mt-24 relative overflow-hidden">
      {/* 流動漸層背景 */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 120% 120% at ${flowX}% ${flowY}%, ${centerColor} 0%, transparent 60%),
            linear-gradient(to left, ${color1Value} 0%, transparent 70%),
            linear-gradient(to right, ${color2Value} 0%, transparent 70%)
          `,
          backgroundBlendMode: "multiply, multiply, multiply",
          transition: "background 0.5s ease-out",
          zIndex: 0,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <h2 className="text-3xl font-bold tracking-wide mb-8 text-white text-center">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

// 取貨方式組件
function DeliveryOptions() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 max-w-7xl mx-auto w-full">
        {/* 卡片 1 - 最便宜 - 自取 */}
        <div
          className="rounded-lg p-4 sm:p-6 shadow-lg border border-white/20 flex flex-col"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            minHeight: '300px'
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "rgba(78, 205, 196, 0.2)" }}
            >
              <span className="text-2xl">👩‍💼</span>
            </div>
            <div>
              <h3
                style={{ color: "rgb(255, 127, 127)" }}
                className="text-xl font-medium"
              >
                自取
              </h3>
            </div>
          </div>
          <div
            className="space-y-3 text-sm text-left leading-relaxed"
            style={{ color: "rgba(44, 120, 115, 0.8)" }}
          >
            <div
              style={{ backgroundColor: "rgba(78, 205, 196, 0.15)" }}
              className="px-3 py-2 rounded"
            >
              <p className="font-medium" style={{ color: "rgb(44, 120, 115)" }}>
                印製完成後，預約前來我們的梧棲區工作室自取。
              </p>
            </div>
            <div>
              <p
                className="font-medium mb-1"
                style={{ color: "rgb(44, 120, 115)" }}
              >
                營業時間：
              </p>
              <p>星期一~五 上午10:00~下午6:30</p>
            </div>
            <div>
              <p
                className="font-medium mb-1"
                style={{ color: "rgb(44, 120, 115)" }}
              >
                休息日：
              </p>
              <p>每星期六、日、及國定假日不營業</p>
            </div>
          </div>
        </div>

        {/* 卡片 2 - 最貼心 - 宅配到府 */}
        <div
          className="rounded-lg p-4 sm:p-6 shadow-lg border border-white/20 flex flex-col"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            minHeight: '300px'
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "rgba(78, 205, 196, 0.2)" }}
            >
              <span className="text-2xl">🚚</span>
            </div>
            <div>
              <h3
                style={{ color: "rgb(255, 127, 127)" }}
                className="text-xl font-medium"
              >
                宅配
              </h3>
            </div>
          </div>
          <div
            className="space-y-3 text-sm text-left leading-relaxed"
            style={{ color: "rgba(44, 120, 115, 0.8)" }}
          >
            <p>
              當您的商品印刷完成時，客服人員可依您所指定的時間幫您宅配到指定地點。
            </p>
            <div
              style={{ backgroundColor: "rgba(78, 205, 196, 0.15)" }}
              className="px-3 py-2 rounded"
            >
              <p
                className="font-medium text-lg"
                style={{ color: "rgb(255, 127, 127)" }}
              >
                印製費+130元
              </p>
            </div>
            <ul className="space-y-1 list-disc list-inside">
              <li>使用宅配服務需自行負擔運費130元。</li>
              <li>宅配日：星期一~五（例假日不配送）</li>
            </ul>
          </div>
        </div>

        {/* 卡片 3 - 最便利 - 貨到付款 */}
        <div
          className="rounded-lg p-4 sm:p-6 shadow-lg border border-white/20 flex flex-col"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            minHeight: '300px'
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "rgba(78, 205, 196, 0.2)" }}
            >
              <span className="text-2xl">🏪</span>
            </div>
            <div>
              <h3
                style={{ color: "rgb(255, 127, 127)" }}
                className="text-xl font-medium"
              >
                7-11店到店
              </h3>
            </div>
          </div>
          <div
            className="space-y-3 text-sm text-left leading-relaxed"
            style={{ color: "rgba(44, 120, 115, 0.8)" }}
          >
            <p>
              當您的商品印刷完成時，客服人員可依您所指定的7-11門市幫您配送。
            </p>
            <div
              style={{ backgroundColor: "rgba(78, 205, 196, 0.15)" }}
              className="px-3 py-2 rounded"
            >
              <p
                className="font-medium text-lg"
                style={{ color: "rgb(255, 127, 127)" }}
              >
                印製費+80元
              </p>
            </div>
            <ul className="space-y-1 list-disc list-inside">
              <li>店到店運送重量不得超過5公斤</li>
            </ul>
          </div>
        </div>

        {/* 卡片 4 - 預留位置 */}
        <div
          className="rounded-lg p-4 sm:p-6 shadow-lg border border-white/20 flex flex-col"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            minHeight: '300px'
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "rgba(78, 205, 196, 0.2)" }}
            >
              <span className="text-2xl">📦</span>
            </div>
            <div>
              <h3
                style={{ color: "rgb(255, 127, 127)" }}
                className="text-xl font-medium"
              >
                郵政宅配
              </h3>
            </div>
          </div>
          <div
            className="space-y-3 text-sm text-left leading-relaxed flex-grow"
            style={{ color: "rgba(44, 120, 115, 0.8)" }}
          >
            <p>當您的商品印刷完成時，客服人員會使用郵政宅配幫您宅配到指定地點。</p>
            <div
              style={{ backgroundColor: "rgba(78, 205, 196, 0.15)" }}
              className="px-3 py-2 rounded"
            >
              <p
                className="font-medium text-lg"
                style={{ color: "rgb(255, 127, 127)" }}
              >
                印製費+80元
              </p>
            </div>
            <ul className="space-y-1 list-disc list-inside">
              <li>郵政宅配重量不得超過1公斤。</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
