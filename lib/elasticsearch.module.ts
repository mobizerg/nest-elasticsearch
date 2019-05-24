import { DynamicModule, Inject, Module, Provider } from '@nestjs/common';
import { ElasticsearchModuleAsyncOptions, ElasticsearchModuleOptions, ElasticsearchOptionsFactory } from './interfaces';
import { createElasticsearchClient } from './elasticsearch-client.provider';
import { ELASTICSEARCH_MODULE_OPTIONS } from './elasticsearch.constant';
import { getClientToken } from './elasticsearch.helper';

@Module({})
export class ElasticsearchModule {

  constructor(@Inject(ELASTICSEARCH_MODULE_OPTIONS)
              private readonly options: ElasticsearchModuleOptions) {}

  static register(options: ElasticsearchModuleOptions): DynamicModule {
    return {
      module: ElasticsearchModule,
      providers: [
        createElasticsearchClient(options.name),
        { provide: ELASTICSEARCH_MODULE_OPTIONS, useValue: options },
      ],
      exports: [getClientToken(options.name)],
    };
  }

  static registerAsync(options: ElasticsearchModuleAsyncOptions): DynamicModule {
    return {
      module: ElasticsearchModule,
      imports: options.imports || [],
      providers: [
        createElasticsearchClient(options.name),
        ...this.createAsyncProviders(options),
      ],
      exports: [getClientToken(options.name)],
    };
  }

  private static createAsyncProviders(options: ElasticsearchModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      { provide: options.useClass, useClass: options.useClass },
    ];
  }

  private static createAsyncOptionsProvider(options: ElasticsearchModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: ELASTICSEARCH_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: ELASTICSEARCH_MODULE_OPTIONS,
      useFactory: async (optionsFactory: ElasticsearchOptionsFactory) => await optionsFactory.createElasticsearchOptions(options.name),
      inject: [options.useExisting || options.useClass],
    };
  }

  // async onModuleDestroy() {
  //   const client = this.moduleRef.get<Client>(getClientToken(this.options.name));
  //   client && client.close();
  // }
}
