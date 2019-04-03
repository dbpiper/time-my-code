import moment from 'moment';
import FormattedDuration from '../formatted-duration';

// tslint:disable: no-magic-numbers

describe('FormattedDuration tests', () => {
  test('works with a simple duration in ms', () => {
    const duration = new FormattedDuration(8.4528e6);
    expect(duration.hours).toBe(2);
    expect(duration.minutes).toBe(20);
    expect(duration.seconds).toBe(52);
    expect(duration.milliseconds).toBe(800);
  });

  test('works with a simple duration as moment.Duration', () => {
    const milliseconds = 8.4528e6;
    const momentDuration = moment.duration(milliseconds);

    const duration = new FormattedDuration(momentDuration);
    expect(duration.hours).toBe(2);
    expect(duration.minutes).toBe(20);
    expect(duration.seconds).toBe(52);
    expect(duration.milliseconds).toBe(800);
  });

  test('works with a duration longer than a day', () => {
    const duration = new FormattedDuration(109886400);
    expect(duration.hours).toBe(30);
    expect(duration.minutes).toBe(31);
    expect(duration.seconds).toBe(26);
    expect(duration.milliseconds).toBe(400);
  });
});
