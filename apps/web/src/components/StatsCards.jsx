import React from 'react';
import { MapPin, Tag, Activity, Clock } from 'lucide-react';

function StatsCards({ places, devices }) {
  const stats = [
    {
      title: 'Total Places',
      value: places.length,
      icon: MapPin,
      color: 'bg-[rgb(93,191,78)]',
      description: 'Locais cadastrados'
    },
    {
      title: 'Total Tags',
      value: devices.length,
      icon: Tag,
      color: 'bg-[rgb(93,191,78)]',
      description: 'Dispositivos ativos'
    },
    {
      title: 'Área Total',
      value: places.reduce((acc, place) => acc + (place.width * place.height), 0).toFixed(1),
      icon: Activity,
      color: 'bg-[rgb(93,191,78)]',
      description: 'm² monitorados',
      suffix: 'm²'
    },
    {
      title: 'Última Atualização',
      value: new Date().toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      icon: Clock,
      color: 'bg-[rgb(93,191,78)]',
      description: 'Dados sincronizados'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 hover:bg-white/15 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-cool text-gray-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-white">
                  {stat.value}{stat.suffix || ''}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {stat.description}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsCards;