import React, { useState, useMemo } from 'react';
import { Search, Filter, X, Calendar, User, Film, Package, FileText, Theater, Palette, Globe } from 'lucide-react';
import { archiveData } from './archiveData';

const translations = {
  en: {
    title: 'Presence Archive',
    references: 'reference',
    references_plural: 'references',
    searchPlaceholder: 'Search by title, artist or description...',
    allMediums: 'All mediums',
    allTypes: 'All types',
    reset: 'Reset',
    noResults: 'No references found',
    tryModifying: 'Try modifying your filters or search',
    creator: 'Creator',
    year: 'Year',
    medium: 'Medium',
    presenceType: 'Presence Type',
  },
  fr: {
    title: 'Archive Présence',
    references: 'référence',
    references_plural: 'références',
    searchPlaceholder: 'Rechercher par titre, artiste ou description...',
    allMediums: 'Tous les médiums',
    allTypes: 'Tous les types',
    reset: 'Réinitialiser',
    noResults: 'Aucune référence trouvée',
    tryModifying: 'Essayez de modifier vos filtres ou votre recherche',
    creator: 'Créateur',
    year: 'Année',
    medium: 'Médium',
    presenceType: 'Type de présence',
  }
};

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedium, setSelectedMedium] = useState('all');
  const [selectedPresenceType, setSelectedPresenceType] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [language, setLanguage] = useState('fr');

  const t = translations[language];

  const mediums = useMemo(() => {
    const types = new Set(archiveData.map(item => item.medium));
    return ['all', ...Array.from(types)];
  }, []);

  const presenceTypes = useMemo(() => {
    const types = new Set();
    archiveData.forEach(item => {
      if (typeof item.presenceType === 'string') {
        item.presenceType.split(',').forEach(type => types.add(type.trim()));
      }
    });
    return ['all', ...Array.from(types)];
  }, []);

  const filteredItems = useMemo(() => {
    return archiveData.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesMedium = selectedMedium === 'all' || item.medium === selectedMedium;
      
      const matchesPresence = selectedPresenceType === 'all' || 
        (typeof item.presenceType === 'string' && 
         item.presenceType.split(',').some(type => type.trim() === selectedPresenceType));
      
      return matchesSearch && matchesMedium && matchesPresence;
    });
  }, [searchQuery, selectedMedium, selectedPresenceType]);

  const getMediumIcon = (medium) => {
    const icons = {
      'installation': <Palette className="w-4 h-4" />,
      'object': <Package className="w-4 h-4" />,
      'movie': <Film className="w-4 h-4" />,
      'theater': <Theater className="w-4 h-4" />,
      'article': <FileText className="w-4 h-4" />
    };
    return icons[medium] || <Package className="w-4 h-4" />;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/90 border-b border-white/20">
        <div className="container mx-auto max-w-screen-2xl px-6 lg:px-12 py-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-white">
              {t.title}
            </h1>
            <div className="flex items-center gap-6">
              <div className="text-sm text-gray-400">
                {filteredItems.length} {filteredItems.length === 1 ? t.references : t.references_plural}
              </div>
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/20 hover:bg-white/10 text-white transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">{language === 'en' ? 'FR' : 'EN'}</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              {/* Medium Filter */}
              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={selectedMedium}
                  onChange={(e) => setSelectedMedium(e.target.value)}
                  className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {mediums.map(medium => (
                    <option key={medium} value={medium} className="bg-black">
                      {medium === 'all' ? t.allMediums : medium}
                    </option>
                  ))}
                </select>
              </div>

              {/* Presence Type Filter */}
              <select
                value={selectedPresenceType}
                onChange={(e) => setSelectedPresenceType(e.target.value)}
                className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                {presenceTypes.map(type => (
                  <option key={type} value={type} className="bg-black">
                    {type === 'all' ? t.allTypes : type}
                  </option>
                ))}
              </select>

              {/* Clear Filters */}
              {(selectedMedium !== 'all' || selectedPresenceType !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedMedium('all');
                    setSelectedPresenceType('all');
                    setSearchQuery('');
                  }}
                  className="text-sm text-white hover:text-gray-300 underline px-4"
                >
                  {t.reset}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Grid - PROPERLY CENTERED */}
      <main className="container mx-auto max-w-screen-2xl px-6 lg:px-12 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-items-center">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group cursor-pointer w-full max-w-[250px]"
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-900 border border-white/20 hover:border-white transition-all duration-300">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add('bg-gray-800');
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      {getMediumIcon(item.medium)}
                      <span className="capitalize">{item.medium}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-gray-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-1">{item.creator}</p>
                <p className="text-xs text-gray-500">{item.year}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{t.noResults}</h3>
            <p className="text-gray-400">{t.tryModifying}</p>
          </div>
        )}
      </main>

      {/* Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] overflow-y-auto bg-black rounded-lg border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/80 text-white hover:bg-white hover:text-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid md:grid-cols-2 gap-8 p-8">
              {/* Image */}
              <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-900">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add('bg-gray-800');
                  }}
                />
              </div>

              {/* Details */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-3">{selectedItem.title}</h2>
                  <div className="flex items-center gap-6 text-gray-400">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{selectedItem.creator}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{selectedItem.year}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getMediumIcon(selectedItem.medium)}
                  <span className="text-sm text-gray-300 capitalize">{selectedItem.medium}</span>
                </div>

                {selectedItem.presenceType && (
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.presenceType.split(',').map((type, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-white/10 text-white text-xs border border-white/30"
                      >
                        {type.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t border-white/20">
                  <p className="text-gray-300 leading-relaxed">{selectedItem.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;