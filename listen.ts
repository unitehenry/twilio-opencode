import log from "./log.ts";

export default async () : Promise<void> => {
  const opencodeBaseUrl = process.env.OPENCODE_BASE_URL;

  if (!opencodeBaseUrl) {
    log("ERROR", "No opencode base url");

    process.exit(1);
  }

  log("INFO", "Probing opencode", { opencodeBaseUrl });

  try {
    const response = await fetch(`${opencodeBaseUrl}/global/health`);

    const body = await response.json();

    if (!body.healthy) {
      log("ERROR", "Opencode not healthy");

      process.exit(1);
    }
  } catch(error) {
    log("ERROR", "Could not probe opencode", { error });

    process.exit(1);
  }

  log("INFO", "Server listening");
}
