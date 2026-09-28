import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import './App.css';
import { useTheme } from './context/ThemeContext';
import useLocalStorage from './hooks/useLocalStorage';

const initialTodos = [
  { id: 1, text: 'Học React Hooks', completed: false },
  { id: 2, text: 'Làm bài tập Todo List', completed: false },
];

function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];
    case 'TOGGLE':
      return state.map((todo) =>
        todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
      );
    case 'DELETE':
      return state.filter((todo) => todo.id !== action.payload);
    case 'CLEAR_COMPLETED':
      return state.filter((todo) => !todo.completed);
    default:
      return state;
  }
}

function App() {
  const [savedTodos, setSavedTodos] = useLocalStorage('react-hooks-todos', initialTodos);
  const [todos, dispatch] = useReducer(todoReducer, savedTodos);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const { isDark, toggleTheme } = useTheme();

  // useEffect lưu danh sách mới thông qua custom hook useLocalStorage.
  useEffect(() => {
    setSavedTodos(todos);
  }, [todos, setSavedTodos]);

  // useMemo chỉ tính lại khi danh sách công việc thay đổi.
  const remainingCount = useMemo(
    () => todos.filter((todo) => !todo.completed).length,
    [todos]
  );
  const completedCount = todos.length - remainingCount;

  // useCallback giữ nguyên tham chiếu hàm khi nội dung input không đổi.
  const addTodo = useCallback(() => {
    const text = input.trim();
    if (!text) {
      inputRef.current?.focus();
      return;
    }

    dispatch({
      type: 'ADD',
      payload: { id: Date.now(), text, completed: false },
    });
    setInput('');
    inputRef.current?.focus();
  }, [input]);

  const handleSubmit = (event) => {
    event.preventDefault();
    addTodo();
  };

  return (
    <main className={`app ${isDark ? 'dark' : 'light'}`}>
      <section className="todo-card">
        <header className="hero">
          <div>
            <p className="eyebrow">REACT HOOKS DEMO</p>
            <h1>Việc hôm nay</h1>
            <p className="subtitle">Gọn gàng từng việc nhỏ, nhẹ đầu cả ngày.</p>
          </div>
          <button
            className="theme-button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Bật chế độ sáng' : 'Bật chế độ tối'}
          >
            <span aria-hidden="true">{isDark ? '☀️' : '🌙'}</span>
            {isDark ? 'Sáng' : 'Tối'}
          </button>
        </header>

        <form className="add-form" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Bạn cần làm gì?"
            aria-label="Tên công việc"
          />
          <button type="submit">Thêm việc</button>
        </form>

        <div className="summary">
          <div>
            <strong>{remainingCount}</strong>
            <span>chưa xong</span>
          </div>
          <div>
            <strong>{completedCount}</strong>
            <span>đã hoàn thành</span>
          </div>
        </div>

        <div className="list-heading">
          <h2>Danh sách công việc</h2>
          {completedCount > 0 && (
            <button onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })}>
              Xóa việc đã xong
            </button>
          )}
        </div>

        {todos.length === 0 ? (
          <div className="empty-state">
            <span aria-hidden="true">🎉</span>
            <p>Không còn công việc nào!</p>
          </div>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo.id} className={todo.completed ? 'completed' : ''}>
                <label>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => dispatch({ type: 'TOGGLE', payload: todo.id })}
                  />
                  <span className="checkmark" aria-hidden="true">✓</span>
                  <span className="todo-text">{todo.text}</span>
                </label>
                <button
                  className="delete-button"
                  onClick={() => dispatch({ type: 'DELETE', payload: todo.id })}
                  aria-label={`Xóa ${todo.text}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <footer>Nhấp vào ô tròn để đánh dấu hoàn thành</footer>
      </section>
    </main>
  );
}

export default App;
