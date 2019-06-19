import { ElasticsearchService } from './elasticsearch.service';

export class ElasticsearchIndexService<T> {

  constructor(readonly elasticsearch: ElasticsearchService<T>) {}

  async hasIndex(): Promise<boolean> {
    return await this.elasticsearch.hasIndex();
  }

  async getIndexStats(): Promise<boolean> {
    return await this.elasticsearch.getIndexStats();
  }

  async createIndex(): Promise<any> {
    return await this.elasticsearch.createIndex();
  }

  async updateIndex(): Promise<any> {
    return await this.elasticsearch.updateIndex();
  }

  async deleteIndex(): Promise<any> {
    return await this.elasticsearch.deleteIndex();
  }
}
