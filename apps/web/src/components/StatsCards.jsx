import React from 'react';
import { MapPin, Tag, Activity, Clock } from 'lucide-react';
import { getTagStatus } from '../hooks/useTagLocations';

function StatsCards({ places, devices }) {
  // Calcular tags por status
  const activeTags = devices.filter(device => getTagStatus(device.last_read) === 'active').length;
  const inactiveTags = devices.filter(device => getTagStatus(device.last_read) === 'inactive').length;
  const neverUsedTags = devices.filter(device => getTagStatus(device.last_read) === 'never_used').length;

  const stats = [
    {
      title: 'Total Places',
      value: places.length,
      icon: MapPin,
      color: 'bg-[rgb(93,191,78)]',
      description: 'Locais cadastrados'
    },
    {
      title: 'Tags Ativas',
      value: activeTags,
      icon: Tag,
      color: 'bg-[rgb(93,191,78)]',
      description: `${inactiveTags} inativa${inactiveTags !== 1 ? 's' : ''} | ${neverUsedTags} não usada${neverUsedTags !== 1 ? 's' : ''} | ${devices.length} total`,
      showBadge: inactiveTags > 0,
      badgeValue: inactiveTags
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
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-sm font-cool text-gray-400">
                    {stat.title}
                  </p>
                  {stat.showBadge && (
                    <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/30 rounded-full text-xs text-red-400">
                      {stat.badgeValue} inativa{stat.badgeValue !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-white">
                  {stat.value}{stat.suffix || ''}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {stat.description}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg flex-shrink-0`}>
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