import moment from 'moment';

export type Duration = number | moment.Duration;

/**
 * Represents a duration, however each unit is treated as the remainder
 * starting from the largest possible one. In other words, it is setup
 * just like how a person would say how much time has passed.
 *
 * Rounds all numbers to two decimal places as the main intended purpose is for
 * printing output rather than internal programmatic use.
 *
 * @class FormattedDuration
 */
class FormattedDuration {
  // private static _pluralizeIfNeeded = (amount: number, unit: string) => {
  //   if (amount === 1) {
  //     return unit;
  //   }
  //   return `${unit}s`;
  // };

  private static _isNumber = (duration: Duration): duration is Duration =>
    typeof duration === 'number';

  private static _roundNumber = (toRound: number, precision: number = 2) => {
    const locale = 'en-US';
    const formattingOptions: Intl.NumberFormatOptions = {
      maximumFractionDigits: precision,
    };
    const rounded = Number(toRound.toLocaleString(locale, formattingOptions));

    return rounded;
  };

  private _duration: moment.Duration;

  public constructor(duration: Duration) {
    if (FormattedDuration._isNumber(duration)) {
      const momentDuration = moment.duration(duration, 'milliseconds');
      this._duration = momentDuration;
    } else {
      this._duration = duration;
    }
  }

  /**
   * Gets the amount of milliseconds in the duration rounded to the number
   * of digits provided by precision.
   */
  get milliseconds() {
    return FormattedDuration._roundNumber(this._duration.milliseconds());
  }

  /**
   * Gets the amount of seconds in the duration rounded to the number
   * of digits provided by precision.
   */
  get seconds() {
    return FormattedDuration._roundNumber(this._duration.seconds());
  }

  /**
   * Gets the amount of minutes in the duration rounded to the number
   * of digits provided by precision.
   */
  get minutes() {
    return FormattedDuration._roundNumber(this._duration.minutes());
  }

  /**
   * Gets the amount of hours in the duration rounded to the number
   * of digits provided by precision. Since hours is the largest unit
   * that FormattedDuration supports, anything larger than an hour will
   * simply be in this function. For example: the information that
   * the duration is 5 days long would be found here as: 120 hours.
   */
  get hours() {
    return FormattedDuration._roundNumber(Math.trunc(this._duration.asHours()));
  }

  // public toString() {
  //   // const stringifiedUnits = this._stringifyUnits();

  //   // if (this.minutes < 1 && this.seconds < 1) {
  //   //   return `${this.milliseconds} ${stringifiedUnits.milliseconds}`;
  //   // }

  //   // if (this.minutes < 1) {
  //   //   return `${this.seconds} ${stringifiedUnits.seconds}`;
  //   // }
  //   // if (this.minutes === 1 && this.seconds < 1) {
  //   //   return `${this.minutes} ${stringifiedUnits.minutes}`;
  //   // }

  //   // return `${this.minutes} ${stringifiedUnits.minutes} and ${this.seconds} ${
  //   //   stringifiedUnits.seconds
  //   // }`;

  //   return '';
  // }

  // private _stringifyUnitsAndAmounts = () => {
  //   const stringifiedUnits = this._stringifyUnits();
  //   const stringifiedAmounts = this._;
  // };

  // private _stringifyUnits = () => {
  //   const milliseconds = FormattedDuration._pluralizeIfNeeded(
  //     this.milliseconds,
  //     'millisecond',
  //   );
  //   const seconds = FormattedDuration._pluralizeIfNeeded(
  //     this.seconds,
  //     'second',
  //   );
  //   const minutes = FormattedDuration._pluralizeIfNeeded(
  //     this.minutes,
  //     'minute',
  //   );

  //   return {
  //     milliseconds,
  //     seconds,
  //     minutes,
  //   };
  // };

  // private _stringifyAmounts = () => {
  //   const millisecondsInSecond = 1000;
  //   const seconds = Number(
  //     (this.seconds() + milliseconds / millisecondsInSecond).toLocaleString(
  //       locale,
  //       formattingOptions,
  //     ),
  //   );

  //   this.milliseconds = milliseconds;
  //   this.seconds = seconds;
  //   this.minutes = minutes;
  //   this.hours = hours;
  // };
}

export default FormattedDuration;
