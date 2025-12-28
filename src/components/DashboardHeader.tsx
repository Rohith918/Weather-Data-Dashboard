import { Cloud, MapPin } from 'lucide-react';

interface Location {
  id: string;
  city_name: string;
  state_name: string;
  country_name: string;
}

interface DashboardHeaderProps {
  locations: Location[];
  selectedLocation: string;
  onLocationChange: (locationId: string) => void;
}

export function DashboardHeader({ locations, selectedLocation, onLocationChange }: DashboardHeaderProps) {
  return (
    <header className="sky-header shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Cloud className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="sky-text">Weather Analytics Dashboard</h1>
              <p className="sky-text-muted text-sm">Real-time weather monitoring and insights</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sky-panel-muted rounded-lg px-4 py-2">
            <MapPin className="w-5 h-5 sky-text-muted" />
            <select
              value={selectedLocation}
              onChange={(e) => onLocationChange(e.target.value)}
              className="bg-transparent border-none outline-none cursor-pointer sky-text"
            >
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.city_name ? `${location.city_name}, ` : ''}
                  {location.state_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
