import { Thermometer, Wind, Droplets, Calendar } from 'lucide-react';

interface OverviewData {
  current_temperature: number;
  current_wind_speed: number;
  current_humidity: number;
  last_updated: string;
}

interface LocationData {
  city_name: string;
  state_name: string;
  country_name: string;
  timezone: string;
}

interface OverviewCardsProps {
  data: OverviewData;
  location: LocationData;
}

export function OverviewCards({ data, location }: OverviewCardsProps) {
  const cards = [
    {
      icon: Thermometer,
      label: 'Temperature',
      value: `${data.current_temperature}°C`,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
    {
      icon: Wind,
      label: 'Wind Speed',
      value: `${data.current_wind_speed} km/h`,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${data.current_humidity}%`,
      color: 'bg-cyan-500',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-700',
    },
    {
      icon: Calendar,
      label: 'Last Updated',
      value: new Date(data.last_updated).toLocaleString(),
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="sky-text">Current Conditions</h2>
        <span className="sky-text-muted text-sm">
          {location.state_name} · {location.country_name}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="sky-panel rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="sky-text-muted text-sm">{card.label}</p>
                <p className={`sky-text ${index === 3 ? 'text-sm' : ''}`}>
                  {card.value}
                </p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
