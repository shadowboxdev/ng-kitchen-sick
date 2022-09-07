import {
  CreateManyDto,
  CrudRequest,
  CrudRequestOptions,
  CrudService,
  GetManyDefaultResponse,
  JoinOption,
  JoinOptions,
  QueryOptions
} from '@nestjsx/crud';
import {
  ParsedRequestParams,
  QueryFilter,
  QueryJoin,
  QuerySort,
  SCondition,
  SConditionKey,
  ComparisonOperator
} from '@nestjsx/crud-request';
import { ClassType } from '@nestjsx/util';
import { oO } from '@zmotivat0r/o0';
import { plainToClass } from 'class-transformer';
import {
  addIndex,
  allPass,
  assoc,
  clone,
  equals,
  filter,
  find,
  forEach,
  has,
  head,
  isNil,
  join,
  keys,
  map,
  mergeAll,
  mergeRight,
  path,
  pathSatisfies,
  pluck,
  propEq,
  propSatisfies,
  reduce,
  slice,
  split,
  test
} from 'ramda';
import {
  compact,
  isArray,
  isNotArray,
  isNull,
  isObject,
  isTrue,
  isUndefined,
  lengthGt
} from 'ramda-adjunct';
import {
  Brackets,
  DeepPartial,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
  EntityMetadata,
  DataSourceOptions,
  WhereExpressionBuilder
} from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata';

interface IAllowedRelation {
  alias?: string;
  nested: boolean;
  name: string;
  path: string;
  columns: string[];
  primaryColumns: string[];
  allowedColumns: string[];
}

const hasLength = lengthGt(0);
const isArrayFull = allPass([isArray, hasLength]);

export class TypeOrmCrudService<
  T extends ObjectLiteral
