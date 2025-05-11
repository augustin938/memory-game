// import { describe, it, expect, vi } from 'vitest';
// import { render, screen, fireEvent } from '@testing-library/react';
// import Button from './Button';
// import styles from './Button.module.css';

// describe('Button Component', () => {
//   it('renders button with children', () => {
//     render(<Button>Click me</Button>);
//     const button = screen.getByRole('button', { name: /click me/i });
//     expect(button).toBeInTheDocument();
//     expect(button).toHaveTextContent('Click me');
//   });

//   it('calls onClick handler when clicked', () => {
//     const handleClick = vi.fn();
//     render(<Button onClick={handleClick}>Click me</Button>);
    
//     const button = screen.getByRole('button', { name: /click me/i });
//     fireEvent.click(button);
//     expect(handleClick).toHaveBeenCalledTimes(1);
//   });

//   it('has correct button class', () => {
//     render(<Button>Click me</Button>);
//     const button = screen.getByRole('button', { name: /click me/i });
//     expect(button).toHaveClass(styles.button);
//   });
// });