export interface Location {
  id: string;
  latitude: number;
  longitude: number;
  city_name: string;
  state_name: string;
  country_name: string;
  timezone: string;
}

interface DailyRow {
  state: string;
  date: string;
  avg_temp: number;
  min_temp: number;
  max_temp: number;
  avg_wind: number;
  min_wind: number;
  max_wind: number;
  avg_humidity: number;
  min_humidity: number;
  max_humidity: number;
}

interface WeeklyRow extends DailyRow {}

interface MonthlyRow {
  state: string;
  year: number;
  month: number;
  avg_temp: number;
  min_temp: number;
  max_temp: number;
  avg_wind: number;
  min_wind: number;
  max_wind: number;
  avg_humidity: number;
  min_humidity: number;
  max_humidity: number;
}

interface YearlyRow {
  state: string;
  year: number;
  avg_temp: number;
  min_temp: number;
  max_temp: number;
  avg_wind: number;
  min_wind: number;
  max_wind: number;
  avg_humidity: number;
  min_humidity: number;
  max_humidity: number;
}

function parseCsv<T>(raw: string, mapRow: (row: Record<string, string>) => T): T[] {
  const lines = raw.trim().split(/\r?\n/);
  if (lines.length <= 1) {
    return [];
  }
  const headers = lines[0].split(',').map(header => header.trim());
  return lines.slice(1).map(line => {
    const values = line.split(',').map(value => value.trim());
    const row = headers.reduce<Record<string, string>>((acc, header, index) => {
      acc[header] = values[index] ?? '';
      return acc;
    }, {});
    return mapRow(row);
  });
}

const toNumber = (value: string) => Number(value);
const round2 = (value: number) => Number(value.toFixed(2));
const toIsoDate = (value: string) => new Date(`${value}T00:00:00Z`).toISOString();
const mean = (values: number[]) => values.reduce((total, value) => total + value, 0) / values.length;
const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
const timezoneOffsets: Record<string, number> = {
  'America/Chicago': -360,
  'America/New_York': -300,
};

const pad2 = (value: number) => String(value).padStart(2, '0');
const formatOffset = (offsetMinutes: number) => {
  const sign = offsetMinutes <= 0 ? '-' : '+';
  const absMinutes = Math.abs(offsetMinutes);
  const hours = Math.floor(absMinutes / 60);
  const minutes = absMinutes % 60;
  return `${sign}${pad2(hours)}:${pad2(minutes)}`;
};

function getLatestScheduleTimestamp(timeZone: string, now: Date) {
  const offsetMinutes = timezoneOffsets[timeZone] ?? -300;
  const targetMillis = now.getTime() + offsetMinutes * 60 * 1000;
  const targetDate = new Date(targetMillis);
  const year = targetDate.getUTCFullYear();
  const month = targetDate.getUTCMonth();
  const day = targetDate.getUTCDate();
  const hour = targetDate.getUTCHours();
  const scheduledHour = Math.floor(hour / 6) * 6;
  const scheduledTarget = new Date(Date.UTC(year, month, day, scheduledHour, 0, 0));
  return `${scheduledTarget.getUTCFullYear()}-${pad2(scheduledTarget.getUTCMonth() + 1)}-${pad2(
    scheduledTarget.getUTCDate(),
  )}T${pad2(scheduledHour)}:00:00${formatOffset(offsetMinutes)}`;
}

const timezoneByState: Record<string, string> = {
  Missouri: 'America/Chicago',
};

const DEFAULT_BLOB_BASE_URL = 'https://mewmco8dma0rlvkg.public.blob.vercel-storage.com';
const BLOB_BASE_URL = (
  import.meta.env.VITE_BLOB_BASE_URL || DEFAULT_BLOB_BASE_URL
).replace(/\/+$/, '');

const DATASET_PATHS = {
  daily: 'gold/daily_state_weather.csv',
  weekly: 'gold/weekly_state_weather.csv',
  monthly: 'gold/monthly_state_weather.csv',
  yearly: 'gold/yearly_state_weather.csv',
};

async function fetchCsv(path: string) {
  const url = `${BLOB_BASE_URL}/${path}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path} (${response.status})`);
  }
  return response.text();
}

