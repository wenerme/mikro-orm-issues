import { Entity, Property, ReflectMetadataProvider, types, Unique } from '@mikro-orm/core';
import { defineConfig, MikroORM } from '@mikro-orm/postgresql';
import { PostgresMock } from 'pgmock';
import { StandardBaseEntity } from '@/entity/StandardBaseEntity';

@Entity({ tableName: 'demo' })
@Unique({ properties: ['tid', 'eid'] })
@Unique({ properties: ['tid', 'hash'] })
class DemoEntity extends StandardBaseEntity {
  @Property({ type: types.string })
  md5?: string;
  @Property({ type: types.string })
  sha256?: string;

  @Property({ type: types.string, persist: false })
  hash!: string;
}

const mock = await PostgresMock.create({});

const clientUrl = await mock.listen(5432);
const orm = await MikroORM.init(
  defineConfig({
    clientUrl,
    dbName: 'postgres',
    entities: [DemoEntity],
    forceUndefined: true,
    debug: true,
    discovery: {
      disableDynamicFileAccess: true,
      requireEntitiesArray: true,
    },
    metadataProvider: ReflectMetadataProvider,
  }),
);

let em = orm.em.fork();

const sql = [
  `CREATE EXTENSION pgcrypto;`,
  `create or replace function public.gen_ulid() returns text as $$
begin
    return gen_random_uuid()::text;
end;
$$ language plpgsql`,
  `create or replace function public.current_tenant_id() returns text as $$
begin
    return 'org_0';
end;
$$ language plpgsql`,
  `
      create table if not exists demo
      (
          id         text        not null default 'demo_' || public.gen_ulid() primary key,
          uid        uuid        not null default gen_random_uuid() unique,
          created_at timestamptz not null default current_timestamp,
          updated_at timestamptz not null default current_timestamp,
          deleted_at timestamptz,
          tid        text        not null default public.current_tenant_id(),
          eid        text,

          md5        text,
          sha256     text,
          hash       text        not null generated always as ( coalesce(sha256, md5) ) stored,

          unique (tid, eid),
          unique (tid, hash)
      );
  `,
];

for (let s of sql) {
  await em.execute(s);
}

await em.upsert(
  DemoEntity,
  { md5: 'md5', sha256: 'sha256' },
  {
    onConflictAction: 'ignore',
  },
);
await em.upsert(
  DemoEntity,
  { md5: 'md5', sha256: 'sha256' },
  {
    onConflictAction: 'ignore',
  },
);
