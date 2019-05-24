import { Inject } from '@nestjs/common';
import { getClientToken } from './elasticsearch.helper';

export function InjectClient(name?: string): ParameterDecorator {
  return Inject(getClientToken(name));
}