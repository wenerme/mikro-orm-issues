import 'reflect-metadata';
import { MikroORM, ReflectMetadataProvider } from '@mikro-orm/core';
import { defineConfig } from '@mikro-orm/sqlite';
import { AuthorEntity } from './entities/AuthorEntity';
import { BookEntity } from './entities/BookEntity';

async function connectAndGetOrm() {
  const orm = await MikroORM.init(
    defineConfig({
      entities: [AuthorEntity, BookEntity],
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

export async function runMain() {
  const orm = await connectAndGetOrm();
  const em = orm.em;
  const prepare = [
    `
        create table if not exists author
        (
            id   text,
            tid  text,
            eid  text,
            uid  text,
            code text
        )
    `,
    `
        create table if not exists book
        (
            id          text,
            tid         text,
            title       text,
            author_code text
        )
    `,
  ];
  for (const o of prepare) await em.execute(o);

  console.log('Connected');

  // {
  //   const em = orm.em.fork();
  //   const authorRepo = em.getRepository(AuthorEntity);
  //   const bookRepo = em.getRepository(BookEntity);
  //   authorRepo.create({
  //     id: 'a',
  //     tid: 't1',
  //     code: 'A',
  //   });
  //
  //   bookRepo.create({
  //     id: 'B1',
  //     tid: 't1',
  //     title: 'Book',
  //     authorCode: 'A',
  //   });
  //
  //   await em.flush();
  // }
  //
  // {
  //   const em = orm.em.fork();
  //   const authorRepo = em.getRepository(AuthorEntity);
  //   const bookRepo = em.getRepository(BookEntity);
  //
  //   const all = await authorRepo.findAll({
  //     populate: ['books'],
  //   });
  //   console.log(all[0].toPOJO());
  // }

  orm.close();
}

runMain();
