import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';

interface MonthlyDataPoint {
  year: number;
  month: number;
  avg_temperature_2m: number;
  max_temperature_2m: number;
  min_temperature_2m: number;
  avg_wind_speed_10m: number;
  avg_relative_humidity_2m: number;
}

interface MonthlyTrendsChartProps {
  data: MonthlyDataPoint[];
}

export function MonthlyTrendsChart({ data }: MonthlyTrendsChartProps) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const chartData = data.map(point => ({
    month: monthNames[point.month - 1],
    'Avg Temp': point.avg_temperature_2m,
    'Max Temp': point.max_temperature_2m,
    'Min Temp': point.min_temperature_2m,
  }));

  return (
    <div className="sky-panel rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 sky-text-muted" />
        <h2 className="sky-text">Monthly Temperature Trends</h2>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--sky-panel-border)" />
          <XAxis 
            dataKey="month" 
            stroke="var(--sky-text-muted)"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="var(--sky-text-muted)"
            style={{ fontSize: '12px' }}
            label={{
              value: 'Temperature (°C)',
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: '12px', fill: 'var(--sky-text-muted)' },
            }}
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
          <Bar dataKey="Max Temp" fill="#ef4444" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Avg Temp" fill="#f97316" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Min Temp" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
