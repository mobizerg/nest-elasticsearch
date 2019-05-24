import { upperCase } from 'lodash';

export function getClientToken(name?: string): string {
  return name ? `ELASTICSEARCH_CLIENT_${upperCase(name)}` : 'ELASTICSEARCH_CLIENT_DEFAULT';
}