import moment from 'moment';
import FormattedDuration from './formatted-duration';

class Timer {
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
  public start = () => {
    this._startTime = moment();
  };

  /**
   * Stops the timer, and returns how much time passed.
   *
   * @returns The amounted of time taken as a FormattedDuration object
   * @memberof Timer
   */
  public stop = () => {
    this._stopTime = moment();

    // get the amount of time that passed, in milliseconds
    const duration = this._stopTime.diff(this._startTime);

    return new FormattedDuration(duration);
  };
}

export default Timer;
