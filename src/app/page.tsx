'use client';
import { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import './page.scss';
import 'swiper/css';

export default function Home() {
  useEffect(() => {
    document.body.style.background =
      'linear-gradient(122.01deg, #FAF5FF 0%, #FCE7F3 50%, #FFEDD5 100%), #FFFFFF';
  }, []);

  return (
    <div className="pretendard h-screen">
      <header className="h-[86px] bg-[#ccc] px-[23px] pt-[21px]">
        <h1 className="text-[24px] leading-[29px] font-bold">서비스명</h1>
      </header>
      <div className="relative h-[calc(100vh-86px)]">
        <Swiper direction="vertical" className="justify-center">
          <SwiperSlide className="h-auto max-w-[402px] bg-white">
            asdfsad
          </SwiperSlide>
          <SwiperSlide className="h-auto max-w-[402px] bg-white">
            asdfsaasdsadd
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}
