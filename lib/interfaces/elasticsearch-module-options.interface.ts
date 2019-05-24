import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { ClientOptions } from '@elastic/elasticsearch';

export interface ElasticsearchModuleOptions extends ClientOptions {
  name?: string;
}

export interface ElasticsearchOptionsFactory {
  createElasticsearchOptions(name?: string): Promise<ElasticsearchModuleOptions> | ElasticsearchModuleOptions;
}

export interface ElasticsearchModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useExisting?: Type<ElasticsearchOptionsFactory>;
  useClass?: Type<ElasticsearchOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<ElasticsearchModuleOptions> | ElasticsearchModuleOptions;
  inject?: any[];
}
