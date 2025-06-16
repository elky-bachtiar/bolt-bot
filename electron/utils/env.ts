export function isDev(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function getAppVersion(): string {
  return process.env.npm_package_version || '1.0.0';
}