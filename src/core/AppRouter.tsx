import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TracksPage } from '../views/pages/TracksPage/TracksPage';
import { FavoritesPage } from '../views/pages/FavoritesPage/FavoritesPage';
import { MainLayout } from '../views/layouts/MainLayout/MainLayout';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Всегда рендерим контент, модальное окно заблокирует доступ если нет авторизации
  return children;
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <TracksPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tracks"
          element={
            <ProtectedRoute>
              <MainLayout>
                <TracksPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <MainLayout>
                <FavoritesPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