> extends CrudService<T> {
  protected dbName!: DataSourceOptions['type'];

  protected entityColumns: string[] = [];

  protected entityPrimaryColumns: string[] = [];

  protected entityHasDeleteColumn: boolean = false;

  protected entityColumnsHash: ObjectLiteral = {};

  protected readonly entityRelationsHash = new Map<string, IAllowedRelation>();

  protected sqlInjectionRegEx: RegExp[] = [
    /(%27)|(')|(--)|(%23)|(#)/gi,
    /((%3D)|(=))[^\n]*((%27)|(')|(--)|(%3B)|(;))/gi,
    /w*((%27)|('))((%6F)|o|(%4F))((%72)|r|(%52))/gi,
    /((%27)|('))union/gi
  ];

  constructor(protected repo: Repository<T>) {
    super();

    this.dbName = this.repo.metadata.connection.options.type;
    this.onInitMapEntityColumns();
  }

  public get findOne(): Repository<T>['findOne'] {
    return this.repo.findOne.bind(this.repo);
  }

  public get findOneBy(): Repository<T>['findOneBy'] {
    return this.repo.findOneBy.bind(this.repo);
  }

  public get find(): Repository<T>['find'] {
    return this.repo.find.bind(this.repo);
  }

  public get count(): Repository<T>['count'] {
    return this.repo.count.bind(this.repo);
  }

  protected get entityType(): ClassType<T> {
    return this.repo.target as ClassType<T>;
  }

  protected get alias(): string {
    return this.repo.metadata.targetName;
  }

  /**
   * Get many
   * @param req
   */
  public async getMany(
    req: CrudRequest
  ): Promise<GetManyDefaultResponse<T> | T[]> {
    const { parsed, options } = req;
    const builder = await this.createBuilder(parsed, options);
    return this.doGetMany(builder, parsed, options);
  }

  /**
   * Get one
   * @param req
   */
  public async getOne(req: CrudRequest): Promise<T> {
    return this.getOneOrFail(req);
  }

  /**
   * Create one
   * @param req
   * @param dto
   */
  public async createOne(req: CrudRequest, dto: T | Partial<T>): Promise<T> {
    const { returnShallow } = req.options.routes!.createOneBase!;
    const entity = this.prepareEntityBeforeSave(dto, req.parsed);

    /* istanbul ignore if */
    if (!entity) this.throwBadRequestException('Empty data. Nothing to save.');

    const saved: T = await this.repo.save<DeepPartial<T>>(entity!);

    if (returnShallow) return saved;

    const primaryParams = this.getPrimaryParams(req.options) as (keyof T)[];

    /* istanbul ignore next */
    if (!primaryParams.length && primaryParams.some((p) => isNil(saved[p]))) {
      return saved;
    } else {
      req.parsed.search = primaryParams.reduce(
        (acc, p) => ({ ...acc, [p]: saved[p] }),
        {}
      );
      return this.getOneOrFail(req);
    }
  }

  /**
   * Create many
   * @param req
   * @param dto
   */
  public async createMany(
    req: CrudRequest,
    dto: CreateManyDto<T | Partial<T>>
  ): Promise<T[]> {
    /* istanbul ignore if */
    if (!isObject(dto) || !isArrayFull(dto.bulk)) {
      this.throwBadRequestException('Empty data. Nothing to save.');
    }

    const bulk: T[] = compact(
      map((one) => this.prepareEntityBeforeSave(one, req.parsed), dto.bulk)
    );

    /* istanbul ignore if */
    if (!bulk.length) {
      this.throwBadRequestException('Empty data. Nothing to save.');
    }

    return this.repo.save<T>(bulk, { chunk: 50 });
  }

  /**
   * Update one
   * @param req
   * @param dto
   */
  public async updateOne(req: CrudRequest, dto: T | Partial<T>): Promise<T> {
    const { allowParamsOverride, returnShallow } =
      req.options!.routes!.updateOneBase!;

    const paramsFilters = this.getParamFilters(req.parsed);
    const found = await this.getOneOrFail(req, returnShallow);
    const toSave = mergeAll([
      found,
      dto,
      !allowParamsOverride ? paramsFilters : {},
      req.parsed.authPersist
    ]);
    const updated = await this.repo.save(plainToClass(this.entityType, toSave));

    if (returnShallow) return updated;

    forEach((_filter) => {
      _filter.value = updated[_filter.field];
    }, req.parsed.paramsFilter);

    return this.getOneOrFail(req);
  }

  /**
   * Recover one
   * @param req
   * @param dto
   */
  public async recoverOne(req: CrudRequest): Promise<T> {
    const found = await this.getOneOrFail(req, false, true);

    return this.repo.recover(found);
  }

  /**
   * Replace one
   * @param req
   * @param dto
   */
  public async replaceOne(req: CrudRequest, dto: T | Partial<T>): Promise<T> {
    const { allowParamsOverride, returnShallow } =
      req.options!.routes!.replaceOneBase!;
    const paramsFilters = this.getParamFilters(req.parsed);
    const [_, found] = await oO(this.getOneOrFail(req, returnShallow));
    const toSave = !allowParamsOverride
      ? mergeAll([found ?? {}, dto, paramsFilters, req.parsed.authPersist])
      : mergeAll([found ?? {}, paramsFilters, dto, req.parsed.authPersist]);

    const replaced = await this.repo.save(
      plainToClass(this.entityType, toSave) as unknown as DeepPartial<T>
    );

    if (returnShallow) return replaced;

    const primaryParams = this.getPrimaryParams(req.options);

    /* istanbul ignore if */
    if (!primaryParams.length) return replaced;

    req.parsed.search = reduce(
      (acc, p) => assoc(p, replaced[p], acc),
      {},
      primaryParams
    );

    return this.getOneOrFail(req);
  }

  /**
   * Delete one
   * @param req
   */
  public async deleteOne(req: CrudRequest): Promise<void | T | undefined> {
    const { returnDeleted } = req.options!.routes!.deleteOneBase!;
    const found = await this.getOneOrFail(req, returnDeleted);
    const toReturn = plainToClass(this.entityType, clone(found));

    const deleted = pathSatisfies<boolean, CrudRequest>(
      isTrue,
      ['options', 'query', 'softDelete'],
      req
    );

    if (deleted) {
      await this.repo.softRemove(found);
    } else {
      await this.repo.remove(found);
    }

    return returnDeleted ? toReturn : undefined;
  }

  public getParamFilters(parsed: CrudRequest['parsed']): ObjectLiteral {
    const filters: ObjectLiteral = {};

    /* istanbul ignore else */
    if (!hasLength(parsed.paramsFilter)) return filters;

    for (const _filter of parsed.paramsFilter) {
      filters[_filter.field] = _filter.value;
    }

    return filters;
  }

  /**
   * Create TypeOrm QueryBuilder
   * @param parsed
   * @param options
   * @param many
   */
  public async createBuilder(
    parsed: ParsedRequestParams,
    options: CrudRequestOptions,
    many = true,
    withDeleted = false
  ): Promise<SelectQueryBuilder<T>> {
    const { query } = options;
    // create query builder
    const builder = this.repo.createQueryBuilder(this.alias);
    // get select fields
    const select = this.getSelect(parsed, query!);
    // select fields
    builder.select(select);

    // search
    this.setSearchCondition(builder, parsed.search);

    // set joins
    const joinOptions = query!.join || {};
    const allowedJoins = keys(joinOptions);

    if (hasLength(allowedJoins)) {
      const eagerJoins: ObjectLiteral = {};

      for (let i = 0; i < allowedJoins.length; i++) {
        /* istanbul ignore else */
        if (joinOptions[allowedJoins[i]].eager) {
          const cond =
            find((j) => j && j.field === allowedJoins[i], parsed.join) ||
            ({
              field: allowedJoins[i]
            } as QueryJoin);
          this.setJoin(cond, joinOptions, builder);
          eagerJoins[allowedJoins[i]] = true;
        }
      }

      if (isArrayFull(parsed.join)) {
        for (let i = 0; i < parsed.join.length; i++) {
          /* istanbul ignore else */
          if (!eagerJoins[parsed.join[i].field]) {
            this.setJoin(parsed.join[i], joinOptions, builder);
          }
        }
      }
    }

    // if soft deleted is enabled add where statement to filter deleted records
    if (this.entityHasDeleteColumn && query!.softDelete) {
      if (parsed.includeDeleted === 1 || withDeleted) {
        builder.withDeleted();
      }
    }

    /* istanbul ignore else */
    if (many) {
      // set sort (order by)
      const sort = this.getSort(parsed, query!);
      builder.orderBy(sort);

      // set take
      const take = this.getTake(parsed, query!)!;
      /* istanbul ignore else */
      if (isFinite(take)) builder.take(take!);

      // set skip
      const skip = this.getSkip(parsed, take)!;
      /* istanbul ignore else */
      if (isFinite(skip)) builder.skip(skip);
    }

    // set cache
    /* istanbul ignore else */
    if (query!.cache && parsed.cache !== 0) {
      builder.cache(builder.getQueryAndParameters(), query!.cache);
    }

    return builder;
  }

  /**
   * depends on paging call `SelectQueryBuilder#getMany` or `SelectQueryBuilder#getManyAndCount`
   * helpful for overriding `TypeOrmCrudService#getMany`
   * @see getMany
   * @see SelectQueryBuilder#getMany
   * @see SelectQueryBuilder#getManyAndCount
   * @param builder
   * @param query
   * @param options
   */
  protected async doGetMany(
    builder: SelectQueryBuilder<T>,
    query: ParsedRequestParams,
    options: CrudRequestOptions
  ): Promise<GetManyDefaultResponse<T> | T[]> {
    if (this.decidePagination(query, options)) {
      const [data, total] = await builder.getManyAndCount();
      const limit = builder.expressionMap.take;
      const offset = builder.expressionMap.skip;

      return this.createPageInfo(data, total, limit || total, offset || 0);
    }

    return builder.getMany();
  }

  protected onInitMapEntityColumns(): void {
    this.entityColumns = map(
      ({ embeddedMetadata, databasePath, propertyName, propertyPath }) => {
        // In case column is an embedded, use the propertyPath to get complete path
        if (embeddedMetadata) {
          this.entityColumnsHash[propertyPath] = databasePath;
          return propertyPath;
        }

        this.entityColumnsHash = assoc(
          propertyName,
          databasePath,
          this.entityColumnsHash
        );

        return propertyName;
      },
      this.repo.metadata.columns
    );

    const getPrimaryColumns = filter(propSatisfies(isTrue, 'isPrimary'));
    const getDeletedColumns = filter(propSatisfies(isTrue, 'isDeleteDate'));

    this.entityPrimaryColumns = pluck<'propertyName', ColumnMetadata>(
      'propertyName',
      getPrimaryColumns(this.repo.metadata.columns)
    );
    this.entityHasDeleteColumn =
      getDeletedColumns(this.repo.metadata.columns).length > 0;
  }

  protected async getOneOrFail(
    req: CrudRequest,
    shallow = false,
    withDeleted = false
  ): Promise<T> {
    const { parsed, options } = req;
    const builder = shallow
      ? this.repo.createQueryBuilder(this.alias)
      : await this.createBuilder(parsed, options, true, withDeleted);

    if (shallow) this.setSearchCondition(builder, parsed.search);

    const found: T = (
      withDeleted
        ? await builder.withDeleted().getOne()
        : await builder.getOne()
    )!;

    if (!found) this.throwNotFoundException(this.alias);

    return found;
  }

  protected prepareEntityBeforeSave(
    dto: T | Partial<T>,
    parsed: CrudRequest['parsed']
  ): T | undefined {
    /* istanbul ignore if */
    if (!isObject(dto)) return;

    if (hasLength(parsed.paramsFilter)) {
      for (const { field, value } of parsed.paramsFilter) {
        dto = assoc(field, value, dto) as T | Partial<T>;
      }
    }

    /* istanbul ignore if */
    if (!hasLength(keys(dto))) return;

    return dto instanceof this.entityType
      ? (mergeRight(dto, parsed.authPersist) as T)
      : plainToClass(this.entityType, { ...dto, ...parsed.authPersist });
  }

  protected getAllowedColumns(
    columns: string[],
    options: QueryOptions
  ): string[] {
    return (!options.exclude || !options.exclude.length) &&
      (!options.allow || /* istanbul ignore next */ !options.allow.length)
      ? columns
      : filter(
          (column) =>
            (options.exclude && options.exclude.length
              ? !options.exclude.some(equals(column))
              : /* istanbul ignore next */ true) &&
            (options.allow && options.allow.length
              ? options.allow.some(equals(column))
              : /* istanbul ignore next */ true),
          columns
        );
  }

  protected getEntityColumns(entityMetadata: EntityMetadata): {
    columns: string[];
    primaryColumns: string[];
  } {
    const getPropertyPath = pluck('propertyPath');

    const columns = getPropertyPath(entityMetadata.columns) ?? [];
    const primaryColumns = getPropertyPath(entityMetadata.primaryColumns) ?? [];

    return { columns, primaryColumns };
  }

  protected getRelationMetadata(
    field: string,
    options: JoinOption
  ): IAllowedRelation | undefined | null {
    try {
      let allowedRelation: Partial<IAllowedRelation> | null = null;
      let nested: boolean = false;

      if (has(field, this.entityRelationsHash)) {
        allowedRelation = this.entityRelationsHash.get(field) ?? null;
      } else {
        const fields = split('.', field);
        let relationMetadata: EntityMetadata | null = null;
        let name: string = '';
        let _path: string = '';
        let parentPath: string | null = null;

        if (fields.length === 1) {
          const found = this.repo.metadata.relations.find(
            (one) => one.propertyName === fields[0]
          );

          if (found) {
            name = fields[0];
            _path = `${this.alias}.${fields[0]}`;
            relationMetadata = found.inverseEntityMetadata;
          }
        } else {
          nested = true;
          parentPath = '';
          const reduceIndexed = addIndex<
            string,
            {
              relations: RelationMetadata[];
              relationMetadata: EntityMetadata | null;
            }
          >(reduce);

          const reduced = reduceIndexed(
            (res, propertyName, i) => {
              const found: RelationMetadata | null | undefined = res.relations
                .length
                ? (find(
                    propEq('propertyName', propertyName),
                    res.relations
                  ) as RelationMetadata)
                : null;
              relationMetadata = found?.inverseEntityMetadata ?? null;
              const relations = relationMetadata
                ? relationMetadata.relations
                : [];
              name = propertyName;

              if (i !== fields.length - 1) {
                parentPath = !parentPath
                  ? propertyName
                  : /* istanbul ignore next */ `${parentPath}.${propertyName}`;
              }

              return {
                relations,
                relationMetadata
              };
            },
            {
              relations: this.repo.metadata.relations,
              relationMetadata: null
            },
            fields
          );

          relationMetadata = reduced.relationMetadata;
        }

        if (relationMetadata) {
          const { columns, primaryColumns } =
            this.getEntityColumns(relationMetadata);

          if (!_path && parentPath) {
            const parentAllowedRelation =
              this.entityRelationsHash.get(parentPath);

            /* istanbul ignore next */
            if (parentAllowedRelation) {
              _path = parentAllowedRelation.alias
                ? `${parentAllowedRelation.alias}.${name}`
                : field;
            }
          }

          allowedRelation = {
            alias: options.alias,
            name,
            path: _path,
            columns,
            nested,
            primaryColumns
          };
        }
      }

      if (allowedRelation) {
        const allowedColumns = this.getAllowedColumns(
          allowedRelation.columns!,
          options
        );
        const toSave = {
          ...allowedRelation,
          allowedColumns
        } as IAllowedRelation;

        this.entityRelationsHash.set(field, toSave);

        if (options.alias) {
          this.entityRelationsHash.set(options.alias, toSave);
        }

        return toSave;
      }
    } catch (_) {
      /* istanbul ignore next */
      return null;
    }

    return null;
  }

  protected setJoin(
    cond: QueryJoin,
    joinOptions: JoinOptions,
    builder: SelectQueryBuilder<T>
  ): boolean {
    const options = joinOptions[cond.field];

    if (!options) return true;

    const allowedRelation = this.getRelationMetadata(cond.field, options);

    if (!allowedRelation) return true;

    const relationType = options.required ? 'innerJoin' : 'leftJoin';
    const alias = options.alias ? options.alias : allowedRelation.name;

    builder[relationType](allowedRelation.path, alias);

    if (options.select !== false) {
      const columns = isArrayFull(cond.select!)
        ? filter(
            (column) =>
              allowedRelation.allowedColumns.some(
                (allowed) => allowed === column
              ),
            cond.select!
          )
        : allowedRelation.allowedColumns;

      const select = map(
        (col) => `${alias}.${col}`,
        [
          ...allowedRelation.primaryColumns,
          ...(isArrayFull(options.persist ?? []) ? options.persist! : []),
          ...columns
        ]
      );

      builder.addSelect(select);
    }

    return false;
  }

  protected setAndWhere(
    cond: QueryFilter,
    i: string | number,
    builder: SelectQueryBuilder<T> | WhereExpressionBuilder
  ): void {
    const { str, params } = this.mapOperatorsToQuery(cond, `andWhere${i}`);
    builder.andWhere(str, params);
  }

  protected setOrWhere(
    cond: QueryFilter,
    i: string | number,
    builder: SelectQueryBuilder<T> | WhereExpressionBuilder
  ): void {
    const { str, params } = this.mapOperatorsToQuery(cond, `orWhere${i}`);
    builder.orWhere(str, params);
  }

  protected setSearchCondition(
    builder: SelectQueryBuilder<T> | WhereExpressionBuilder,
    search: SCondition,
    condition: SConditionKey = '$and'
  ): void {
    /* istanbul ignore else */
    if (isObject(search)) {
      const _keys = keys(search);
      /* istanbul ignore else */
      if (_keys.length) {
        // search: {$and: [...], ...}
        if (isArrayFull(search.$and ?? [])) {
          // search: {$and: [{}]}
          if (search.$and!.length === 1) {
            this.setSearchCondition(builder, head(search.$and!)!, condition);
          }
          // search: {$and: [{}, {}, ...]}
          else {
            this.builderAddBrackets(
              builder,
              condition,
              new Brackets((qb) => {
                forEach((item) => {
                  this.setSearchCondition(qb, item, '$and');
                }, search.$and!);
              })
            );
          }
        }
        // search: {$or: [...], ...}
        else if (isArrayFull(search.$or ?? [])) {
          // search: {$or: [...]}
          if (_keys.length === 1) {
            // search: {$or: [{}]}
            if (search.$or!.length === 1) {
              this.setSearchCondition(builder, head(search.$or!)!, condition);
            }
            // search: {$or: [{}, {}, ...]}
            else {
              this.builderAddBrackets(
                builder,
                condition,
                new Brackets((qb) => {
                  forEach((item) => {
                    this.setSearchCondition(qb, item, '$or');
                  }, search.$or!);
                })
              );
            }
          }
          // search: {$or: [...], foo, ...}
          else {
            this.builderAddBrackets(
              builder,
              condition,
              new Brackets((qb) => {
                forEach((field: string) => {
                  if (field !== '$or') {
                    const value = path([field], search);
                    if (!isObject(value)) {
                      this.builderSetWhere(qb, '$and', field, value);
                    } else {
                      this.setSearchFieldObjectCondition(
                        qb,
                        '$and',
                        field,
                        value as SCondition
                      );
                    }
                  } else {
                    if (search.$or?.length === 1) {
                      this.setSearchCondition(
                        builder,
                        head(search.$or)!,
                        '$and'
                      );
                    } else {
                      this.builderAddBrackets(
                        qb,
                        '$and',
                        new Brackets((qb2) => {
                          forEach((item) => {
                            this.setSearchCondition(qb2, item, '$or');
                          }, search.$or!);
                        })
                      );
                    }
                  }
                }, _keys);
              })
            );
          }
        }
        // search: {...}
        else {
          // search: {foo}
          if (_keys.length === 1) {
            const field = head(_keys)!;
            const value = search[field];
            if (!isObject(value)) {
              this.builderSetWhere(builder, condition, field, value);
            } else {
              this.setSearchFieldObjectCondition(
                builder,
                condition,
                field,
                value as SCondition
              );
            }
          }
          // search: {foo, ...}
          else {
            this.builderAddBrackets(
              builder,
              condition,
              new Brackets((qb) => {
                forEach((field: string) => {
                  const value = path([field], search);
                  if (!isObject(value)) {
                    this.builderSetWhere(qb, '$and', field, value);
                  } else {
                    this.setSearchFieldObjectCondition(
                      qb,
                      '$and',
                      field,
                      value as SCondition
                    );
                  }
                }, _keys);
              })
            );
          }
        }
      }
    }
  }

  protected builderAddBrackets(
    builder: SelectQueryBuilder<T> | WhereExpressionBuilder,
    condition: SConditionKey,
    brackets: Brackets
  ): void {
    if (condition === '$and') {
      builder.andWhere(brackets);
    } else {
      builder.orWhere(brackets);
    }
  }

  protected builderSetWhere(
    builder: SelectQueryBuilder<T> | WhereExpressionBuilder,
    condition: SConditionKey,
    field: string,
    value: unknown,
    operator: ComparisonOperator = '$eq'
  ): void {
    const time = process.hrtime();
    const index = `${field}${time[0]}${time[1]}`;
    const queryFilter: QueryFilter = {
      field,
      operator: isNull(value) ? '$isnull' : operator,
      value
    };

    const args = [queryFilter, index, builder];

    if (condition === '$and') {
      this.setAndWhere(queryFilter, index, builder);
    } else {
      this.setOrWhere(queryFilter, index, builder);
    }
  }

  protected setSearchFieldObjectCondition(
    builder: SelectQueryBuilder<T> | WhereExpressionBuilder,
    condition: SConditionKey,
    field: string,
    object: SCondition
  ): void {
    /* istanbul ignore else */
    if (isObject(object)) {
      const operators: SConditionKey[] = keys(object);

      if (operators.length === 1) {
        const operator = head(operators) as SConditionKey;
        const value = object[operator];

        if (isObject(object.$or)) {
          const orKeys = keys(object.$or);
          this.setSearchFieldObjectCondition(
            builder,
            orKeys.length === 1 ? condition : '$or',
            field,
            object.$or as SCondition
          );
        } else {
          this.builderSetWhere(builder, condition, field, value, operator);
        }
      } else {
        /* istanbul ignore else */
        if (operators.length > 1) {
          this.builderAddBrackets(
            builder,
            condition,
            new Brackets((qb) => {
              forEach((operator: SConditionKey) => {
                const value = object[operator];

                if (operator !== '$or') {
                  this.builderSetWhere(qb, condition, field, value, operator);
                } else {
                  const orKeys = keys(object.$or);

                  if (orKeys.length === 1) {
                    this.setSearchFieldObjectCondition(
                      qb,
                      condition,
                      field,
                      object.$or as SCondition
                    );
                  } else {
                    this.builderAddBrackets(
                      qb,
                      condition,
                      new Brackets((qb2) => {
                        this.setSearchFieldObjectCondition(
                          qb2,
                          '$or',
                          field,
                          object.$or as SCondition
                        );
                      })
                    );
                  }
                }
              }, operators);
            })
          );
        }
      }
    }
  }

  protected getSelect(
    query: ParsedRequestParams,
    options: QueryOptions
  ): string[] {
    const allowed = this.getAllowedColumns(this.entityColumns, options);

    const columns =
      query.fields && query.fields.length
        ? query.fields.filter((field) => allowed.some((col) => field === col))
        : allowed;

    const select = [
      ...(options.persist && options.persist.length ? options.persist : []),
      ...columns,
      ...this.entityPrimaryColumns
    ].map((col) => `${this.alias}.${col}`);

    return select;
  }

  protected getSort(
    query: ParsedRequestParams,
    options: QueryOptions
  ): ObjectLiteral {
    return query.sort && query.sort.length
      ? this.mapSort(query.sort)
      : options.sort && options.sort.length
      ? this.mapSort(options.sort)
      : {};
  }

  protected getFieldWithAlias(field: string, sort: boolean = false): string {
    /* istanbul ignore next */
    const i = this.dbName === 'mysql' ? '`' : '"';
    const cols = split('.', field);

    switch (cols.length) {
      case 1: {
        if (sort) return `${this.alias}.${field}`;

        const dbColName: string =
          this.entityColumnsHash[field] !== field
            ? this.entityColumnsHash[field]
            : field;

        return `${i}${this.alias}${i}.${i}${dbColName}${i}`;
      }
      case 2: {
        return field;
      }
      default: {
        return join('.', slice(cols.length - 2, cols.length, cols));
      }
    }
  }

  protected mapSort(sort: QuerySort[]): ObjectLiteral {
    const params: ObjectLiteral = {};

    for (let i = 0; i < sort.length; i++) {
      const field = this.getFieldWithAlias(sort[i].field, true);
      const checkedFiled = this.checkSqlInjection(field);
      params[checkedFiled] = sort[i].order;
    }

    return params;
  }

  protected mapOperatorsToQuery(
    cond: QueryFilter,
    param: string
  ): { str: string; params: ObjectLiteral } {
    const field = this.getFieldWithAlias(cond.field);
    const likeOperator =
      this.dbName === 'postgres' ? 'ILIKE' : /* istanbul ignore next */ 'LIKE';
    let str: string | null = null;
    let params: ObjectLiteral | null = null;

    if (cond.operator[0] !== '$') {
      cond.operator = ('$' + cond.operator) as ComparisonOperator;
    }

    switch (cond.operator) {
      case '$eq':
        str = `${field} = :${param}`;
        break;

      case '$ne':
        str = `${field} != :${param}`;
        break;

      case '$gt':
        str = `${field} > :${param}`;
        break;

      case '$lt':
        str = `${field} < :${param}`;
        break;

      case '$gte':
        str = `${field} >= :${param}`;
        break;

      case '$lte':
        str = `${field} <= :${param}`;
        break;

      case '$starts':
        str = `${field} LIKE :${param}`;
        params = { [param]: `${cond.value}%` };
        break;

      case '$ends':
        str = `${field} LIKE :${param}`;
        params = { [param]: `%${cond.value}` };
        break;

      case '$cont':
        str = `${field} LIKE :${param}`;
        params = { [param]: `%${cond.value}%` };
        break;

      case '$excl':
        str = `${field} NOT LIKE :${param}`;
        params = { [param]: `%${cond.value}%` };
        break;

      case '$in':
        this.checkFilterIsArray(cond);
        str = `${field} IN (:...${param})`;
        break;

      case '$notin':
        this.checkFilterIsArray(cond);
        str = `${field} NOT IN (:...${param})`;
        break;

      case '$isnull':
        str = `${field} IS NULL`;
        params = {};
        break;

      case '$notnull':
        str = `${field} IS NOT NULL`;
        params = {};
        break;

      case '$between':
        this.checkFilterIsArray(cond, cond.value.length !== 2);
        str = `${field} BETWEEN :${param}0 AND :${param}1`;
        params = {
          [`${param}0`]: cond.value[0],
          [`${param}1`]: cond.value[1]
        };
        break;

      // case insensitive
      case '$eqL':
        str = `LOWER(${field}) = :${param}`;
        break;

      case '$neL':
        str = `LOWER(${field}) != :${param}`;
        break;

      case '$startsL':
        str = `LOWER(${field}) ${likeOperator} :${param}`;
        params = { [param]: `${cond.value}%` };
        break;

      case '$endsL':
        str = `LOWER(${field}) ${likeOperator} :${param}`;
        params = { [param]: `%${cond.value}` };
        break;

      case '$contL':
        str = `LOWER(${field}) ${likeOperator} :${param}`;
        params = { [param]: `%${cond.value}%` };
        break;

      case '$exclL':
        str = `LOWER(${field}) NOT ${likeOperator} :${param}`;
        params = { [param]: `%${cond.value}%` };
        break;

      case '$inL':
        this.checkFilterIsArray(cond);
        str = `LOWER(${field}) IN (:...${param})`;
        break;

      case '$notinL':
        this.checkFilterIsArray(cond);
        str = `LOWER(${field}) NOT IN (:...${param})`;
        break;

      /* istanbul ignore next */
      default:
        str = `${field} = :${param}`;
        break;
    }

    if (isUndefined(params)) {
      params = { [param]: cond.value };
    }

    return { str, params: params! };
  }

  private checkFilterIsArray(cond: QueryFilter, withLength?: boolean): void {
    /* istanbul ignore if */
    if (
      isNotArray(cond.value) ||
      !cond.value.length ||
      (!isNil(withLength) ? withLength : false)
    ) {
      this.throwBadRequestException(`Invalid column '${cond.field}' value`);
    }
  }

  private checkSqlInjection(field: string): string {
    /* istanbul ignore else */
    if (!this.sqlInjectionRegEx.length) return field;

    for (let i = 0; i < this.sqlInjectionRegEx.length; i++) {
      /* istanbul ignore else */
      if (test(head(this.sqlInjectionRegEx)!, field)) {
        this.throwBadRequestException(`SQL injection detected: "${field}"`);
      }
    }

    return field;
  }
}
