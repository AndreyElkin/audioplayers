import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../../../stores/auth.store';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
}

type AuthMode = 'login' | 'register';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen }) => {
  const { login, register, isLoading, error, isAuthenticated } = useAuthStore();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (isOpen && !isAuthenticated) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isAuthenticated]);

  // Очистка полей после успешной авторизации
  useEffect(() => {
    if (isAuthenticated) {
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      useAuthStore.getState().clearError();
    }
  }, [isAuthenticated]);

  // Сброс формы при смене режима
  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    useAuthStore.getState().clearError();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return;
    }
    await register(username, password);
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (mode === 'login') {
      handleLoginSubmit(e);
    } else {
      handleRegisterSubmit(e);
    }
  };

  if (!isOpen || isAuthenticated) return null;

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <h2 className="auth-modal-title">
            {mode === 'login' ? 'Вход' : 'Регистрация'}
          </h2>
        </div>
        <div className="auth-modal-body">
          <form onSubmit={handleSubmit} className="auth-modal-form">
            <Input
              label="Имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
            <Input
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
            {mode === 'register' && (
              <Input
                label="Подтвердите пароль"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                error={
                  password && confirmPassword && password !== confirmPassword
                    ? 'Пароли не совпадают'
                    : undefined
                }
              />
            )}
            {error && <div className="auth-modal-error">{error}</div>}
            <Button type="submit" disabled={isLoading} className="auth-modal-button">
              {isLoading
                ? mode === 'login'
                  ? 'Вход...'
                  : 'Регистрация...'
                : mode === 'login'
                  ? 'Войти'
                  : 'Зарегистрироваться'}
            </Button>
            <p className="auth-modal-link">
              {mode === 'login' ? (
                <>
                  Нет аккаунта?{' '}
                  <button
                    type="button"
                    onClick={() => handleModeChange('register')}
                    className="auth-modal-link-button"
                  >
                    Зарегистрироваться
                  </button>
                </>
              ) : (
                <>
                  Уже есть аккаунт?{' '}
                  <button
                    type="button"
                    onClick={() => handleModeChange('login')}
                    className="auth-modal-link-button"
                  >
                    Войти
                  </button>
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
