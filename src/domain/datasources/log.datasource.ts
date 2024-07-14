import { LogSeverityLevel } from "../models/log.model";

type LogEntity = {
  id: string;
  message: string;
};

export abstract class LogDatasources {
  abstract saveLog(log: LogEntity): Promise<void>;
  abstract getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]>;
}
