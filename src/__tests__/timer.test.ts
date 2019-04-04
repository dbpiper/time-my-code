import { promisify } from 'util';
import Timer from '../timer';

// tslint:disable: no-magic-numbers

describe('timer tests', () => {
  test('the basic functionality works', () => {
    const timer = new Timer();
    const result = timer.stop();

    // since all we did was start and stop the timer
    // that should not take very long...
    expect(result.seconds).toBeLessThan(1);
    expect(result.minutes).toBe(0);
  });

  test('works with a timeout of 50 ms', async () => {
    const timer = new Timer();
    const timeout = promisify(setTimeout);
    await timeout(50);
    const result = timer.stop();

    expect(result.milliseconds).toBeGreaterThanOrEqual(50);
    expect(result.milliseconds).toBeLessThan(300);
  });

  test('works with a timeout of a couple of seconds', async () => {
    const timer = new Timer();
    const timeout = promisify(setTimeout);
    await timeout(1000 * 2);
    const result = timer.stop();

    expect(result.seconds).toBeGreaterThanOrEqual(2);
    expect(result.seconds).toBeLessThanOrEqual(2.5);
  });
});
