import dayjs from "dayjs";

class Time {
  private _second: number;
  private _minute: number;
  private _hour: number;

  constructor(time: dayjs.Dayjs | null);
  constructor(seconds: number, minutes: number, hour?: number);
  constructor(
    secondsOrTime: number | dayjs.Dayjs | null,
    minute?: number,
    hour = 0
  ) {
    if (secondsOrTime === null) {
      this._second = 0;
      this._minute = 0;
      this._hour = 0;
      return;
    }

    if (dayjs.isDayjs(secondsOrTime)) {
      this._second = secondsOrTime.second();
      this._minute = secondsOrTime.minute();
      this._hour = secondsOrTime.hour();
      return;
    }

    if (minute === undefined) throw new Error("Minute must be provided");

    // Handle overflow
    let totalSeconds = secondsOrTime;
    let totalMinutes = minute;

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
    const totalSeconds = this.totalSeconds + time.totalSeconds;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return new Time(seconds, minutes, hours > 24 ? hours - 24 : hours);
  }

  public subtract(time: Time): Time {
    let totalSeconds = this.totalSeconds - time.totalSeconds;

    // If end time is less than start time, it means we've crossed midnight
    if (totalSeconds < 0 && this.hour === 0) totalSeconds += 24 * 3600;
    else totalSeconds = Math.abs(totalSeconds);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return new Time(seconds, minutes, hours);
  }

  public static getHour(time: Time | dayjs.Dayjs): number {
    return dayjs.isDayjs(time) ? time.hour() : time.hour;
  }

  public static getMinute(time: Time | dayjs.Dayjs): number {
    return dayjs.isDayjs(time) ? time.minute() : time.minute;
  }

  public static getSecond(time: Time | dayjs.Dayjs): number {
    return dayjs.isDayjs(time) ? time.second() : time.second;
  }

  public static calculateTime = function (
    start: dayjs.Dayjs | Time | null,
    end: dayjs.Dayjs | Time | null,
    buffer?: dayjs.Dayjs | Time | null
  ): Time {
    if (!start || !end) return new Time(0, 0);

    let totalSeconds =
      Time.getHour(end) * 3600 +
      Time.getMinute(end) * 60 +
      Time.getSecond(end) -
      (Time.getHour(start) * 3600 +
        Time.getMinute(start) * 60 +
        Time.getSecond(start));

    // If end time is less than start time, it means we've crossed midnight
    if (totalSeconds < 0) {
      totalSeconds += 24 * 3600;
    }

    // Buffer will always be less than 1 hour
    const minutes =
      Math.floor(totalSeconds / 60) + (buffer ? Time.getMinute(buffer) : 0);
    const remainingSeconds =
      (totalSeconds % 60) + (buffer ? Time.getSecond(buffer) : 0);

    return new Time(remainingSeconds, minutes);
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
