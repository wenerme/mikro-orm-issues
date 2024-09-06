import { Entity, Property, types } from '@mikro-orm/core';
import {
  StandardBaseEntity,
  withCodeEntity,
  withMetadataEntity,
  withNotesEntity,
  withTagsEntity,
} from '@wener/nestjs/entity';
import { mixin } from '@wener/utils';

@Entity({ tableName: 'test_1' })
export class Test1Entity extends mixin(
  StandardBaseEntity,
  withNotesEntity,
  withTagsEntity,
  withCodeEntity,
  withMetadataEntity,
) {
  @Property({ type: types.string, nullable: true })
  displayName?: string;
}

@Entity({ tableName: 'test_2' })
export class Test2Entity extends mixin(StandardBaseEntity, withTagsEntity, withMetadataEntity, withNotesEntity) {
  @Property({ type: types.string, nullable: true })
  displayName?: string;
}
