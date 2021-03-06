import _ from 'lodash';
import moment from 'moment';

export type Duration = number | moment.Duration;

interface UnitAndAmount {
  unitName: string;
  unitString: string;
  amount: string;
  priority: number;
}

type UnitAndAmounts = UnitAndAmount[];

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
  /**
   * Gets the amount of milliseconds in the duration rounded to the number
   * of digits provided by precision.
   */
  get milliseconds() {
    return FormattedDuration._roundNumber(this._duration.milliseconds());
  }

  private static getUnitAndAmount(
    UAs: UnitAndAmounts,
    unitName: string,
  ): UnitAndAmount | undefined {
    return _.first(_.filter(UAs, ua => ua.unitName === unitName));
  }

  private static nonMsUnitAndAmounts(UAs: UnitAndAmounts) {
    const nonMs = _.filter(UAs, ua => !_.includes(ua.unitName, 'milli'));
    return nonMs;
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
  private static _pluralizeIfNeeded = (amount: number, unit: string) => {
    if (amount === 1) {
      return unit;
    }
    return `${unit}s`;
  };

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

  public toString() {
    const unitAndAmounts = this.getNonEmptyUnitAndAmounts();
    const nonMs = FormattedDuration.nonMsUnitAndAmounts(unitAndAmounts);
    const sortedNonMs = _.sortBy(nonMs, 'priority');
    const snmStrings = _.map(
      sortedNonMs,
      ua => `${ua.amount} ${ua.unitString}`,
    );
    const lastNonMs = _.last(snmStrings);

    if (nonMs.length === 0) {
      const milliseconds = FormattedDuration.getUnitAndAmount(
        unitAndAmounts,
        'milliseconds',
      );

      if (milliseconds) {
        return `${milliseconds.amount} ${milliseconds.unitString}`;
      }
    }

    if (lastNonMs) {
      const init = _.initial(snmStrings);
      const last = lastNonMs;

      if (init.length > 0) {
        return `${init.join(', ')} and ${last}`;
      }
      return `${last}`;
    }

    // shouldn't ever happen, but this is here for completeness
    // as typescript will say that all paths aren't covered if it isn't
    // jest complains that this is uncovered though 😞
    return '';
  }

  private getNonEmptyUnitAndAmounts(): UnitAndAmounts {
    const stringifiedUnits = this.stringifyUnits();
    const stringifiedAmounts = this._stringifyAmounts();

    const unitAndAmounts = [
      {
        unitName: 'milliseconds',
        amount: stringifiedAmounts.milliseconds,
        unitString: stringifiedUnits.milliseconds,
        priority: 3,
      },
      {
        unitName: 'seconds',
        amount: stringifiedAmounts.seconds,
        unitString: stringifiedUnits.seconds,
        priority: 2,
      },
      {
        unitName: 'minutes',
        amount: stringifiedAmounts.minutes,
        unitString: stringifiedUnits.minutes,
        priority: 1,
      },
      {
        unitName: 'hours',
        amount: stringifiedAmounts.hours,
        unitString: stringifiedUnits.hours,
        priority: 0,
      },
    ];

    const nonEmptyUAs = _.filter(unitAndAmounts, ua => {
      const numAmount = Number(ua.amount);

      if (!isNaN(numAmount) && numAmount > 0) {
        return true;
      }

      return false;
    });

    return nonEmptyUAs;
  }

  private stringifyUnits() {
    const milliseconds = FormattedDuration._pluralizeIfNeeded(
      this.milliseconds,
      'millisecond',
    );
    const seconds = FormattedDuration._pluralizeIfNeeded(
      this.seconds,
      'second',
    );
    const minutes = FormattedDuration._pluralizeIfNeeded(
      this.minutes,
      'minute',
    );
    const hours = FormattedDuration._pluralizeIfNeeded(this.hours, 'hour');

    return {
      milliseconds,
      seconds,
      minutes,
      hours,
    };
  }

  private _stringifyAmounts = () => {
    // if we're printing seconds then we don't want to print milliseconds
    // that is, we only ever print milliseconds by themselves as they
    // are so insignificantly small that if there are seconds involved,
    // then we'll just print the milliseconds as parts of a second.
    const millisecondsInSecond = 1000;
    let seconds;
    if (this.seconds >= 1) {
      seconds = FormattedDuration._roundNumber(
        this.seconds + this.milliseconds / millisecondsInSecond,
      );
    } else {
      seconds = FormattedDuration._roundNumber(this.seconds);
    }

    return {
      milliseconds: `${this.milliseconds}`,
      seconds: `${seconds}`,
      minutes: `${this.minutes}`,
      hours: `${this.hours}`,
    };
  };
}

export default FormattedDuration;
