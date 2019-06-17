export function getClientToken(name?: string): string {
  return name ? `ELASTICSEARCH_CLIENT_${name.toUpperCase()}` : 'ELASTICSEARCH_CLIENT_DEFAULT';
}
