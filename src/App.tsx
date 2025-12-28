import { useEffect, useState } from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import { OverviewCards } from './components/OverviewCards';
import { HourlyWeatherChart } from './components/HourlyWeatherChart';
import { MonthlyTrendsChart } from './components/MonthlyTrendsChart';
import { YearlyTrendsChart } from './components/YearlyTrendsChart';
import { OverallSummary } from './components/OverallSummary';
import { loadMockData, type MockData } from './data/mockData';

export default function App() {
  const [mockData, setMockData] = useState<MockData | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [skyMode, setSkyMode] = useState<'day' | 'night'>(() => {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18 ? 'day' : 'night';
  });

  useEffect(() => {
    let isMounted = true;

    loadMockData()
      .then(data => {
        if (!isMounted) {
          return;
        }
        setMockData(data);
        setSelectedLocation(prev => prev || data.locations[0]?.id || '');
      })
      .catch(error => {
        if (!isMounted) {
          return;
        }
        setLoadError(error instanceof Error ? error.message : 'Failed to load data.');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const updateSkyMode = () => {
      const hour = new Date().getHours();
      setSkyMode(hour >= 6 && hour < 18 ? 'day' : 'night');
    };

    const intervalId = window.setInterval(updateSkyMode, 5 * 60 * 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const skyClassName = `min-h-screen sky-theme sky-theme--${skyMode}`;
  const skyBackdrop = (
    <div className="sky-theme__backdrop" aria-hidden="true">
      <div className="sky-theme__stars" />
      <div className="sky-theme__haze" />
      <div className="sky-theme__sun" />
      <div className="sky-theme__moon" />
    </div>
  );

  if (loadError) {
    return (
      <div className={skyClassName}>
        {skyBackdrop}
        <div className="sky-theme__content flex items-center justify-center">
          <div className="sky-panel px-6 py-4 rounded-xl text-sm sky-text">
            Failed to load weather data: {loadError}
          </div>
        </div>
      </div>
    );
  }

  if (!mockData || !selectedLocation) {
    return (
      <div className={skyClassName}>
        {skyBackdrop}
        <div className="sky-theme__content flex items-center justify-center">
          <div className="sky-panel px-6 py-4 rounded-xl text-sm sky-text">
            Loading weather data...
          </div>
        </div>
      </div>
    );
  }

  const data = mockData.getDataForLocation(selectedLocation);

  return (
    <div className={skyClassName}>
      {skyBackdrop}
      <div className="sky-theme__content">
        <DashboardHeader 
          locations={mockData.locations}
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
        />
        
        <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          <OverviewCards data={data.overview} location={data.location} />
          
          <div className="grid grid-cols-1 gap-8">
            <HourlyWeatherChart data={data.hourly} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <MonthlyTrendsChart data={data.monthly} />
              <YearlyTrendsChart data={data.yearly} />
            </div>
            
            <OverallSummary data={data.summary} />
          </div>
        </main>
      </div>
    </div>
  );
}
