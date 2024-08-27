import { Loader } from '@/components/loader';
import { RootState } from '@/store';
import { getCoinBySymbolAndNetworkThunk } from '@/store/coinSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'swiper/css';
import { FreeMode, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { CoinListItem } from './coinListItem';
import css from './coinsswiper.module.css';

export const items = [
  {
    id: 1,
    network: 'ton',
    contract_address: 'EQARK5MKz_MK51U5AZjK3hxhLg1SmQG2Z-4Pb7Zapi_xwmrN',
    img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28850.png',
  },
  {
    id: 2,
    network: 'ton',
    contract_address: 'EQA-X_yo3fzzbDbJ_0bzFWKqtRuZFIRa1sJsveZJ1YpViO3r',
    img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11419.png',
  },
  {
    id: 3,
    network: 'ethereum',
    contract_address: '0xc7bbec68d12a0d1830360f8ec58fa599ba1b0e9b',
    img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  },
  {
    id: 4,
    network: 'bsc',
    contract_address: '0x6aa9c4eda3bf8ac038ad5c243133d6d25aa9cc73',
    img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4023.png',
  },
  {
    id: 5,
    network: 'solana',
    contract_address: 'DSUvc5qf5LJHHV5e2tD184ixotSnCnwj7i4jJa4Xsrmt',
    img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
  },
  {
    id: 6,
    network: 'ethereum',
    contract_address: '0xa43fe16908251ee70ef74718545e4fe6c5ccec9f',
    img: 'https://s2.coinmarketcap.com/static/img/coins/64x64/24478.png',
  },
];

const COIN_TTL = 1000 * 60 * 1000; // 5 минут в миллисекундах

const setWithExpiry = (key: string, value: any, ttl: number) => {
  const now = new Date();
  const item = {
    value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

const getWithExpiry = (key: string) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
};

export const CoinsSwiper = () => {
  const dispatch = useDispatch<ThunkDispatch<unknown, unknown, unknown>>();
  const { coins, loading } = useSelector((state: RootState) => state.coin);

  useEffect(() => {
    const fetchCoinData = async () => {
      await Promise.all(
        items.map(async (item) => {
          const storageKey = `${item.network}_${item.contract_address}`;
          const cachedData = getWithExpiry(storageKey);

          if (cachedData) {
            // Если есть кешированные данные, используйте их для обновления состояния
            dispatch({
              type: 'coin/getCoinBySymbolAndNetwork/fulfilled',
              payload: cachedData,
            });
          } else {
            // Проверка, есть ли монета уже в состоянии
            const existingCoin = coins.find(
              (coin) =>
                coin.contract_address === item.contract_address &&
                coin.network_slug === item.network,
            );
            if (!existingCoin) {
              // Иначе делаем запрос к API и сохраняем данные в локальное хранилище
              const coinData = await dispatch(
                getCoinBySymbolAndNetworkThunk({
                  contract_address: item.contract_address,
                  network: item.network,
                  logo: item.img,
                }),
              ).unwrap();
              setWithExpiry(storageKey, coinData, COIN_TTL);
            }
          }
        }),
      );
    };

    fetchCoinData();
  }, [dispatch, coins]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Swiper
      slidesPerView="auto"
      spaceBetween={15}
      modules={[FreeMode, Scrollbar]}
      scrollbar={{ draggable: true }}
      freeMode
      direction="vertical"
      className={css.swiper}
    >
      {coins.map((item, index) => (
        <SwiperSlide key={index} className={css.swiperSlide}>
          <CoinListItem item={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
