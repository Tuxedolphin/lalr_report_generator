import dayjs from "dayjs";

class Time {
  private _second: number;
  private _minute: number;
  private _hour: number;

  constructor(time: dayjs.Dayjs | null);
  constructor(seconds: number, minutes: number, hour?: number);
  constructor(
    minutesOrTime: number | dayjs.Dayjs | null,
    seconds?: number,
    hour = 0
  ) {
    if (minutesOrTime === null) {
      this._second = 0;
      this._minute = 0;
      this._hour = 0;
      return;
    }

    if (dayjs.isDayjs(minutesOrTime)) {
      this._minute = minutesOrTime.minute();
      this._second = minutesOrTime.second();
      this._hour = minutesOrTime.hour();
      return;
    }

    if (seconds === undefined) throw new Error("Seconds must be provided");

    // Handle overflow
    let totalSeconds = seconds;
    let totalMinutes = minutesOrTime;

    if (totalSeconds >= 60) {
      totalMinutes += Math.floor(totalSeconds / 60);
      totalSeconds %= 60;
    }

    if (totalMinutes >= 60) {
      hour += Math.floor(totalMinutes / 60);
      totalMinutes %= 60;
    }

    this._second = totalSeconds;
    this._minute = totalMinutes;
    this._hour = hour;
  }

  get second(): number {
    return this._second;
  }

  get minute(): number {
    return this._minute;
  }

  get hour(): number {
    return this._hour;
  }

  get totalSeconds(): number {
    return this._hour * 3600 + this._minute * 60 + this._second;
  }

  public toString(displayHour?: boolean): string {
    return (
      (displayHour ? `${this._hour.toString()}:` : "") +
      `${this._minute.toString().padStart(2, "0")}:${this._second.toString().padStart(2, "0")}`
    );
  }

  public add(time: Time): Time {
    return new Time(
      this._hour + time.hour,
      this._minute + time.minute,
      this._second + time.second
    );
  }

  public subtract(time: Time): Time {
    return new Time(
      this._hour - time.hour,
      this._minute - time.minute,
      this._second - time.second
    );
  }

  public static calculateTime = function (
    start: dayjs.Dayjs | Time | null,
    end: dayjs.Dayjs | Time | null,
    buffer?: dayjs.Dayjs | Time | null
  ): Time {
    if (!start || !end) return new Time(0, 0);

    const getHour = (t: dayjs.Dayjs | Time) =>
      dayjs.isDayjs(t) ? t.hour() : t.hour;
    const getMinute = (t: dayjs.Dayjs | Time) =>
      dayjs.isDayjs(t) ? t.minute() : t.minute;
    const getSecond = (t: dayjs.Dayjs | Time) =>
      dayjs.isDayjs(t) ? t.second() : t.second;

    let totalSeconds =
      getHour(end) * 3600 +
      getMinute(end) * 60 +
      getSecond(end) -
      (getHour(start) * 3600 + getMinute(start) * 60 + getSecond(start));

    // If end time is less than start time, it means we've crossed midnight
    if (totalSeconds < 0) {
      totalSeconds += 12 * 3600;
    }

    // Buffer will always be less than 1 hour
    const minutes =
      Math.floor(totalSeconds / 60) + (buffer ? getMinute(buffer) : 0);
    const remainingSeconds =
      (totalSeconds % 60) + (buffer ? getSecond(buffer) : 0);

    return new Time(minutes, remainingSeconds);
  };

  public static timeToString(
    time: Time | dayjs.Dayjs,
    displayHour?: boolean
  ): string {
    if (time instanceof Time) return time.toString(displayHour);

    return displayHour ? time.format("HH:mm:ss") : time.format("mm:ss");
  }
}

export default Time;
