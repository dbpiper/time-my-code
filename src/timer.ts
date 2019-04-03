import moment from 'moment';

export interface FormattedDuration {
  milliseconds: number;
  seconds: number;
  minutes: number;
}

class Timer {
  private static _makeFormattedDuration = (
    duration: moment.Duration,
  ): FormattedDuration => {
    const locale = 'en-US';
    const millisecondsInSecond = 1000;
    const formattingOptions: Intl.NumberFormatOptions = {
      maximumFractionDigits: 2,
    };
    const milliseconds = Number(
      duration.milliseconds().toLocaleString(locale, formattingOptions),
    );
    const seconds = Number(
      (duration.seconds() + milliseconds / millisecondsInSecond).toLocaleString(
        locale,
        formattingOptions,
      ),
    );
    const minutes = Number(
      duration.minutes().toLocaleString(locale, formattingOptions),
    );

    return {
      milliseconds,
      seconds,
      minutes,
    };
  };
  private _startTime!: moment.Moment;
  private _stopTime!: moment.Moment;

  constructor() {
    // give it a default start time, however this really should be done
    // by the user in their own code. Having this here though means that
    // it will at least be somewhat close to correct even without the user
    // doing anything.
    this.start();
  }

  /**
   * Start running the timer.
   *
   * @memberof Timer
   */
  public start() {
    this._startTime = moment();
  }

  /**
   * Stops the timer, and returns how much time passed.
   *
   * @returns The amounted of time taken as a FormattedDuration object
   * @memberof Timer
   */
  public stop() {
    this._stopTime = moment();

    const durationMs = this._stopTime.diff(this._startTime);
    const timeTaken = moment.duration(durationMs, 'milliseconds');
    const formattedDuration = Timer._makeFormattedDuration(timeTaken);

    return formattedDuration;
  }
}

export default Timer;
