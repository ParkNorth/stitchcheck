export const APEX_HOSTNAME = "stitchcheck.com";

function hostname(host: string): string {
  return host.split(":")[0]?.toLowerCase() ?? "";
}

export function isWwwHost(host: string): boolean {
  return hostname(host) === `www.${APEX_HOSTNAME}`;
}

export function isSiteHost(host: string): boolean {
  const h = hostname(host);
  return h === APEX_HOSTNAME || h === `www.${APEX_HOSTNAME}`;
}

export function isWorkersDevHost(host: string): boolean {
  return hostname(host).endsWith(".workers.dev");
}
