'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Pagination } from 'swiper/modules';
import Image from 'next/image';
import { Drawer } from 'vaul';
import { Share, Save } from "../components/svg"
import 'swiper/css';
import 'swiper/css/pagination';
import './page.scss';


interface TableWord {
  id: number;
  created_at: string;
  word: string;
  imageStatus: string;
  workStatus: string;
  displayStatus: string;
  image_url: string;
  is_published: boolean;
  pronunciation: string;
  meaning: string;
  hashtags: string[];
  example_kr: string;
  example_en: string;
}

export default function Home() {
  const [words, setWords] = useState<TableWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<TableWord | null>(null);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await axios.get<{ words: TableWord[] }>('/api/words');
        // Filter only published words
        const publishedWords = response.data.words.filter(w => w.is_published);
        setWords(publishedWords);
      } catch (error) {
        console.error('Failed to fetch words', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, []);

  useEffect(() => {
    document.body.style.background = '#FDFBF2';

    return () => {
      document.body.style.background = '';
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FDFBF2]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7C3AED] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
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
                  {/* 해쉬태그 */}
                  <div className="flex gap-[20px] p-[14px] items-start">
                    <div className="flex items-center flex-wrap justify-between flex-1">
                      <div className="flex flex-wrap gap-[4px]">
                        {word.hashtags.map((hashtag) => (
                          <span key={hashtag} className="flex h-[25px] items-center rounded-[4px] border-[1px] border-solid border-black bg-[#F05C22] px-[7px] text-[12px] leading-[100%] font-[500] text-white flex-none">
                            {hashtag}
                          </span>
                        ))}
                        <span className="flex h-[25px] items-center rounded-[4px] border-[1px] border-solid border-black bg-black px-[7px] text-[12px] leading-[100%] font-[500] text-white">
                          {word.created_at ? new Date(word.created_at).toLocaleDateString() : ''}
                        </span>
                      </div>
                    </div>
                    <button type='button' className='flex-none mt-[10.5px] cursor-pointer' onClick={() => {
                      setSelectedWord(word);
                      setIsDrawerOpen(true)
                    }}>
                      <svg width="20" height="4" viewBox="0 0 20 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="4" height="4" rx="2" fill="black" />
                        <rect x="8" width="4" height="4" rx="2" fill="black" />
                        <rect x="16" width="4" height="4" rx="2" fill="black" />
                      </svg>
                    </button>
                  </div>
                  {/* // 해쉬태그 */}
                  <Swiper
                    modules={[Pagination]}
                    pagination={{
                      type: 'bullets',
                    }}
                  >
                    <SwiperSlide>
                      <div className="border-t-[2px] aspect-[1.43/1] border-b-[2px] border-solid border-black">
                        <Image
                          src={word.image_url || 'https://picsum.photos/200/300'}
                          alt={word.word}
                          width={400}
                          height={533}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex h-[225px] flex-col items-center justify-center gap-[14px] px-[16px]">
                        <div className="flex items-center gap-[8px]">
                          <div className="flex items-center gap-[4px]">
                            <p className="text-[24px] leading-[29px] font-[500] text-black">
                              {word.word}
                            </p>
                            <p className="text-[16px] leading-[19px] font-[500] text-black">
                              {`[${word.pronunciation}]`}
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
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M9.6329 0.5C10.6359 1.50326 11.1993 2.86378 11.1993 4.28239C11.1993 5.70099 10.6359 7.06151 9.6329 8.06477M7.74438 2.38852C8.24586 2.89015 8.52758 3.57041 8.52758 4.27971C8.52758 4.98901 8.24586 5.66928 7.74438 6.1709"
                                stroke="white"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                        <p className="text-center text-[16px] leading-[130%] font-[200] text-[#444444]">
                          {word.meaning}
                        </p>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide className="h-[-webkit-fill-available]!">
                      <div className='h-full pt-[36px] pb-[8px] px-[20px]'>
                        <div className='h-full relative border-[2px] border-solid border-black rounded-[8px] bg-[#F5F5F5] before:content-[""] before:absolute before:left-[7px] before:top-[7px] before:w-full before:h-full before:bg-black before:rounded-[8px] before:z-[-1] flex items-center justify-center flex-col gap-[32px] p-[16px]'>
                          <p className='absolute left-[16px] top-[-20px] border-[2px] border-solid border-black rounded-[8px] h-[40px] flex items-center px-[12px] font-[500] text-[16px] bg-white'>
                            Explanation
                          </p>
                          <div className="flex items-center gap-[8px]">
                            <div className="flex items-center gap-[4px]">
                              <p className="text-[24px] leading-[29px] font-[500] text-black">
                                {word.word}
                              </p>
                              <p className="text-[16px] leading-[19px] font-[500] text-black">
                                {`[${word.pronunciation}]`}
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
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M9.6329 0.5C10.6359 1.50326 11.1993 2.86378 11.1993 4.28239C11.1993 5.70099 10.6359 7.06151 9.6329 8.06477M7.74438 2.38852C8.24586 2.89015 8.52758 3.57041 8.52758 4.27971C8.52758 4.98901 8.24586 5.66928 7.74438 6.1709"
                                  stroke="white"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>
                          <p className='text-[16px] font-[200] text-[#444444] leading-[130%] text-center'>{word.example_en}</p>
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide className="h-[-webkit-fill-available]!">
                      <div className='h-full pt-[36px] pb-[8px] px-[20px]'>
                        <div className='h-full relative border-[2px] border-solid border-black rounded-[8px] bg-[#F5F5F5] before:content-[""] before:absolute before:left-[7px] before:top-[7px] before:w-full before:h-full before:bg-black before:rounded-[8px] before:z-[-1] flex items-center justify-center flex-col gap-[32px] p-[16px]'>
                          <p className='absolute left-[16px] top-[-20px] border-[2px] border-solid border-black rounded-[8px] h-[40px] flex items-center px-[12px] font-[500] text-[16px] bg-white'>
                            Example
                          </p>
                          <div className="flex items-center gap-[8px]">
                            <div className="flex items-center gap-[4px]">
                              <p className="text-[24px] leading-[29px] font-[500] text-black">
                                {word.word}
                              </p>
                              <p className="text-[16px] leading-[19px] font-[500] text-black">
                                {`[${word.pronunciation}]`}
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
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M9.6329 0.5C10.6359 1.50326 11.1993 2.86378 11.1993 4.28239C11.1993 5.70099 10.6359 7.06151 9.6329 8.06477M7.74438 2.38852C8.24586 2.89015 8.52758 3.57041 8.52758 4.27971C8.52758 4.98901 8.24586 5.66928 7.74438 6.1709"
                                  stroke="white"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>
                          <p className='text-[16px] font-[200] text-[#444444] leading-[130%] text-center'>{word.example_kr}</p>
                        </div>
                      </div>
                    </SwiperSlide>
                  </Swiper>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <Drawer.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Drawer.Portal>
          <Drawer.Overlay />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 w-full border-[2px] border-solid border-black z-50 rounded-t-[28px]">
            <div className='bg-[#F5F5F5] px-[14px] pt-[14px] pb-[22px] rounded-t-[28px]'>
              <div className='flex mb-[16px] justify-center'>
                <span className='w-[40px] h-[4px] rounded-[9999px] bg-black'></span>
              </div>
              <Drawer.Title className="sr-only">Util Menu</Drawer.Title>
              <Drawer.Description className='sr-only'>Save as Image and Share</Drawer.Description>
              <div className='flex flex-col gap-[8px]'>
                <button type='button' className='flex items-center justify-center gap-[6px] border-[2px] border-solid border-black rounded-[8px] h-[53px] bg-[#F05C22] text-white font-[500] text-[16px] leading-[130%]'>
                  <Save color='white' />
                  Save as Image
                </button>
                <button type='button' className='flex items-center justify-center gap-[6px] border-[2px] border-solid border-black rounded-[8px] h-[53px] bg-black text-white font-[500] text-[16px] leading-[130%]'>
                  <Share color='white' />
                  Share
                </button>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
