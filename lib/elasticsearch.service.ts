import { Logger } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { ElasticsearchIndexConfig, BulkIndexId } from './interfaces';

export class ElasticsearchService<T> {

  constructor(readonly client: Client,
              readonly config: ElasticsearchIndexConfig<T>) {}

  async hasIndex(): Promise<boolean> {
    try {
      const { statusCode } = await this.client.indices.exists({
        index: this.config.index,
      });
      return statusCode === 200;
    } catch (error) {
      Logger.error(error.message, error.stack);
      return false;
    }
  }

  async createIndex(): Promise<any> {
    try {
      const { body } = await this.client.indices.create({
        index: this.config.index,
        body: {
          settings: this.config.settings,
          mappings: {
            properties: this.config.properties,
          },
        },
      });
      return body;
    } catch (error) {
      Logger.error(error.message, error.stack);
      return false;
    }
  }

  async updateIndex(): Promise<any> {
    try {
      const { body } = await this.client.indices.putMapping({
        index: this.config.index,
        body: {
          properties: this.config.properties,
        },
      });
      return body;
    } catch (error) {
      Logger.error(error.message, error.stack);
      return false;
    }
  }

  async deleteIndex(): Promise<any> {
    try {
      const { body } = await this.client.indices.delete({
        index: this.config.index,
      });
      return body;
    } catch (error) {
      Logger.error(error.message, error.stack);
      return false;
    }
  }

  // Documents

  async indexDocument(id: number, document: Partial<T>): Promise<any> {
    try {
      const { body } = await this.client.index({
        index: this.config.index,
        body: document,
        id: `${id}`,
      });
      return body;
    } catch (error) {
      Logger.error(error.message, error.stack);
      return false;
    }
  }

  async bulkIndexDocuments(documents: Array<BulkIndexId | Partial<T>>): Promise<any> {
    try {
      const { body } = await this.client.bulk({
        index: this.config.index,
        body: documents,
      });
      return body;
    } catch (error) {
      Logger.error(error.message, error.stack);
      return false;
    }
  }

  async deleteDocument(id: number): Promise<any> {
    try {
      const { body } = await this.client.delete({
        index: this.config.index,
        id: `${id}`,
      });
      return body;
    } catch (error) {
      Logger.error(error.message, error.stack);
      return false;
    }
  }
}
