import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface YearlyDataPoint {
  year: number;
  avg_temperature_2m: number;
  avg_wind_speed_10m: number;
  avg_relative_humidity_2m: number;
}

interface YearlyTrendsChartProps {
  data: YearlyDataPoint[];
}

export function YearlyTrendsChart({ data }: YearlyTrendsChartProps) {
  const chartData = data.map(point => ({
    year: point.year.toString(),
    'Avg Temperature': point.avg_temperature_2m,
    'Avg Wind Speed': point.avg_wind_speed_10m,
    'Avg Humidity': point.avg_relative_humidity_2m,
  }));

  return (
    <div className="sky-panel rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 sky-text-muted" />
        <h2 className="sky-text">Yearly Trends</h2>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--sky-panel-border)" />
          <XAxis 
            dataKey="year" 
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
            dataKey="Avg Temperature" 
            stroke="#f97316" 
            strokeWidth={3}
            dot={{ fill: '#f97316', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="Avg Wind Speed" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="Avg Humidity" 
            stroke="#06b6d4" 
            strokeWidth={3}
            dot={{ fill: '#06b6d4', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