type MockDataResult = {
  locations: Location[];
  getDataForLocation: (locationId: string) => {
    location: {
      city_name: string;
      state_name: string;
      country_name: string;
      timezone: string;
    };
    overview: {
      current_temperature: number;
      current_wind_speed: number;
      current_humidity: number;
      last_updated: string;
    };
    hourly: Array<{
      timestamp: string;
      temperature_2m: number;
      wind_speed_10m: number;
      relative_humidity_2m: number;
      is_forecast: boolean;
    }>;
    monthly: Array<{
      year: number;
      month: number;
      avg_temperature_2m: number;
      max_temperature_2m: number;
      min_temperature_2m: number;
      avg_wind_speed_10m: number;
      avg_relative_humidity_2m: number;
    }>;
    yearly: Array<{
      year: number;
      avg_temperature_2m: number;
      avg_wind_speed_10m: number;
      avg_relative_humidity_2m: number;
    }>;
    summary: {
      overall_avg_temperature_2m: number;
      overall_max_temperature_2m: number;
      overall_min_temperature_2m: number;
      overall_avg_wind_speed_10m: number;
      overall_avg_relative_humidity_2m: number;
      record_start_date: string;
      record_end_date: string;
    };
    weekly: WeeklyRow[];
  };
};

export type MockData = MockDataResult;

function buildMockData(
  dailyRows: DailyRow[],
  weeklyRows: WeeklyRow[],
  monthlyRows: MonthlyRow[],
  yearlyRows: YearlyRow[],
): MockDataResult {
  const stateNames = Array.from(new Set(dailyRows.map(row => row.state))).sort((a, b) =>
    a.localeCompare(b),
  );
  const stateById = new Map(stateNames.map(state => [slugify(state), state]));
  const mockLocations: Location[] = stateNames.map(state => ({
    id: slugify(state),
    latitude: 0,
    longitude: 0,
    city_name: '',
    state_name: state,
    country_name: 'United States',
    timezone: timezoneByState[state] ?? 'America/New_York',
  }));

  return {
    locations: mockLocations,
    getDataForLocation(locationId: string) {
      const stateName = stateById.get(locationId) ?? stateNames[0];
      const location = mockLocations.find(loc => loc.state_name === stateName) ?? mockLocations[0];
      const stateDaily = dailyRows
        .filter(row => row.state === stateName)
        .sort((a, b) => a.date.localeCompare(b.date));
      const stateMonthly = monthlyRows
        .filter(row => row.state === stateName)
        .sort((a, b) => (a.year === b.year ? a.month - b.month : a.year - b.year));
      const stateYearly = yearlyRows
        .filter(row => row.state === stateName)
        .sort((a, b) => a.year - b.year);

      const now = new Date();
      const dailySource = stateDaily.slice(-30);
      const hourlyData = dailySource.map(row => ({
        timestamp: toIsoDate(row.date),
        temperature_2m: round2(row.avg_temp),
        wind_speed_10m: round2(row.avg_wind),
        relative_humidity_2m: round2(row.avg_humidity),
        is_forecast: false,
      }));
      const latestDaily = dailySource[dailySource.length - 1] ?? stateDaily[stateDaily.length - 1];

      const hourlyDataFallback = Array.from({ length: 30 }, (_, index) => {
        const timestamp = new Date(now.getTime() - (29 - index) * 24 * 60 * 60 * 1000);
        return {
          timestamp: timestamp.toISOString(),
          temperature_2m: round2(latestDaily?.avg_temp ?? 0),
          wind_speed_10m: round2(latestDaily?.avg_wind ?? 0),
          relative_humidity_2m: round2(latestDaily?.avg_humidity ?? 0),
          is_forecast: false,
        };
      });
      const hourly = hourlyData.length ? hourlyData : hourlyDataFallback;
      const recordStart = stateDaily[0]?.date ?? '';
      const recordEnd = stateDaily[stateDaily.length - 1]?.date ?? '';
      const yearlyTemps = stateYearly.map(row => row.avg_temp);
      const yearlyWinds = stateYearly.map(row => row.avg_wind);
      const yearlyHumidity = stateYearly.map(row => row.avg_humidity);
      const yearlyMaxTemps = stateYearly.map(row => row.max_temp);
      const yearlyMinTemps = stateYearly.map(row => row.min_temp);

      return {
        location: {
          city_name: location.city_name,
          state_name: location.state_name,
          country_name: location.country_name,
          timezone: location.timezone,
        },
        overview: {
          current_temperature: round2(latestDaily?.avg_temp ?? 0),
          current_wind_speed: round2(latestDaily?.avg_wind ?? 0),
          current_humidity: round2(latestDaily?.avg_humidity ?? 0),
          last_updated: getLatestScheduleTimestamp(location.timezone, now),
        },
        hourly,
        monthly: stateMonthly.map(row => ({
          year: row.year,
          month: row.month,
          avg_temperature_2m: round2(row.avg_temp),
          max_temperature_2m: round2(row.max_temp),
          min_temperature_2m: round2(row.min_temp),
          avg_wind_speed_10m: round2(row.avg_wind),
          avg_relative_humidity_2m: round2(row.avg_humidity),
        })),
        yearly: stateYearly.map(row => ({
          year: row.year,
          avg_temperature_2m: round2(row.avg_temp),
          avg_wind_speed_10m: round2(row.avg_wind),
          avg_relative_humidity_2m: round2(row.avg_humidity),
        })),
        summary: {
          overall_avg_temperature_2m: yearlyTemps.length ? round2(mean(yearlyTemps)) : 0,
          overall_max_temperature_2m: yearlyMaxTemps.length
            ? round2(Math.max(...yearlyMaxTemps))
            : 0,
          overall_min_temperature_2m: yearlyMinTemps.length
            ? round2(Math.min(...yearlyMinTemps))
            : 0,
          overall_avg_wind_speed_10m: yearlyWinds.length ? round2(mean(yearlyWinds)) : 0,
          overall_avg_relative_humidity_2m: yearlyHumidity.length
            ? round2(mean(yearlyHumidity))
            : 0,
          record_start_date: recordStart,
          record_end_date: recordEnd,
        },
        weekly: weeklyRows.filter(row => row.state === stateName),
      };
    },
  };
}

