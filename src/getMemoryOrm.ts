import { MikroORM, ReflectMetadataProvider } from '@mikro-orm/core';
import { defineConfig } from '@mikro-orm/sqlite';
import { AuthorEntity } from '@/entity/AuthorEntity';
import { BookEntity } from '@/entity/BookEntity';
import { Test1Entity, Test2Entity } from '@/entity/Test2Entity';

export async function getMemoryOrm(opts: {} = {}) {
  const orm = await MikroORM.init(
    defineConfig({
      entities: [AuthorEntity, BookEntity, Test1Entity, Test2Entity],
      dbName: ':memory:',
      // dbName: 'test.sqlite',
      // clientUrl: "sqlite://:memory:",
      forceUndefined: true,
      // debug: Boolean(process.env.DB_DEBUG),
      debug: true,
      discovery: {
        disableDynamicFileAccess: true,
        requireEntitiesArray: true,
      },
      metadataProvider: ReflectMetadataProvider,
      // baseDir: __dirname // defaults to `process.cwd()`
    }),
  );

  return orm;
}
