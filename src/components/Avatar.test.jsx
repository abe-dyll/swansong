import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import Avatar from './Avatar';

describe('Avatar', () => {
  it('renders an image when src is provided', () => {
    const { container } = render(<Avatar src="https://example.com/pic.jpg" name="Bob Dylan" color="#A63A2B" />);
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img.getAttribute('src')).toBe('https://example.com/pic.jpg');
  });

  it('renders a colored initial when src is missing', () => {
    const { container } = render(<Avatar src={null} name="Bob Dylan" color="#A63A2B" />);
    const fallback = container.querySelector('.avatar--fallback');
    expect(fallback).not.toBeNull();
    expect(fallback.textContent).toBe('B');
    expect(fallback.style.background).toBe('rgb(166, 58, 43)');
  });

  it('falls back to "?" when name is missing', () => {
    const { container } = render(<Avatar src={null} name="" color="#A63A2B" />);
    expect(container.querySelector('.avatar--fallback').textContent).toBe('?');
  });
});
