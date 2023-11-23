export type SimpleDynamoType =
  | 'string'
  | 'string set'
  | 'number'
  | 'number set'
  | 'binary set'
  | 'binary'
  | 'boolean'
  | 'null'
  | 'list'
  | 'map'

type ValidKeyTypes = string | number | Buffer;

export type ValidKeys<T> = T extends Record<string, any> ? { [K in keyof T]: T[K] extends ValidKeyTypes ? K : never}[keyof T] : never;

class TableDefinitionBuilder<T> {
  withPartitionKey<K extends ValidKeys<T>>(partitionKey: K): TableDefinition<T, {partitionKey: K }> {
    return new TableDefinition<T, { partitionKey: K }>({partitionKey}, {});
  }
}

class IndexDefinitionBuilder<T, KEYS extends DynamoTableKeyConfig<T>, INDEXES extends Record<string, { global: boolean } & DynamoTableKeyConfig<T>>, K extends keyof INDEXES> {

  constructor(private readonly tableDefinition: TableDefinition<T,KEYS, INDEXES>, private readonly index: K) {
  }

  withNoSortKey(): TableDefinition<T, KEYS, INDEXES> {
    return this.tableDefinition
  }

  withSortKey<SK extends ValidKeys<T>>(sortKey: SK): TableDefinition<T, KEYS, INDEXES & { [KK in K]: INDEXES[K] & { sortKey: SK }}> {
    return new TableDefinition(this.tableDefinition.keyNames, {...this.tableDefinition.indexes, [this.index]: {...this.tableDefinition.indexes[this.index], sortKey }})
  }
}

type PartitionAndSort<T, KEYS extends DynamoTableKeyConfig<T>> =
  KEYS extends { sortKey: infer S, partitionKey: infer K } ? K | S : KEYS['partitionKey'];

export class TableDefinition<T = any, KEYS extends DynamoTableKeyConfig<T> = any, INDEXES extends Record<string, { global: boolean } & DynamoTableKeyConfig<T>> = {}> {

  type: T = undefined as unknown as T;
  keys: Pick<T, PartitionAndSort<T, KEYS>> = undefined as unknown as any;
  withoutKeys: Omit<T, PartitionAndSort<T, KEYS>> = undefined as unknown as any;

  constructor(public readonly keyNames: KEYS, public readonly indexes: INDEXES) {
  }

  asIndex<I extends keyof INDEXES>(index: I): TableDefinition<T, INDEXES[I]> {
    return new TableDefinition<T, INDEXES[I]>(this.indexes[index], {});
  }

  withSortKey<K extends Exclude<ValidKeys<T>, KEYS['partitionKey']>>(sortKey: K): TableDefinition<T, { partitionKey: KEYS['partitionKey'], sortKey: K}, INDEXES> {
    return new TableDefinition<T, { partitionKey: KEYS['partitionKey'], sortKey: K}, INDEXES>({ ...this.keyNames, sortKey }, this.indexes);
  }

  withGlobalSecondaryIndex<K extends string, PK extends ValidKeys<T>>(name: K, partitionKey: PK): IndexDefinitionBuilder<T, KEYS, INDEXES & { [KK in K]: { partitionKey: PK, global: true }}, K> {
    return new IndexDefinitionBuilder<T, KEYS, INDEXES & { [KK in K]: { partitionKey: PK, global: true }}, K>(
      new TableDefinition(this.keyNames, {...this.indexes, [name]: { global: true, partitionKey }}), name
    )
  }

  withLocalSecondaryIndex<K extends string, PK extends ValidKeys<T>>(name: K, partitionKey: PK): IndexDefinitionBuilder<T, KEYS, INDEXES & { [KK in K]: { partitionKey: PK, global: false }}, K> {
    return new IndexDefinitionBuilder<T, KEYS, INDEXES & { [KK in K]: { partitionKey: PK, global: false }}, K>(
      new TableDefinition(this.keyNames, {...this.indexes, [name]: { global: false, partitionKey }}), name
    )
  }

  static ofType<T>(): TableDefinitionBuilder<T> {
    return new TableDefinitionBuilder();
  }
}

export type DynamoTableKeyConfig<T> = {
  partitionKey: ValidKeys<T>
  sortKey?: ValidKeys<T>
}