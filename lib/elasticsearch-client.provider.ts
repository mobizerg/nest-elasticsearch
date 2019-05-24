import { Client } from '@elastic/elasticsearch';
import { ELASTICSEARCH_MODULE_OPTIONS } from './elasticsearch.constant';
import { ElasticsearchModuleOptions } from './interfaces';
import { FactoryProvider } from '@nestjs/common/interfaces';
import { getClientToken } from './elasticsearch.helper';

export const createElasticsearchClient: (name?: string) => FactoryProvider = (name?: string)  => ({
  provide: getClientToken(name),
  useFactory: (options: ElasticsearchModuleOptions) => {
    return new Client(options);
  },
  inject: [ELASTICSEARCH_MODULE_OPTIONS],
});
