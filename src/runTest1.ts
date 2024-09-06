import { Test1Entity } from '@/entity/Test2Entity';
import { getMemoryOrm } from '@/getMemoryOrm';

export async function runTest1() {
  const orm = await getMemoryOrm();
  const em = orm.em.fork();

  await em.findAll(Test1Entity, {
    where: {
      notes: '',
    },
  });
}
