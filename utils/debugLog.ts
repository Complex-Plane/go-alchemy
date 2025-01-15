const DEBUG = true;

export const debugLog = (
  caller: string | null = null,
  message: string,
  data?: any
) => {
  if (DEBUG) {
    console.log(`[${caller}] ${message}`, data);
  }
};
