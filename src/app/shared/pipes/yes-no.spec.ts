import { YesNoPipe } from './yes-no';

describe('YesNoPipe', () => {
  const pipe = new YesNoPipe();

  it('formats true as Yes', () => {
    expect(pipe.transform(true)).toBe('Yes');
  });

  it('formats false as No', () => {
    expect(pipe.transform(false)).toBe('No');
  });
});
