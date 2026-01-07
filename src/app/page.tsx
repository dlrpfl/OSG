'use client';
import { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Pagination } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';
import './page.scss';

export default function Home() {
  const words = [
    {
      id: 1,
      items: [
        {
          id: 1,
          title: '꿀잼',
          pronunciation: '[kkul-jæm]',
          description:
            "It's so fun and entertaining when something is really enjoyable and amusing",
        },
        {
          id: 2,
          title: '노잼',
          pronunciation: '[no-jæm]',
          description: '노잼',
        },
      ],
    },
    {
      id: 2,
      items: [
        {
          id: 1,
          title: '꿀잼',
          pronunciation: '[kkul-jæm]',
          description:
            "It's so fun and entertaining when something is really enjoyable and amusing",
        },
        {
          id: 2,
          title: '노잼',
          pronunciation: '[no-jæm]',
          description: '노잼',
        },
      ],
    },
  ];

  useEffect(() => {
    document.body.style.background = '#FDFBF2';

    return () => {
      document.body.style.background = '';
    };
  }, []);

  return (
    <div className="scdream h-full">
      <header className="flex h-[63px] items-center justify-between px-[20px]">
        <h1 className="text-[24px] leading-[130%] font-medium">Logo</h1>
      </header>
      <div className="relative h-[calc(100%-63px)]">
        <Swiper
          direction="vertical"
          slidesPerView="auto"
          slidesOffsetBefore={16}
          slidesOffsetAfter={16}
          spaceBetween={40}
          mousewheel={{
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: true,
          }}
          modules={[Mousewheel]}
          className="h-full items-center pr-[16px]! pl-[16px]!"
        >
          {words.map((word) => (
            <SwiperSlide key={word.id} className="h-auto!">
              <div className="mx-auto h-auto! max-w-[375px] rounded-[8px] border-[2px] border-b-[8px] border-solid border-black bg-white">
                <div className="flex items-center justify-between border-b-[2px] border-solid border-black p-[14px] pb-[16px]">
                  <div className="flex gap-[4px]">
                    <span className="flex h-[25px] items-center rounded-[4px] border-[1px] border-solid border-black bg-[#F05C22] px-[7px] text-[12px] leading-[100%] font-[500] text-white">
                      # Daily life
                    </span>
                    <span className="flex h-[25px] items-center rounded-[4px] border-[1px] border-solid border-black bg-black px-[7px] text-[12px] leading-[100%] font-[500] text-white">
                      10.23.2025
                    </span>
                  </div>
                </div>
                <div className="aspect-[1.43/1] border-b-[2px] border-solid border-black">
                  <Image
                    src="https://picsum.photos/200/300"
                    alt=""
                    width={200}
                    height={100}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="clip rounded-b-[8px] pt-[20px] pb-[18px]">
                  <Swiper
                    modules={[Pagination]}
                    pagination={{
                      type: 'bullets',
                    }}
                  >
                    {word.items.map((item) => (
                      <SwiperSlide key={item.id}>
                        <div className="flex h-[225px] flex-col items-center justify-center gap-[14px] px-[16px]">
                          <div className="flex items-center gap-[8px]">
                            <div className="flex items-center gap-[4px]">
                              <p className="text-[24px] leading-[29px] font-[500] text-black">
                                {item.title}
                              </p>
                              <p className="text-[16px] leading-[19px] font-[500] text-black">
                                {item.pronunciation}
                              </p>
                            </div>
                            <button
                              type="button"
                              className="flex h-[24px] w-[24px] flex-none cursor-pointer items-center justify-center rounded-[4px] rounded-full border-[1px] border-solid border-black bg-[#F05C22]"
                            >
                              <svg
                                width="12"
                                height="9"
                                viewBox="0 0 12 9"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M5.31492 0.537598L2.63996 2.67756H0.5V5.88751H2.63996L5.31492 8.02747V0.537598Z"
                                  stroke="white"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M9.6329 0.5C10.6359 1.50326 11.1993 2.86378 11.1993 4.28239C11.1993 5.70099 10.6359 7.06151 9.6329 8.06477M7.74438 2.38852C8.24586 2.89015 8.52758 3.57041 8.52758 4.27971C8.52758 4.98901 8.24586 5.66928 7.74438 6.1709"
                                  stroke="white"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </button>
                          </div>
                          <p className="text-center text-[16px] leading-[130%] font-[200] text-[#444444]">
                            {item.description}
                          </p>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
