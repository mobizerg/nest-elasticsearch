export interface ElasticsearchIndexConfig<T> {
  readonly index: string;
  readonly settings: any;
  readonly properties: { [P in keyof T]?: any };
}
