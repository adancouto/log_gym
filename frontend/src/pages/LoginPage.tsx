import { useState } from 'react';
import { getErrorMessage, login, register } from '../services/api';

interface LoginPageProps {
  onAuthenticated: (token: string) => void;
}

function LoginPage({ onAuthenticated }: LoginPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function changeMode(nextMode: 'login' | 'register') {
    setMode(nextMode);
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'register') {
        await register(name.trim(), email.trim(), password);
      }

      const data = await login(email.trim(), password);
      onAuthenticated(data.token);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-intro" aria-label="Apresentacao">
        <div className="brand-mark">L</div>
        <p className="eyebrow">LOG WORKOUT</p>
        <h1>Seu treino, com progresso que da para ver.</h1>
        <p>
          Organize suas rotinas, registre cargas e acompanhe cada repeticao em um so lugar.
        </p>
        <div className="intro-stat">
          <strong>Consistencia vence.</strong>
          <span>Um treino registrado por vez.</span>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-heading">
            <p className="eyebrow">BEM-VINDO</p>
            <h2>{mode === 'login' ? 'Entre na sua conta' : 'Crie sua conta'}</h2>
            <p>
              {mode === 'login'
                ? 'Continue de onde parou.'
                : 'Comece a montar suas rotinas agora.'}
            </p>
          </div>

          <div className="auth-tabs" aria-label="Escolha entre entrar ou cadastrar">
            <button
              className={mode === 'login' ? 'active' : ''}
              type="button"
              onClick={() => changeMode('login')}
            >
              Entrar
            </button>
            <button
              className={mode === 'register' ? 'active' : ''}
              type="button"
              onClick={() => changeMode('register')}
            >
              Cadastrar
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <label>
                Nome
                <input
                  autoComplete="name"
                  minLength={2}
                  placeholder="Como podemos te chamar?"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
            )}

            <label>
              Email
              <input
                autoComplete="email"
                placeholder="voce@email.com"
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label>
              Senha
              <input
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                minLength={6}
                placeholder="Minimo de 6 caracteres"
                required
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>

            {error && <p className="form-message error-message" role="alert">{error}</p>}

            <button className="primary-button auth-submit" disabled={loading} type="submit">
              {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
