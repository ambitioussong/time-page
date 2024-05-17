import { useEffect, useState } from 'react';
import { format, getDaysInMonth, startOfMonth, addMonths, subMonths, isToday } from 'date-fns';
import { Lunar } from 'lunar-javascript';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [currentTime, setCurrentTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const startDay = startOfMonth(currentMonth).getDay();
  const calendarDays = [];

  // startDay从0开始，代表星期天，转换为周一到周日
  const adjustedStartDay = (startDay + 6) % 7;

  for (let i = 0; i < adjustedStartDay; i++) {
    calendarDays.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
  }

  // 确保最后一行有7个格子
  while (calendarDays.length % 7 !== 0) {
    calendarDays.push(null);
  }

  const formatTime = (date) => {
    return format(date, 'HH:mm:ss').split('').map((char, index) => (
      <span key={index}>{char}</span>
    ));
  };

  return (
    <div className={styles.container}>
      {currentTime && (
        <div className={styles.time}>
          {formatTime(currentTime)}
        </div>
      )}
      <div className={styles.calendar}>
        <div className={styles.weekdays}>
          {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map(day => (
            <div key={day} className={styles.weekday}>{day}</div>
          ))}
        </div>
        <div className={styles.daysContainer}>
          <div className={styles.days}>
            {calendarDays.map((day, index) => (
              <div key={index} className={`${styles.day} ${day && isToday(day) ? styles.today : ''}`}>
                {day ? (
                  <>
                    <div>{format(day, 'd')}</div>
                    <div className={styles.lunar}>{Lunar.fromDate(day).getDayInChinese()}</div>
                  </>
                ) : ''}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <button onClick={handlePreviousMonth} className={styles.navButton}>上一月</button>
        <span>{format(currentMonth, 'yyyy年M月')}</span>
        <button onClick={handleNextMonth} className={styles.navButton}>下一月</button>
      </div>
    </div>
  );
}
