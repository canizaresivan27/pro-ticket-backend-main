export enum LogSeverityLevel {
  low = "low",
  medium = "medium",
  high = "high",
}

export class LogModel {
  public level: LogSeverityLevel;
  public message: string;
  public createAt: Date;

  constructor(message: string, level: LogSeverityLevel) {
    this.message = message;
    this.level = level;
    this.createAt = new Date();
  }
}
