import { LogSeverityLevel } from "../models/log.model";

type LogEntity = {
  id: string;
  message: string;
};

export abstract class LogRepository {}
