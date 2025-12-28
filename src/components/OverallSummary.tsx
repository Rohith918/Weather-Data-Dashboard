import { BarChart3, TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface SummaryData {
  overall_avg_temperature_2m: number;
  overall_max_temperature_2m: number;
  overall_min_temperature_2m: number;
  overall_avg_wind_speed_10m: number;
  overall_avg_relative_humidity_2m: number;
  record_start_date: string;
  record_end_date: string;
}

interface OverallSummaryProps {
  data: SummaryData;
}

export function OverallSummary({ data }: OverallSummaryProps) {
  const stats = [
    {
      label: 'Average Temperature',
      value: `${data.overall_avg_temperature_2m}°C`,
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      label: 'Maximum Temperature',
      value: `${data.overall_max_temperature_2m}°C`,
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      label: 'Minimum Temperature',
      value: `${data.overall_min_temperature_2m}°C`,
      icon: TrendingDown,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Average Wind Speed',
      value: `${data.overall_avg_wind_speed_10m} km/h`,
      icon: Activity,
      color: 'text-sky-600',
      bgColor: 'bg-sky-100',
    },
    {
      label: 'Average Humidity',
      value: `${data.overall_avg_relative_humidity_2m}%`,
      icon: Activity,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
    },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="sky-panel rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 sky-text-muted" />
        <h2 className="sky-text">Overall Weather Summary</h2>
      </div>
      
      <div className="mb-6 p-4 sky-panel-accent rounded-lg">
        <p className="text-sm sky-text">
          <span>Data collected from </span>
          <span>{formatDate(data.record_start_date)}</span>
          <span> to </span>
          <span>{formatDate(data.record_end_date)}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="p-4 sky-panel-muted rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <p className="text-sm sky-text-muted mb-1">{stat.label}</p>
            <p className="sky-text">{stat.value}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 sky-panel-muted rounded-lg">
        <h3 className="sky-text mb-2">Summary Insights</h3>
        <ul className="space-y-2 text-sm sky-text">
          <li className="flex items-start gap-2">
            <span className="sky-text-muted mt-1">•</span>
            <span>
              Temperature range: {data.overall_min_temperature_2m}°C to {data.overall_max_temperature_2m}°C 
              (Δ {(data.overall_max_temperature_2m - data.overall_min_temperature_2m).toFixed(1)}°C)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="sky-text-muted mt-1">•</span>
            <span>
              Average conditions: {data.overall_avg_temperature_2m}°C with {data.overall_avg_relative_humidity_2m}% humidity
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="sky-text-muted mt-1">•</span>
            <span>
              Wind conditions typically around {data.overall_avg_wind_speed_10m} km/h
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
