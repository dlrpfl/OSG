'use client';
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Pagination } from 'swiper/modules';
import Image from 'next/image';
import { Speaker, ChevronDown, ChevronUp } from "@/components/svg"
import gadget from "@/assets/images/gadget.png"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuContent } from '@radix-ui/react-dropdown-menu';
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
  const [isDropDownMenuOpen, setisDropDownMenuOpen] = useState(false);
  const [wordsSort, setWordsSort] = useState("Latest");
  const [innerSlideIndexMap, setInnerSlideIndexMap] = useState<Record<number, number>>({});


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

  const sortedWords = useMemo(() => {
    if (wordsSort === 'Earliest') {
      return [...words].reverse();
    }
    return words;
  }, [words, wordsSort]);

  // 텍스트에서 특정 단어를 하이라이팅하는 함수
  const highlightWord = (text: string, word: string) => {
    if (!text || !word) return text;

    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedWord})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (part) {
        const partRegex = new RegExp(`^${escapedWord}$`, 'i');
        if (partRegex.test(part)) {
          return (
            <span key={index} className="text-[#f05c22]">
              {part}
            </span>
          );
        }
      }
      return part;
    });
  };


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
          <h1 className='flex'>
            <svg width="75" height="23" viewBox="0 0 75 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 5C1 2.79086 2.79086 1 5 1H71C73.2091 1 75 2.79086 75 5V17C75 19.2091 73.2091 21 71 21H5C2.79086 21 1 19.2091 1 17V5Z" fill="white" />
              <path d="M70.1531 0C72.8299 0 75 2.1455 75 4.79212V18.2079C75 20.8545 72.8299 23 70.1531 23H4.84694C2.17005 23 0 20.8545 0 18.2079V4.79212C0 2.1455 2.17005 0 4.84694 0H70.1531ZM4.84694 1.5133C3.01538 1.5133 1.53061 2.98128 1.53061 4.79212V17.4512C1.53061 18.8442 3.01538 19.9734 4.84694 19.9734H70.1531C71.9846 19.9734 73.4694 18.8442 73.4694 17.4512V4.79212C73.4694 2.98128 71.9846 1.5133 70.1531 1.5133H4.84694Z" fill="black" />
              <path d="M15.4795 4.57617L12.1078 10.9567L15.9519 17.6652H12.5639L9.59945 12.2196H8.57329V17.6652H5.47852V4.57617H8.57329V9.69369H9.59945L12.1241 4.57617H15.4795Z" fill="black" />
              <path d="M70.5205 11.1208C70.5205 13.1875 70.1948 14.959 69.2012 16.2055C68.3053 17.3209 67.0349 17.895 65.178 17.895C63.3211 17.895 62.0507 17.3209 61.1711 16.2055C60.1775 14.959 59.8354 13.1875 59.8354 11.1208C59.8354 9.05414 60.1775 7.28269 61.1711 6.03612C62.0507 4.92076 63.3211 4.34668 65.178 4.34668C67.0349 4.34668 68.3053 4.92076 69.2012 6.03612C70.1948 7.28269 70.5205 9.05414 70.5205 11.1208ZM62.9465 11.1208C62.9465 12.9579 63.1094 13.9092 63.5329 14.5489C63.8912 15.0902 64.4287 15.3526 65.178 15.3526C65.9273 15.3526 66.4648 15.0902 66.8231 14.5489C67.2629 13.9092 67.4258 12.9579 67.4258 11.1208C67.4258 9.28377 67.2629 8.33244 66.8231 7.69275C66.4648 7.15147 65.9273 6.88903 65.178 6.88903C64.4287 6.88903 63.8912 7.15147 63.5329 7.69275C63.1094 8.33244 62.9465 9.28377 62.9465 11.1208Z" fill="black" />
              <path d="M47.8738 11.1208C47.8738 7.24989 49.1931 4.34668 53.2163 4.34668C56.4414 4.34668 58.3146 6.21654 58.4286 9.13615H55.3501C55.2687 7.72555 54.552 6.88903 53.2163 6.88903C51.7178 6.88903 50.9848 7.65994 50.9848 11.1208C50.9848 14.4833 51.7015 15.369 53.2652 15.369C54.6986 15.369 55.3827 14.3685 55.4804 12.8759H53.2652V10.678H58.4123V17.6653H56.1971L55.8876 16.1891C55.4478 17.2061 54.3728 17.895 52.8254 17.895C49.2746 17.895 47.8738 15.0738 47.8738 11.1208Z" fill="black" />
              <path d="M43.3287 17.6642L39.6801 9.87313V17.6642H36.6179V4.5752H39.6801L43.3287 12.3663V4.5752H46.3909V17.6642H43.3287Z" fill="black" />
              <path d="M34.8772 4.5752V17.6642H31.7825V4.5752H34.8772Z" fill="black" />
              <path d="M22.3503 17.6642V4.5752H25.4451V15.1383H30.6899V17.6642H22.3503Z" fill="black" />
              <circle cx="18" cy="11" r="2" fill="#F05C22" />
            </svg>
          </h1>
          <DropdownMenu open={isDropDownMenuOpen} onOpenChange={setisDropDownMenuOpen}>
            <DropdownMenuTrigger className='flex font-[500] text-[16px] leading-[130%] items-center gap-[8px] cursor-pointer'>
              {wordsSort}
              {isDropDownMenuOpen ? <ChevronUp /> : <ChevronDown />}
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent className="absolute z-[5] left-[-50%] translate-x-[-50%] border-[2px] border-solid border-black rounded-[8px] bg-white min-w-[92px] p-[12px]" sideOffset={5}>
                <DropdownMenuRadioGroup value={wordsSort} onValueChange={setWordsSort} className='flex flex-col gap-[12px]'>
                  <DropdownMenuRadioItem value='Latest' className="font-[500] text-[16px] leading-[130%] opacity-[40%] data-[state=checked]:opacity-100 data-[highlighted]:opacity-100 cursor-pointer">Latest</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='Earliest' className="font-[500] text-[16px] leading-[130%] opacity-[40%] data-[state=checked]:opacity-100 data-[highlighted]:opacity-100 cursor-pointer">Earliest</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>
        </header>
        <div className="relative h-[calc(100%-63px)]">
          <Swiper
            direction="vertical"
            spaceBetween={40}
            mousewheel={{
              forceToAxis: true,
              sensitivity: 1,
              releaseOnEdges: true,
            }}
            modules={[Mousewheel]}
            breakpoints={{
              768: {
                slidesPerView: 1
              },

              769: {
                slidesPerView: 1.2
              }
            }}
            className="h-full items-center pr-[16px]! pl-[16px]! pt-[16px]! pb-[40px]!"
          >
            {sortedWords.map((word) => (
              <SwiperSlide key={word.id}>
                <div className="mx-auto max-w-[375px] h-full rounded-[8px] border-[2px] border-b-[8px] border-solid border-black bg-white">
                  <Swiper
                    modules={[Pagination]}
                    pagination={{
                      type: 'bullets',
                    }}
                    className='h-full rounded-[6px]'
                    onSlideChange={(swiper) => {
                      setInnerSlideIndexMap(prev => ({
                        ...prev,
                        [word.id]: swiper.activeIndex,
                      }));
                    }}
                    initialSlide={innerSlideIndexMap[word.id] ?? 0}
                  >
                    <SwiperSlide>
                      <div className='flex flex-col h-full'>
                        <div className="flex flex-none gap-[20px] px-[14px] h-[49px] items-center border-b-[2px] border-solid border-black">
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
                        </div>
                        <div className="aspect-[5/3] relative flex-none">
                          <Image
                            src={word.image_url}
                            alt={word.word}
                            fill
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="border-t-[2px] border-solid border-black h-full">
                          <div className='h-[calc(100%-56px)] flex flex-col justify-center items-center p-[24px]'>
                            <button type='button' className='mb-[8px]'>
                              <Speaker />
                            </button>
                            <p className="text-[26px] leading-[140%] font-[500] text-black">
                              {word.word}
                            </p>
                            <p className="mt-[2px] text-[14px] leading-[100%] font-[500] text-[#999999]">
                              {`[${word.pronunciation}]`}
                            </p>
                            <p className="mt-[16px] text-center text-[16px] leading-[130%] font-[200] text-[#444444]">
                              {word.meaning}
                            </p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className='flex flex-col h-full'>
                        <div className='h-[120px] flex flex-none justify-center bg-[#F05C22] overflow-hidden items-start rounded-t-[6px] relative'>
                          <Image
                            src={gadget.src}
                            width={179}
                            height={160}
                            alt=''
                            className='absolute left-[74px] top-[-2px]'
                          />
                          <p className='font-[800] text-[86px] text-[#FFA37E] leading-[103px] tracking-[-0.02em] pt-[15px]'>Example</p>
                        </div>
                        <div className='flex-none flex flex-col items-center h-[calc(100%-174px)] border-t-[2px] border-solid border-black justify-center p-[22px]'>
                          <button type='button' className='mb-[8px]'>
                            <Speaker />
                          </button>
                          <p className="text-[26px] leading-[140%] font-[500] text-black">
                            {word.word}
                          </p>
                          <p className="mt-[2px] text-[14px] leading-[100%] font-[500] text-[#999999]">
                            {`[${word.pronunciation}]`}
                          </p>
                          <dl className='mt-[20px] border-t-[1px] border-solid border-[#d1d1d1] pt-[20px] flex flex-col gap-[16px] w-full'>
                            <div className='flex flex-col items-center gap-[12px]'>
                              <dt className='h-[21px] flex px-[8px] bg-[#EBEBEB] rounded-[6px] items-center text-[12px] font-[500] text-[#969696] w-min'>Korean</dt>
                              <dd className='font-[500] text-[14px] leading-[130%] text-center text-[#444]'>
                                {highlightWord(word.example_kr, word.word)}
                              </dd>
                            </div>
                            <div className='flex flex-col items-center gap-[12px]'>
                              <dt className='h-[21px] flex px-[8px] bg-[#EBEBEB] rounded-[6px] items-center text-[12px] font-[500] text-[#969696] w-min'>English</dt>
                              <dd className='font-[500] text-[14px] leading-[130%] text-center text-[#444]'>
                                {highlightWord(word.example_en, word.pronunciation)}
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                    </SwiperSlide>
                  </Swiper>
                </div>
              </SwiperSlide>
            ))}
          </Swiper >
        </div >
      </div >
    </>
  );
}
