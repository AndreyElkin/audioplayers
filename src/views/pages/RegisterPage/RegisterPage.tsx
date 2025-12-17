import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/auth.store';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import './RegisterPage.css';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return;
    }
    await register(username, password);
    if (useAuthStore.getState().isAuthenticated) {
      navigate('/tracks');
    }
  };

  return (
    <div className="register-page">
      <div className="register-page__container">
        <h1 className="register-page__title">Регистрация в VibeCast Studio</h1>
        <form onSubmit={handleSubmit} className="register-page__form">
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
            autoComplete="new-password"
          />
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
          {error && <div className="register-page__error">{error}</div>}
          <Button type="submit" disabled={isLoading} className="register-page__button">
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
          <p className="register-page__link">
            Уже есть аккаунт?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="register-page__link-button"
            >
              Войти
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