let mockDataPromise: Promise<MockDataResult> | null = null;

export function loadMockData(): Promise<MockDataResult> {
  if (!mockDataPromise) {
    mockDataPromise = (async () => {
      const [dailyCsv, weeklyCsv, monthlyCsv, yearlyCsv] = await Promise.all([
        fetchCsv(DATASET_PATHS.daily),
        fetchCsv(DATASET_PATHS.weekly),
        fetchCsv(DATASET_PATHS.monthly),
        fetchCsv(DATASET_PATHS.yearly),
      ]);

      const dailyRows = parseCsv<DailyRow>(dailyCsv, row => ({
        state: row.state,
        date: row.date,
        avg_temp: toNumber(row.avg_temp),
        min_temp: toNumber(row.min_temp),
        max_temp: toNumber(row.max_temp),
        avg_wind: toNumber(row.avg_wind),
        min_wind: toNumber(row.min_wind),
        max_wind: toNumber(row.max_wind),
        avg_humidity: toNumber(row.avg_humidity),
        min_humidity: toNumber(row.min_humidity),
        max_humidity: toNumber(row.max_humidity),
      }));

      const weeklyRows = parseCsv<WeeklyRow>(weeklyCsv, row => ({
        state: row.state,
        date: row.date,
        avg_temp: toNumber(row.avg_temp),
        min_temp: toNumber(row.min_temp),
        max_temp: toNumber(row.max_temp),
        avg_wind: toNumber(row.avg_wind),
        min_wind: toNumber(row.min_wind),
        max_wind: toNumber(row.max_wind),
        avg_humidity: toNumber(row.avg_humidity),
        min_humidity: toNumber(row.min_humidity),
        max_humidity: toNumber(row.max_humidity),
      }));

      const monthlyRows = parseCsv<MonthlyRow>(monthlyCsv, row => ({
        state: row.state,
        year: toNumber(row.year),
        month: toNumber(row.month),
        avg_temp: toNumber(row.avg_temp),
        min_temp: toNumber(row.min_temp),
        max_temp: toNumber(row.max_temp),
        avg_wind: toNumber(row.avg_wind),
        min_wind: toNumber(row.min_wind),
        max_wind: toNumber(row.max_wind),
        avg_humidity: toNumber(row.avg_humidity),
        min_humidity: toNumber(row.min_humidity),
        max_humidity: toNumber(row.max_humidity),
      }));

      const yearlyRows = parseCsv<YearlyRow>(yearlyCsv, row => ({
        state: row.state,
        year: toNumber(row.year),
        avg_temp: toNumber(row.avg_temp),
        min_temp: toNumber(row.min_temp),
        max_temp: toNumber(row.max_temp),
        avg_wind: toNumber(row.avg_wind),
        min_wind: toNumber(row.min_wind),
        max_wind: toNumber(row.max_wind),
        avg_humidity: toNumber(row.avg_humidity),
        min_humidity: toNumber(row.min_humidity),
        max_humidity: toNumber(row.max_humidity),
      }));

      return buildMockData(dailyRows, weeklyRows, monthlyRows, yearlyRows);
    })();
  }

  return mockDataPromise;
}
