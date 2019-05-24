<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" />
  </a>
</p>

<p align="center">
  A Elasticsearch integration module for Nest.js framework.
</p>

### Installation

**Yarn**
```bash
yarn add @mobizerg/nest-elasticsearch @elastic/elasticsearch@7
```

**NPM**
```bash
npm install @mobizerg/nest-elasticsearch @elastic/elasticsearch@7 --save
```

### Description
Elasticsearch integration module for [Nest.js](https://github.com/nestjs/nest) based on the [Elasticsearch](https://github.com/elastic/elasticsearch-js) package.

### Usage

Import the **ElasticsearchModule** in `app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@mobizerg/nest-elasticsearch';

@Module({
    imports: [
        ElasticsearchModule.register(options)
    ],
})
export class AppModule {}
```
With Async
```typescript
import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@mobizerg/nest-elasticsearch';

@Module({
    imports: [
        ElasticsearchModule.registerAsync({
            imports: [ConfigModule],
            useExisting: ElasticsearchConfigService,
        }),
    ],
})
export class AppModule {}
```

Example config file (async)
```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ElasticsearchModuleOptions, ElasticsearchOptionsFactory } from '@mobizerg/nest-elasticsearch';

@Injectable()
export class ElasticsearchConfigService implements ElasticsearchOptionsFactory {

  constructor(private readonly config: ConfigService) {}

  createElasticsearchOptions(name?: string): ElasticsearchModuleOptions {
      
    return {
      name,
      node: 'http://localhost:9200',
      maxRetries: 3,
      requestTimeout: 60000,
    };
  }
}
```

Importing inside services
```typescript
import { Injectable } from '@nestjs/common';
import { ElasticsearchService, InjectClient } from '@mobizerg/nest-elasticsearch';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class SearchService extends ElasticsearchService<T> {

  constructor(@InjectClient()
              readonly client: Client) {
    
    super(client, {
      index: 'tag',
      settings: {
        number_of_shards: 1,
        number_of_replicas: 0,
        refresh_interval: '2s',
        analysis: {
          analyzer: {
            autocomplete: {
              tokenizer: 'autocomplete',
              filter: ['trim', 'lowercase'],
            },
            autocomplete_search: {
              tokenizer: 'lowercase',
              filter: ['trim'],
            },
          },
          tokenizer: {
            autocomplete: {
              type: 'edge_ngram',
              min_gram: 2,
              max_gram: 12,
              token_chars: ['letter', 'digit'],
            },
          },
        },
      },
      properties: {
        id: { type: 'integer' },
        tag: { type: 'text', analyzer: 'autocomplete', search_analyzer: 'autocomplete_search' },
        status: { type: 'byte' },
      },
    });
  }

  async find(query: string): Promise<any> {
    try {
      const { body } = await this.client.search({
        index: this.config.index,
        body: {
          _source: ['id'],
          from: 1,
          size: 15,
          query: {
            bool: {
              must: {
                match: {
                  tag: {
                    query,
                    minimum_should_match: '80%',
                  },
                },
              },
            },
          },
        },
      });
      return body;
    } catch (error) {
      return false;
    }
  }
}
```

### License

MIT
