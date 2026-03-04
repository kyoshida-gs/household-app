import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja";
import "@/calendar.css";
import type { DatesSetArg, EventContentArg } from "@fullcalendar/core/index.js";
import { calculateDailyBalances } from "@/utils/financeCalculations";
import type { Balance, CalendarContent } from "@/types";
import { formatCurrency } from "@/utils/formatting";
import interactionPlugin, {
  type DateClickArg,
} from "@fullcalendar/interaction";
import { useTheme } from "@mui/material";
import { isSameMonth } from "date-fns";
import useMonthlyTransaction from "@/hooks/useMonthlyTransaction";
import { useAppContext } from "@/hooks/useAppContext";

interface CalendarProps {
  setCurrentDay: React.Dispatch<React.SetStateAction<string>>;
  currentDay: string;
  today: string;
  handleDateClick: (dateInfo: DateClickArg) => void;
}

export default function Calendar({
  setCurrentDay,
  currentDay,
  today,
  handleDateClick,
}: CalendarProps) {
  const monthlyTransactions = useMonthlyTransaction();
  const { setCurrentMonth } = useAppContext();

  const theme = useTheme();
  const dailyBalances = calculateDailyBalances(monthlyTransactions);
  // console.log("dailyBalances: ", dailyBalances);

  // FullCalendar用のイベントを生成する関数
  const createCalendarEvents = (
    dailyBalances: Record<string, Balance>,
  ): CalendarContent[] => {
    return Object.keys(dailyBalances).map((date) => {
      const { income, expense, balance } = dailyBalances[date];
      return {
        start: date,
        income: formatCurrency(income),
        expense: formatCurrency(expense),
        balance: formatCurrency(balance),
      };
    });
  };

  const calendarEvents = createCalendarEvents(dailyBalances);
  // console.log("calendarEvents: ", calendarEvents);

  const backgroundEvent = {
    start: currentDay,
    display: "background",
    backgroundColor: theme.palette.incomeColor.light,
  };

  // カレンダーイベントの見た目を作る関数
  const renderEventContent = (eventInfo: EventContentArg) => {
    // console.log(eventInfo);

    return (
      <div>
        <div className="money" id="event-income">
          {eventInfo.event.extendedProps.income}
        </div>
        <div className="money" id="event-expense">
          {eventInfo.event.extendedProps.expense}
        </div>
        <div className="money" id="event-balance">
          {eventInfo.event.extendedProps.balance}
        </div>
      </div>
    );
  };

  // 月の日付取得
  const handleDatesSet = (datesetInfo: DatesSetArg) => {
    // console.log("dateInfo: ", datesetInfo);
    const currentMonth = datesetInfo.view.currentStart;
    setCurrentMonth(currentMonth);
    const todayDate = new Date();
    if (isSameMonth(todayDate, currentMonth)) {
      setCurrentDay(today);
    }
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      locale={jaLocale}
      events={[...calendarEvents, backgroundEvent]}
      eventContent={renderEventContent}
      datesSet={handleDatesSet}
      dateClick={handleDateClick}
      height="auto"
    />
  );
}
