import Timer from '../timer';

// tslint:disable: no-magic-numbers

describe('timer tests', () => {
  test('the basic functionality works', () => {
    const timer = new Timer();
    const result = timer.stop();

    // since all we did was start and stop the timer
    // that should not take very long...
    expect(result.seconds).toBeLessThan(10);
    expect(result.minutes).toBe(0);
  });
});
