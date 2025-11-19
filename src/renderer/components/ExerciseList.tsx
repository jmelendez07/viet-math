import React from 'react';

export interface Exercise {
  id: string;
  name: string;
  funcStr: string;
  funcLatex: string;
  a: string;
  b: string;
  n: string;
  method: string;
}

interface Props {
  exercises: Exercise[];
  currentExerciseId: string | null;
  onSelectExercise: (id: string) => void;
  onAddExercise: () => void;
  onDeleteExercise: (id: string) => void;
  onRenameExercise: (id: string, newName: string) => void;
}

const ExerciseList: React.FC<Props> = ({
  exercises,
  currentExerciseId,
  onSelectExercise,
  onAddExercise,
  onDeleteExercise,
  onRenameExercise,
}) => {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editName, setEditName] = React.useState('');

  // Trigger MathJax typesetting when exercises change
  React.useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).MathJax) {
      (window as any).MathJax.typesetPromise?.().catch((err: any) => console.log('MathJax error:', err));
    }
  }, [exercises]);

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const handleSaveEdit = (id: string) => {
    if (editName.trim()) {
      onRenameExercise(id, editName.trim());
    }
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  return (
    <div className="exercise-list">
      <div className="exercise-list-header">
        <h3>Ejercicios</h3>
        <button className="btn-add" onClick={onAddExercise} title="Nuevo ejercicio">
          + Nuevo
        </button>
      </div>
      <div className="exercise-items">
        {exercises.length === 0 ? (
          <div className="empty-state">
            <p>No hay ejercicios. Haz clic en "+ Nuevo" para crear uno.</p>
          </div>
        ) : (
          exercises.map((ex) => (
            <div
              key={ex.id}
              className={`exercise-item ${currentExerciseId === ex.id ? 'active' : ''}`}
              onClick={() => onSelectExercise(ex.id)}
            >
              <div className="exercise-item-content">
                {editingId === ex.id ? (
                  <input
                    type="text"
                    className="exercise-name-input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => handleSaveEdit(ex.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(ex.id);
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <div className="exercise-name">{ex.name}</div>
                    <div className="exercise-info">
                      {ex.funcLatex ? (
                        <span className="exercise-latex">
                          {`\\(${ex.funcLatex}\\)`}
                        </span>
                      ) : (
                        <code>{ex.funcStr}</code>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="exercise-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  className="btn-icon"
                  onClick={() => handleStartEdit(ex.id, ex.name)}
                  title="Renombrar"
                >
                  ✏️
                </button>
                <button
                  className="btn-icon btn-danger"
                  onClick={() => onDeleteExercise(ex.id)}
                  title="Eliminar"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExerciseList;
