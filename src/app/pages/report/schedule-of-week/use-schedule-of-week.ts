import { useState } from 'react';
import { useFapData, useFapDataCustom } from '@/app/providers/fap-data-provider';

// Define the Shift type
export interface Shift {
  activityId: number;
  courseName: string;
  room: string;
  time: string;
  dateTime: {
    start: string;
    end: string;
  };
  meetingURL?: string;
  materialURL?: string;
  status: number;
  online?: boolean;
}

// Function to convert HTML data to structured data
function convertToScheduler(original: Element): (Shift | undefined)[][] {
  if (!original) {
    return [];
  }

  const tables = Array.from(
    original.querySelectorAll('table'),
  ) as HTMLTableElement[];
  const scheduleTable =
    tables.find((table) =>
      table.classList.contains('table') && table.classList.contains('table-bordered'),
    ) ?? tables[2];

  if (!scheduleTable) {
    return [];
  }

  const headerRows = scheduleTable.rows;
  if (headerRows.length < 2) {
    return [];
  }

  const dayHeaders = Array.from(headerRows[0].cells)
    .slice(1)
    .map((cell) => cell.textContent?.trim() || '');
  const dateHeaders = Array.from(headerRows[1].cells)
    .slice(1)
    .map((cell) => cell.textContent?.trim() || '');

  const shifts = Array.from({ length: scheduleTable.rows.length - 2 }, () =>
    Array.from(
      { length: dayHeaders.length },
      (): Shift | undefined => undefined
    )
  );

  const yearElement = original?.querySelector(
    '#ctl00_mainContent_drpYear'
  ) as HTMLSelectElement;

  const currentYear = Array.from(yearElement.options).find(
    (option) => option.selected
  )?.value;

  for (let i = 2; i < scheduleTable.rows.length; i++) {
    const slotRow = scheduleTable.rows[i];
    const slotCell = slotRow.cells[0];
    const slotText = slotCell?.textContent?.trim() || '';
    const timeMatch = slotText.match(/\(([^)]+)\)/);
    const time = timeMatch ? timeMatch[1] : '';
    if (!time) {
      continue;
    }

    for (let j = 1; j < slotRow.cells.length; j++) {
      const cell = slotRow.cells[j];
      if (!cell || cell.textContent?.trim() === '-') {
        continue;
      }

      try {
        const activityLink = cell.querySelector(
          'a[href*="ActivityDetail.aspx?id"]'
        );
        const activityId = activityLink?.getAttribute('href')?.split('id=')[1];
        const courseName = activityLink?.textContent
          ?.replace(/\s+/g, ' ')
          ?.replace('-', '')
          ?.trim();
        const cellContent = cell.innerText ?? cell.textContent ?? '';
        const roomMatch = cellContent.match(/at\s+([^\n-]+?)(?:\s*-\s*|$|\()/i);
        const room = roomMatch ? roomMatch[1].trim() : '';

        const statusText = cell.textContent
          ?.match(/(Not yet|attended|absent)/i)?.[0]
          .toLowerCase();

        let status = 0;
        switch (statusText) {
          case 'not yet':
            status = 0;
            break;
          case 'attended':
            status = 1;
            break;
          case 'absent':
            status = 2;
            break;
        }

        const syllabusLink = cell.querySelector(
          'a.label.label-warning',
        ) as HTMLAnchorElement | null;
        const syllabusURL = syllabusLink?.href || '';

        const meetLink = cell.querySelector(
          'a.label.label-info, a.label.label-default',
        ) as HTMLAnchorElement | null;
        const meetURL = meetLink?.href || '';

        const online =
          cell.querySelector('.online-indicator') ||
          cell.textContent?.toLowerCase().includes('online');

        const date = dateHeaders[j - 1] || '';
        const [day, month] = date.split('/');
        const [startHour, startMinute, endHour, endMinute] =
          time.split(/[-:]/) || [];

        if (
          !currentYear ||
          !day ||
          !month ||
          !startHour ||
          !startMinute ||
          !endHour ||
          !endMinute
        ) {
          continue;
        }

        const startTime = new Date(
          Number(currentYear),
          Number(month) - 1,
          Number(day),
          Number(startHour),
          Number(startMinute)
        );

        const endTime = new Date(
          Number(currentYear),
          Number(month) - 1,
          Number(day),
          Number(endHour),
          Number(endMinute)
        );

        if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) {
          continue;
        }

        shifts[i - 2][j - 1] = {
          activityId: parseInt(activityId || '0'),
          courseName: courseName || '',
          room: room || '',
          time: time || '',
          dateTime: {
            start: startTime.toISOString(),
            end: endTime.toISOString(),
          },
          materialURL: syllabusURL,
          meetingURL: meetURL,
          status: status,
          online: Boolean(online),
        };
      } catch (error) {
        console.error('Error processing cell:', error);
      }
    }
  }
  return shifts;
}

