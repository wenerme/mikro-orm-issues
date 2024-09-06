import { Entity, MetadataStorage } from '@mikro-orm/core';
import { checkMikroOrmEnv } from '@wener/nestjs/entity';
import { Test1Entity } from '@/entity/Test2Entity';
import { getMemoryOrm } from '@/getMemoryOrm';

export async function runTest1() {
  checkMikroOrmEnv({
    Entity,
    MetadataStorage,
  });
  const orm = await getMemoryOrm();
  const em = orm.em.fork();

  await em.findAll(Test1Entity, {
    where: {
      code: '',
      notes: '',
    },
  });
}
