import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the manage inventory list button on the home page', () => {
  render(<App />);
  expect(screen.getByText(/manage inventory list/i)).toBeInTheDocument();
});