// Option type for select elements
export interface SelectOption {
  value: string;
  label: string;
  selected: boolean;
}

export const useScheduleOfWeek = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setData } = useFapData();

  const {
    shifts,
    days,
    yearOptions,
    weekOptions,
    viewStateValue,
    viewStateGeneratorValue,
    eventValidationValue,
    currentWeekValue,
  } = useFapDataCustom({
    shifts: (original) => {
      if (!original) return [];
      return convertToScheduler(original);
    },
    days: (original) => {
      if (!original) return [];
      const table = original?.querySelectorAll('table')[2] as HTMLTableElement;
      return Array.from(table.rows[1].cells)
        .slice(0) // Skip the first cell which is "SLOT"
        .map((cell) => {
          let text = cell.textContent?.trim() || '';
          // Remove "Powered by Greenwich" and "CMS" text
          text = text.replace(/©\s*Powered by Greenwich[^|]*\|?\s*CMS?/gi, '').trim();
          return text;
        });
    },
    yearOptions: (original) => {
      if (!original) return [];
      const year = original?.querySelector(
        '#ctl00_mainContent_drpYear'
      ) as HTMLSelectElement;
      if (!year) return [];
      return Array.from(year.options)
        .map((option) => ({
          value: option.value?.trim() || '',
          label: option.text?.trim(),
          selected: option.selected,
        }))
        .filter((option) => option.value !== '');
    },
    weekOptions: (original) => {
      if (!original) return [];
      const week = original?.querySelector(
        '#ctl00_mainContent_drpSelectWeek'
      ) as HTMLSelectElement;
      if (!week) return [];
      return Array.from(week.options)
        .map((option) => ({
          value: option.value?.trim() || '',
          label: option.text?.trim()?.replace('To', '-'),
          selected: option.selected,
        }))
        .filter((option) => option.value !== '');
    },
    currentWeekValue: (original) => {
      if (!original) return '0';
      const week = original?.querySelector(
        '#ctl00_mainContent_drpSelectWeek'
      ) as HTMLSelectElement;
      if (!week) return '0';
      const currentWeekValue = Array.from(week.options)
        .map((option) => option.value?.trim() || '')
        .find((value, index) => week.options[index].selected && value !== '');
      return currentWeekValue ? currentWeekValue : '1';
    },
    viewStateValue: (original) => {
      const viewState = original?.querySelector(
        '#__VIEWSTATE'
      ) as HTMLInputElement;
      return viewState ? viewState.value : '';
    },
    viewStateGeneratorValue: (original) => {
      const viewStateGenerator = original?.querySelector(
        '#__VIEWSTATEGENERATOR'
      ) as HTMLInputElement;
      return viewStateGenerator ? viewStateGenerator.value : '';
    },
    eventValidationValue: (original) => {
      const eventValidation = original?.querySelector(
        '#__EVENTVALIDATION'
      ) as HTMLInputElement;
      return eventValidation ? eventValidation.value : '';
    },
  });

  const fetchScheduleData = async (year: string, week: string) => {
    if (!year || !week) return;

    setIsLoading(true);
    try {
      const response = await fetch('/Report/ScheduleOfWeek.aspx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          __EVENTTARGET: 'ctl00$mainContent$drpSelectWeek',
          __EVENTARGUMENT: '',
          __LASTFOCUS: '',
          __VIEWSTATE: viewStateValue,
          __VIEWSTATEGENERATOR: viewStateGeneratorValue,
          __EVENTVALIDATION: eventValidationValue,
          'ctl00$mainContent$drpYear': year,
          'ctl00$mainContent$drpSelectWeek': week,
        }).toString(),
      });

      const data = await response.text();
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(data, 'text/html');
      const container = htmlDoc.querySelector('.container') as Element;

      if (container) {
        setData(container);
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Extract future shifts for calendar import
  const futureShifts = shifts
    ?.flat()
    .filter((shift) => shift && new Date(shift.dateTime.start) > new Date())
    .map((shift) => shift as Shift);

  return {
    shifts,
    futureShifts,
    days,
    yearOptions,
    weekOptions,
    isLoading,
    fetchScheduleData,
    currentWeekValue,
  };
}; 