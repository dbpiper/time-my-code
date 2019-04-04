import moment from 'moment';
import FormattedDuration from '../formatted-duration';

// tslint:disable: no-magic-numbers

describe('FormattedDuration tests', () => {
  describe('construction', () => {
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

  describe('toString', () => {
    test('works with a long duration (i.e. commas + "and")', () => {
      const duration = new FormattedDuration(109886400);
      expect(duration.toString()).toEqual(
        '30 hours, 31 minutes and 26.4 seconds',
      );
    });

    describe('< 1 second tests', () => {
      test('works with an integer number of ms', () => {
        const duration = new FormattedDuration(389);
        expect(duration.toString()).toEqual('389 milliseconds');
      });

      test('works with a real number of ms', () => {
        const duration = new FormattedDuration(50.135);
        expect(duration.toString()).toEqual('50.14 milliseconds');
      });

      test('works with exactly 1 ms', () => {
        const duration = new FormattedDuration(1);
        expect(duration.toString()).toEqual('1 millisecond');
      });
    });

    describe('>= 1 second && < 1 minute tests', () => {
      test('works with an integer number of seconds', () => {
        const duration = new FormattedDuration(50 * 1000);
        expect(duration.toString()).toEqual('50 seconds');
      });

      test('works with a real number of seconds', () => {
        const duration = new FormattedDuration(50 * 1000);
        expect(duration.toString()).toEqual('50 seconds');
      });

      test('works with exactly one second', () => {
        const duration = new FormattedDuration(1 * 1000);
        expect(duration.toString()).toEqual('1 second');
      });
    });

    describe('>= 1 minute && < 1 hour tests', () => {
      test('works with an integer number of minutes', () => {
        const duration = new FormattedDuration(50 * 1000 * 2);
        expect(duration.toString()).toEqual('1 minute and 40 seconds');
      });

      test('works with a real number of minutes', () => {
        const duration = new FormattedDuration(50.135 * 1000 * 2);
        expect(duration.toString()).toEqual('1 minute and 40.27 seconds');
      });

      test('works with exactly one minute', () => {
        const duration = new FormattedDuration(1 * 1000 * 60);
        expect(duration.toString()).toEqual('1 minute');
      });

      test('works with plural amount of minutes and seconds, both integers', () => {
        const duration = new FormattedDuration(50 * 1000 * 5);
        expect(duration.toString()).toEqual('4 minutes and 10 seconds');
      });
    });
  });
});
