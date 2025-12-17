import React, { useEffect, useState, useRef } from 'react';
import { useTracksStore } from '../../../stores/tracks.store';
import { favoritesController } from '../../../controllers/Favorites.controller';
import { tracksController } from '../../../controllers/Tracks.controller';
import { TracksTable } from '../TracksPage/components/TracksTable/TracksTable';
import { Pagination } from '../../components/ui/Pagination/Pagination';
import './FavoritesPage.css';

export const FavoritesPage: React.FC = () => {
  const { favorites, isLoading } = useTracksStore();
  const [displayedFavorites, setDisplayedFavorites] = useState<typeof favorites>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  const itemsPerPage = 20;
  const observerTarget = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    favoritesController.loadFavorites();
  }, []);

  // Для десктопа - обычная пагинация
  useEffect(() => {
    if (!isMobile) {
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const displayed = favorites.slice(start, end);
      setDisplayedFavorites(displayed);
    }
  }, [favorites, currentPage, isMobile]);

  // Для мобильных - infinite scroll
  useEffect(() => {
    if (isMobile) {
      setDisplayedFavorites(favorites.slice(0, visibleCount));
    }
  }, [favorites, visibleCount, isMobile]);

  // Intersection Observer для infinite scroll на мобильных
  useEffect(() => {
    if (!isMobile || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < favorites.length) {
          setVisibleCount((prev) => Math.min(prev + 20, favorites.length));
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [isMobile, isLoading, visibleCount, favorites.length]);

  // Прокрутка к пагинации при смене страницы (только для десктопа)
  useEffect(() => {
    if (!isMobile && paginationRef.current) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (paginationRef.current) {
            paginationRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'end'
            });
          }
        });
      });
    }
  }, [currentPage, isMobile]);

  const totalPages = Math.ceil(favorites.length / itemsPerPage);

  const handlePlay = (trackId: string) => {
    const playlist = favorites.map((t) => t.id);
    tracksController.playTrack(trackId, playlist);
  };

  const handleToggleFavorite = async (trackId: string, isFavorite: boolean) => {
    await favoritesController.toggleFavorite(trackId, isFavorite);
  };

  if (isLoading) {
    return (
      <div className="favorites-page">
        <div className="favorites-page__loading">Загрузка избранного...</div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="favorites-page">
        <h1 className="favorites-page__title">Избранное</h1>
        <div className="favorites-page__empty">
          <p>У вас пока нет избранных треков</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <h1 className="favorites-page__title">Избранное</h1>
      <TracksTable
        tracks={displayedFavorites}
        currentPage={currentPage}
        onPlay={handlePlay}
        onToggleFavorite={handleToggleFavorite}
      />
      {/* Infinite scroll trigger для мобильных */}
      {isMobile && visibleCount < favorites.length && (
        <div ref={observerTarget} className="favorites-page__loader">
          <div className="favorites-page__loading">Загрузка...</div>
        </div>
      )}
      {/* Пагинация только для десктопа */}
      {!isMobile && totalPages > 1 && (
        <div ref={paginationRef} className="favorites-page__pagination-wrapper">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

