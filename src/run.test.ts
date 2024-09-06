import { Entity, Property, ReflectMetadataProvider, Unique } from '@mikro-orm/core';
import { defineConfig, MikroORM } from '@mikro-orm/postgresql';
import { PostgresMock } from 'pgmock';
import { expect, test } from 'vitest';
import { StandardBaseEntity } from '@/entity/StandardBaseEntity';
import { runMain } from '@/main';

test('run', async () => {
  await runMain();
});

test(
  'pgmock',
  {
    timeout: Infinity,
  },
  async () => {
    @Entity({ tableName: 'demo' })
    // @Unique({ properties: ['tid', 'eid'] })
    class DemoEntity extends StandardBaseEntity {
      @Property({ type: 'string' })
      displayName!: string;
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
              id           text        not null default 'demo_' || public.gen_ulid() primary key,
              uid          uuid        not null default gen_random_uuid() unique,
              created_at   timestamptz not null default current_timestamp,
              updated_at   timestamptz not null default current_timestamp,
              deleted_at   timestamptz,
              tid          text        not null default public.current_tenant_id(),
              eid          text,

              display_name text        not null,

              unique (tid, eid)
          );
      `,
    ];

    for (let s of sql) {
      await em.execute(s);
    }

    let demo = await em.upsert(DemoEntity, { eid: '1', displayName: 'Hello' });
    await em.upsert(DemoEntity, { eid: '2', displayName: 'Hi' });
    await em.upsert(
      DemoEntity,
      {
        id: demo.id,
        uid: demo.uid,
        tid: demo.tid,
        eid: '2',
        displayName: 'World',
      },
      {
        onConflictAction: 'ignore',
      },
    );

    expect(await em.getRepository(DemoEntity).count()).toBe(2);
  },
);
