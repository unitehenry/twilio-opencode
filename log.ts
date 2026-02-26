type LogLevel = "INFO" | "WARN" | "ERROR";

export default (
  level: LogLevel,
  message: string,
  data: Record<string, any> = {},
): void => {
  const time = new Date().toISOString();

  const entry = {
    level,
    time,
    message,
    ...data,
  };

  process.stdout.write(JSON.stringify(entry) + "\n");
}
