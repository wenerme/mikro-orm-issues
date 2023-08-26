import "reflect-metadata";
import { MemoryCacheAdapter, ReflectMetadataProvider } from "@mikro-orm/core";
import { Author } from "./entities/author.entity";
import { Book } from "./entities/book.entity";
import { defineConfig, MikroORM } from "@mikro-orm/sqlite";

async function connectAndGetOrm() {
  const orm = await MikroORM.init(
    defineConfig({
      entities: [Author, Book],
      type: "sqlite",
      dbName: ":memory:",
      // dbName: 'test.sqlite',
      // clientUrl: "sqlite://:memory:",
      forceUndefined: true,
      debug: Boolean(process.env.DB_DEBUG),
      discovery: {
        disableDynamicFileAccess: true,
        requireEntitiesArray: true,
      },
      metadataProvider: ReflectMetadataProvider,
      // baseDir: __dirname // defaults to `process.cwd()`
    })
  );

  return orm;
}

async function main() {
  const orm = await connectAndGetOrm();
  const em = orm.em;
  const prepare = [
    `
create table  if not exists author (
id text,
tid text,
code text
)
  `,
    `
    create table  if not exists book(
      id text,
      tid text,
      title text,
      author_code text
    )
    `,
  ];
  for (const o of prepare) await em.execute(o);

  console.log("Connected");

  {
    const em = orm.em.fork();
    const authorRepo = em.getRepository(Author);
    const bookRepo = em.getRepository(Book);
    authorRepo.create({
      id: "a",
      tid: "t1",
      code: "A",
    });

    bookRepo.create({
      id: "B1",
      tid: "t1",
      title: "Book",
      authorCode: "A",
    });

    await em.flush();
  }

  {
    const em = orm.em.fork();
    const authorRepo = em.getRepository(Author);
    const bookRepo = em.getRepository(Book);

    const all = await authorRepo.findAll({
      populate: ["books"],
    })
    console.log(all[0].toPOJO())
  }

  orm.close();
}
main();
