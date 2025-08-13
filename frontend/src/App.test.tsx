import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders STR application', () => {
  render(<App />);
  // Test simple pour vérifier que l'app se charge
  expect(document.body).toBeInTheDocument();
});
