import { Entity, Property, types } from '@mikro-orm/core';
import { Feature } from '@wener/nestjs';
import {
  EntityFeature,
  StandardBaseEntity,
  withCodeEntity as withCodeEntity2,
  withMetadataEntity,
  withNotesEntity,
  withTagsEntity,
  type HasCodeEntity,
} from '@wener/nestjs/entity';
import { mixin, type Constructor } from '@wener/utils';

let withThisWillFail = withCodeEntity2;

// copy from @wener/nestjs/entity to here will make the property work
function withCodeEntity<TBase extends Constructor>(Base: TBase) {
  @Feature([EntityFeature.HasCode])
  @Entity({ abstract: true })
  abstract class HasCodeMixinEntity extends Base implements HasCodeEntity {
    @Property({ type: types.string, nullable: true })
    code?: string;
  }

  return HasCodeMixinEntity;
}

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
export class Test2Entity extends mixin(
  StandardBaseEntity,
  withTagsEntity,
  withMetadataEntity,
  withCodeEntity,
  withNotesEntity,
) {
  @Property({ type: types.string, nullable: true })
  displayName?: string;
}
