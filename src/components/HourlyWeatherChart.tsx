import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Clock } from 'lucide-react';

interface HourlyDataPoint {
  timestamp: string;
  temperature_2m: number;
  wind_speed_10m: number;
  relative_humidity_2m: number;
  is_forecast: boolean;
}

interface HourlyWeatherChartProps {
  data: HourlyDataPoint[];
}

export function HourlyWeatherChart({ data }: HourlyWeatherChartProps) {
  const chartData = data.map(point => ({
    date: new Date(point.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
    }),
    Temperature: point.temperature_2m,
    'Wind Speed': point.wind_speed_10m,
    Humidity: point.relative_humidity_2m,
    forecast: point.is_forecast,
  }));

  return (
    <div className="sky-panel rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 sky-text-muted" />
        <h2 className="sky-text">Daily Weather Data</h2>
        <span className="text-sm sky-text-muted">(Last 30 days)</span>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--sky-panel-border)" />
          <XAxis 
            dataKey="date" 
            stroke="var(--sky-text-muted)"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="var(--sky-text-muted)"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--sky-panel-bg)',
              border: '1px solid var(--sky-panel-border)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              color: 'var(--sky-text)',
            }}
          />
          <Legend wrapperStyle={{ color: 'var(--sky-text)' }} />
          <Line 
            type="monotone" 
            dataKey="Temperature" 
            stroke="#f97316" 
            strokeWidth={2}
            dot={{ fill: '#f97316', r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line 
            type="monotone" 
            dataKey="Wind Speed" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line 
            type="monotone" 
            dataKey="Humidity" 
            stroke="#06b6d4" 
            strokeWidth={2}
            dot={{ fill: '#06b6d4', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 flex items-center gap-4 text-sm sky-text-muted">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span>Temperature (°C)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Wind Speed (km/h)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
          <span>Humidity (%)</span>
        </div>
      </div>
    </div>
  );
}
