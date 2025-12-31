'use client';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import Image from 'next/image';
import { Speeker } from '@/components/svg';
import './page.scss';
import 'swiper/css';

export default function Home() {
  const [slides, setSlides] = useState([1, 2, 3]);

  useEffect(() => {
    document.documentElement.style.background =
      'linear-gradient(122.01deg, #FAF5FF 0%, #FCE7F3 50%, #FFEDD5 100%), #FFFFFF';
  }, []);

  return (
    <div className="pretendard h-screen">
      <header className="h-[86px] bg-[#ccc] px-[23px] pt-[21px]">
        <h1 className="text-[24px] leading-[29px] font-bold">서비스명</h1>
      </header>
      <div className="relative h-[calc(100vh-86px)]">
        <Swiper
          direction="vertical"
          slidesPerView="auto"
          slidesOffsetBefore={61}
          slidesOffsetAfter={61}
          spaceBetween={176}
          mousewheel={{
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: true,
          }}
          modules={[Mousewheel]}
          className="h-full items-center pr-4! pl-4!"
        >
          {slides.map((slideId) => (
            <SwiperSlide key={slideId} className="h-auto!">
              <div className="mx-auto h-auto! max-w-[402px] rounded-[20px] bg-white">
                <div className="relative h-[260px] rounded-t-[20px] before:absolute before:inset-0 before:rounded-t-[20px] before:content-[''] before:[background:linear-gradient(119.74deg,#A78BFA_0%,#EC4899_100%)] after:absolute after:inset-0 after:rounded-t-[20px] after:content-[''] after:[background:linear-gradient(0deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%)]">
                  <Image
                    src="https://picsum.photos/200/300"
                    alt=""
                    width={200}
                    height={100}
                    className="relative h-full w-full rounded-t-[20px] object-cover opacity-50"
                  />
                </div>
                <div className="p-[24px]">
                  <div className="flex h-[40px] items-center justify-between">
                    <p className="text-violet text-[12px] leading-[14px] font-bold uppercase">
                      Today&apos;s Phrase
                    </p>
                  </div>
                  <div className="flex h-[51px] items-start gap-[6px] pt-[3px]">
                    <p className="text-ebony text-[36px] leading-[100%] font-bold">
                      꿀잼{' '}
                      <span className="text-ebony font-[Times_New_Roman] text-[18.7px] leading-[100%] font-bold">
                        [kkul-jæm]
                      </span>
                    </p>
                    <button type="button" className="mt-[14px] cursor-pointer">
                      <Speeker />
                    </button>
                  </div>
                  <p className="text-gray text-[14px] leading-[21px]">
                    It&apos;s so fun and entertaining when something is really
                    enjoyable and amusing.
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
