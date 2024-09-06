import 'reflect-metadata';
import { patchMikroORMMetadataStorage } from './patchMikroORMMetadataStorage';

patchMikroORMMetadataStorage();

const { runTest1: run } = await import('./runTest1');

await run();
