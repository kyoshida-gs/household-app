import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja";
import "@/calendar.css";
import type { DatesSetArg, EventContentArg } from "@fullcalendar/core/index.js";
import { calculateDailyBalances } from "@/utils/financeCalculations";
import type { Balance, CalendarContent, Transaction } from "@/types";
import { formatCurrency } from "@/utils/formatting";

interface CalendarProps {
  monthlyTransactions: Transaction[];
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}

export default function Calendar({
  monthlyTransactions,
  setCurrentMonth,
}: CalendarProps) {
  const dailyBalances = calculateDailyBalances(monthlyTransactions);
  console.log("dailyBalances: ", dailyBalances);

  // ***2.FullCalendar用のイベントを生成する関数📅
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
  console.log("calendarEvents: ", calendarEvents);

  const renderEventContent = (eventInfo: EventContentArg) => {
    console.log(eventInfo);

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

  const handleDatesSet = (datesetInfo: DatesSetArg) => {
    console.log("dateInfo: ", datesetInfo);
    setCurrentMonth(datesetInfo.view.currentStart);
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      locale={jaLocale}
      events={calendarEvents}
      eventContent={renderEventContent}
      datesSet={handleDatesSet}
    />
  );
}
