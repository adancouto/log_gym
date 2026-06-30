import { useEffect, useMemo, useState } from 'react';
import {
  ApiRequestError,
  createExercise,
  createRoutine,
  getErrorMessage,
  getExercises,
  getMe,
  getRoutines,
  updateExercise,
} from '../services/api';
import type { Exercise, Routine, User } from '../types/Routine';

interface HomePageProps {
  onLogout: () => void;
}

interface ExerciseFormState {
  name: string;
  weight: string;
  reps: string;
}

const emptyExerciseForm: ExerciseFormState = {
  name: '',
  weight: '',
  reps: '',
};

function HomePage({ onLogout }: HomePageProps) {
  const [user, setUser] = useState<User | null>(null);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [selectedRoutineId, setSelectedRoutineId] = useState<number | null>(null);
  const [exercisesByRoutine, setExercisesByRoutine] = useState<Record<number, Exercise[]>>({});
  const [loading, setLoading] = useState(true);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  const [routineName, setRoutineName] = useState('');
  const [creatingRoutine, setCreatingRoutine] = useState(false);
  const [exerciseForm, setExerciseForm] = useState<ExerciseFormState>(emptyExerciseForm);
  const [creatingExercise, setCreatingExercise] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState<number | null>(null);
  const [editWeight, setEditWeight] = useState('');
  const [editReps, setEditReps] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [currentUser, routineList] = await Promise.all([getMe(), getRoutines()]);
        setUser(currentUser);
        setRoutines(routineList);

        if (routineList.length > 0) {
          setSelectedRoutineId(routineList[0].id);
          await loadExercises(routineList[0].id);
        }
      } catch (error) {
        handleRequestError(error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const selectedRoutine = useMemo(
    () => routines.find((routine) => routine.id === selectedRoutineId) ?? null,
    [routines, selectedRoutineId],
  );

  const selectedExercises = selectedRoutineId
    ? exercisesByRoutine[selectedRoutineId] ?? []
    : [];

  function handleRequestError(error: unknown) {
    if (error instanceof ApiRequestError && (error.status === 401 || error.status === 403)) {
      onLogout();
      return;
    }

    setPageError(getErrorMessage(error));
  }

  async function loadExercises(routineId: number, force = false) {
    if (!force && exercisesByRoutine[routineId]) {
      return;
    }

    setLoadingExercises(true);
    setPageError(null);

    try {
      const exerciseList = await getExercises(routineId);
      setExercisesByRoutine((current) => ({ ...current, [routineId]: exerciseList }));
    } catch (error) {
      handleRequestError(error);
    } finally {
      setLoadingExercises(false);
    }
  }

  async function selectRoutine(routineId: number) {
    setSelectedRoutineId(routineId);
    setEditingExerciseId(null);
    setExerciseForm(emptyExerciseForm);
    await loadExercises(routineId);
  }

  async function handleCreateRoutine(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreatingRoutine(true);
    setPageError(null);

    try {
      const routine = await createRoutine(routineName.trim());
      setRoutines((current) => [...current, routine]);
      setExercisesByRoutine((current) => ({ ...current, [routine.id]: [] }));
      setSelectedRoutineId(routine.id);
      setRoutineName('');
    } catch (error) {
      handleRequestError(error);
    } finally {
      setCreatingRoutine(false);
    }
  }

  async function handleCreateExercise(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedRoutineId) {
      return;
    }

    setCreatingExercise(true);
    setPageError(null);

    try {
      const exercise = await createExercise(selectedRoutineId, {
        name: exerciseForm.name.trim(),
        weight: Number(exerciseForm.weight),
        reps: Number(exerciseForm.reps),
      });

      setExercisesByRoutine((current) => ({
        ...current,
        [selectedRoutineId]: [...(current[selectedRoutineId] ?? []), exercise],
      }));
      setExerciseForm(emptyExerciseForm);
    } catch (error) {
      handleRequestError(error);
    } finally {
      setCreatingExercise(false);
    }
  }

  function startEditing(exercise: Exercise) {
    setEditingExerciseId(exercise.id);
    setEditWeight(String(exercise.weight));
    setEditReps(String(exercise.reps));
  }

  async function handleUpdateExercise(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedRoutineId || !editingExerciseId) {
      return;
    }

    setPageError(null);

    try {
      const updated = await updateExercise(selectedRoutineId, editingExerciseId, {
        weight: Number(editWeight),
        reps: Number(editReps),
      });

      setExercisesByRoutine((current) => ({
        ...current,
        [selectedRoutineId]: (current[selectedRoutineId] ?? []).map((exercise) =>
          exercise.id === updated.id ? updated : exercise,
        ),
      }));
      setEditingExerciseId(null);
    } catch (error) {
      handleRequestError(error);
    }
  }

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="spinner" />
        <p>Preparando seus treinos...</p>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark small">L</span>
          <span>LOG WORKOUT</span>
        </div>
        <div className="user-menu">
          <div className="user-copy">
            <strong>{user?.name ?? 'Atleta'}</strong>
            <span>{user?.email}</span>
          </div>
          <div className="avatar" aria-hidden="true">
            {(user?.name ?? 'A').charAt(0).toUpperCase()}
          </div>
          <button className="ghost-button" type="button" onClick={onLogout}>Sair</button>
        </div>
      </header>

      <main className="dashboard">
        <section className="hero-section">
          <div>
            <p className="eyebrow">PAINEL DE TREINO</p>
            <h1>Vamos evoluir, {user?.name?.split(' ')[0] ?? 'atleta'}.</h1>
            <p>Escolha uma rotina ou monte o proximo treino.</p>
          </div>
          <div className="summary-card">
            <span>Rotinas ativas</span>
            <strong>{routines.length.toString().padStart(2, '0')}</strong>
          </div>
        </section>

        {pageError && (
          <div className="form-message error-message dashboard-message" role="alert">
            <span>{pageError}</span>
            <button type="button" onClick={() => setPageError(null)} aria-label="Fechar aviso">×</button>
          </div>
        )}

        <section className="workspace-grid">
          <aside className="routines-panel panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">ORGANIZACAO</p>
                <h2>Minhas rotinas</h2>
              </div>
              <span className="count-badge">{routines.length}</span>
            </div>

            <form className="inline-form" onSubmit={handleCreateRoutine}>
              <input
                aria-label="Nome da nova rotina"
                maxLength={50}
                minLength={2}
                placeholder="Ex.: Treino de pernas"
                required
                value={routineName}
                onChange={(event) => setRoutineName(event.target.value)}
              />
              <button className="icon-button" disabled={creatingRoutine} type="submit" title="Criar rotina">
                {creatingRoutine ? '…' : '+'}
              </button>
            </form>

            <div className="routine-list">
              {routines.length === 0 ? (
                <div className="empty-state compact">
                  <span className="empty-icon">+</span>
                  <strong>Sua primeira rotina comeca aqui</strong>
                  <p>Digite um nome acima para criar.</p>
                </div>
              ) : (
                routines.map((routine, index) => (
                  <button
                    className={`routine-item ${selectedRoutineId === routine.id ? 'selected' : ''}`}
                    key={routine.id}
                    type="button"
                    onClick={() => selectRoutine(routine.id)}
                  >
                    <span className="routine-index">{String(index + 1).padStart(2, '0')}</span>
                    <span>
                      <strong>{routine.name}</strong>
                      <small>{exercisesByRoutine[routine.id]?.length ?? 0} exercicios</small>
                    </span>
                    <span className="chevron">›</span>
                  </button>
                ))
              )}
            </div>
          </aside>

          <section className="exercises-panel panel">
            {selectedRoutine ? (
              <>
                <div className="panel-heading exercise-heading">
                  <div>
                    <p className="eyebrow">ROTINA SELECIONADA</p>
                    <h2>{selectedRoutine.name}</h2>
                  </div>
                  <button
                    className="refresh-button"
                    type="button"
                    onClick={() => loadExercises(selectedRoutine.id, true)}
                  >
                    Atualizar
                  </button>
                </div>

                <form className="exercise-form" onSubmit={handleCreateExercise}>
                  <label className="exercise-name-field">
                    Novo exercicio
                    <input
                      maxLength={50}
                      minLength={2}
                      placeholder="Ex.: Supino reto"
                      required
                      value={exerciseForm.name}
                      onChange={(event) =>
                        setExerciseForm((current) => ({ ...current, name: event.target.value }))
                      }
                    />
                  </label>
                  <label>
                    Carga (kg)
                    <input
                      min="0"
                      placeholder="0"
                      required
                      step="0.5"
                      type="number"
                      value={exerciseForm.weight}
                      onChange={(event) =>
                        setExerciseForm((current) => ({ ...current, weight: event.target.value }))
                      }
                    />
                  </label>
                  <label>
                    Repeticoes
                    <input
                      min="1"
                      placeholder="10"
                      required
                      type="number"
                      value={exerciseForm.reps}
                      onChange={(event) =>
                        setExerciseForm((current) => ({ ...current, reps: event.target.value }))
                      }
                    />
                  </label>
                  <button className="primary-button add-exercise-button" disabled={creatingExercise} type="submit">
                    {creatingExercise ? 'Salvando...' : 'Adicionar'}
                  </button>
                </form>

                <div className="exercise-list-header">
                  <span>Exercicio</span>
                  <span>Carga</span>
                  <span>Repeticoes</span>
                  <span>Acoes</span>
                </div>

                <div className="exercise-list">
                  {loadingExercises ? (
                    <div className="empty-state"><div className="spinner small-spinner" /><p>Buscando exercicios...</p></div>
                  ) : selectedExercises.length === 0 ? (
                    <div className="empty-state">
                      <span className="empty-icon">01</span>
                      <strong>Nenhum exercicio por aqui</strong>
                      <p>Use o formulario acima para montar esta rotina.</p>
                    </div>
                  ) : (
                    selectedExercises.map((exercise, index) =>
                      editingExerciseId === exercise.id ? (
                        <form className="exercise-row editing" key={exercise.id} onSubmit={handleUpdateExercise}>
                          <div className="exercise-title">
                            <span>{String(index + 1).padStart(2, '0')}</span>
                            <strong>{exercise.name}</strong>
                          </div>
                          <label>
                            <span className="mobile-label">Carga</span>
                            <input min="0" required step="0.5" type="number" value={editWeight} onChange={(event) => setEditWeight(event.target.value)} />
                          </label>
                          <label>
                            <span className="mobile-label">Repeticoes</span>
                            <input min="1" required type="number" value={editReps} onChange={(event) => setEditReps(event.target.value)} />
                          </label>
                          <div className="row-actions">
                            <button className="save-button" type="submit">Salvar</button>
                            <button className="text-button" type="button" onClick={() => setEditingExerciseId(null)}>Cancelar</button>
                          </div>
                        </form>
                      ) : (
                        <article className="exercise-row" key={exercise.id}>
                          <div className="exercise-title">
                            <span>{String(index + 1).padStart(2, '0')}</span>
                            <strong>{exercise.name}</strong>
                          </div>
                          <div className="metric"><span className="mobile-label">Carga</span><strong>{exercise.weight}</strong><small>kg</small></div>
                          <div className="metric"><span className="mobile-label">Repeticoes</span><strong>{exercise.reps}</strong><small>reps</small></div>
                          <div className="row-actions">
                            <button className="edit-button" type="button" onClick={() => startEditing(exercise)}>Editar</button>
                          </div>
                        </article>
                      ),
                    )
                  )}
                </div>
              </>
            ) : (
              <div className="empty-state full-height">
                <span className="empty-icon">+</span>
                <strong>Crie uma rotina para comecar</strong>
                <p>Depois voce podera adicionar e atualizar seus exercicios.</p>
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
