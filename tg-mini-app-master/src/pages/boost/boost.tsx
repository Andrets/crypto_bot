import { Modal } from '@/components';
import { BoostersSwiper } from '@/components/boostersSwiper';
import { RootState } from '@/store';
import { getUserBoosters } from '@/store/boostersSlice';
import { getByJWTUser } from '@/store/userSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import css from './boost.module.css';

export const Boost = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const { user } = useSelector((state: RootState) => state.user);
  const { boosters } = useSelector((state: RootState) => state.boosters);

  useEffect(() => {
    const fetchUserData = async () => {
      await dispatch(getByJWTUser());
    };
    const fetchBoosterPricesAndLvl = async () => {
      await dispatch(getUserBoosters());
    };
    fetchUserData();
    fetchBoosterPricesAndLvl();
  }, [dispatch]);
  return (
    <div className={css.main}>
      <div className={css.balanceContainer}>
        <div className={css.balance}>
          <h3>Your Balance</h3>
          <h1>{user?.balance?.toLocaleString('de-DE')}</h1>
        </div>
        <p className={css.descriptionBalance}>
          Lorem ipsum dolor sit amet consectetur. Elementum lorem massa
          consectetur id scelerisque in egestas amet rhoncus.
        </p>
      </div>
      <div className={css.freeDailyBoost}>
        <h1>Free Daily Boost</h1>
        <div className={css.boost}>
          <div className={css.turboBoost}>
            <div className={css.boostInfo}>
              <h3>Turbo range</h3>
              <p>{boosters['freeBoosters']?.turbo_range}/3 Available</p>
            </div>
            <span className={css.turboBoostIcon}>🚀</span>
          </div>
          <div className={css.x_LeverageBoost}>
            <div className={css.boostInfo}>
              <h3>X-Leverage</h3>
              <p>{boosters['freeBoosters']?.x_leverage}/3 Available</p>
            </div>
            <span className={css.x_LeverageBoostIcon}>💥</span>
          </div>
        </div>
      </div>
      <div className={css.boosters}>
        <h1>Boosters</h1>
        <div className={css.boostersContainer}>
          <BoostersSwiper />
        </div>
      </div>
      <Modal />
    </div>
  );
};
