import React, { useEffect, useState, useRef } from 'react';
import { useTracksStore } from '../../../stores/tracks.store';
import { tracksController } from '../../../controllers/Tracks.controller';
import { TracksTable } from './components/TracksTable/TracksTable';
import { Pagination } from '../../components/ui/Pagination/Pagination';
import './TracksPage.css';

export const TracksPage: React.FC = () => {
  const { tracks, isLoading, currentPage, totalPages, setPage } = useTracksStore();
  const [displayedTracks, setDisplayedTracks] = useState<typeof tracks>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
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
    tracksController.loadTracks();
  }, []);

  // Для десктопа - обычная пагинация
  useEffect(() => {
    if (!isMobile) {
      const itemsPerPage = 20;
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      setDisplayedTracks(tracks.slice(start, end));
    }
  }, [tracks, currentPage, isMobile]);

  // Для мобильных - infinite scroll
  useEffect(() => {
    if (isMobile) {
      setDisplayedTracks(tracks.slice(0, visibleCount));
    }
  }, [tracks, visibleCount, isMobile]);

  // Intersection Observer для infinite scroll на мобильных
  useEffect(() => {
    if (!isMobile || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < tracks.length) {
          setVisibleCount((prev) => Math.min(prev + 20, tracks.length));
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
  }, [isMobile, isLoading, visibleCount, tracks.length]);

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

  const handlePlay = async (trackId: string) => {
    const playlist = tracks.map((t: typeof tracks[0]) => t.id);
    try {
      await tracksController.playTrack(trackId, playlist);
    } catch (error) {
      console.error('[TracksPage] Error playing track:', error);
    }
  };

  const handleToggleFavorite = async (trackId: string, isFavorite: boolean) => {
    await tracksController.toggleFavorite(trackId, isFavorite);
  };

  if (isLoading) {
    return (
      <div className="tracks-page">
        <div className="tracks-page__loading">Загрузка треков...</div>
      </div>
    );
  }

  return (
    <div className="tracks-page">
      <h1 className="tracks-page__title">Аудифайлы и треки</h1>
      <TracksTable
        tracks={displayedTracks}
        currentPage={currentPage}
        onPlay={handlePlay}
        onToggleFavorite={handleToggleFavorite}
      />
      {/* Infinite scroll trigger для мобильных */}
      {isMobile && visibleCount < tracks.length && (
        <div ref={observerTarget} className="tracks-page__loader">
          <div className="tracks-page__loading">Загрузка...</div>
        </div>
      )}
      {/* Пагинация только для десктопа */}
      {!isMobile && totalPages > 1 && (
        <div ref={paginationRef} className="tracks-page__pagination-wrapper">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

