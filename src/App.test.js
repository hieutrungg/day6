import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';

function renderApp() {
  render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

beforeEach(() => localStorage.clear());

test('thêm, hoàn thành và xóa một công việc', () => {
  renderApp();

  fireEvent.change(screen.getByLabelText('Tên công việc'), {
    target: { value: 'Ôn bài React' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Thêm việc' }));

  const todo = screen.getByText('Ôn bài React');
  expect(todo).toBeInTheDocument();

  fireEvent.click(todo);
  expect(todo.closest('li')).toHaveClass('completed');

  fireEvent.click(screen.getByRole('button', { name: 'Xóa Ôn bài React' }));
  expect(screen.queryByText('Ôn bài React')).not.toBeInTheDocument();
});
