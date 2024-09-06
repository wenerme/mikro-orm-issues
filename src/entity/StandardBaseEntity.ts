import { BaseEntity, Entity, PrimaryKey, Property, types, Unique, type Opt } from '@mikro-orm/core';


@Entity({ abstract: true })
@Unique({ properties: ['tid', 'eid'] })
@Unique({ properties: ['uid'] })
export class StandardBaseEntity extends BaseEntity {
  @PrimaryKey({ type: types.string, defaultRaw: 'gen_ulid()', nullable: false })
  id!: string & Opt;

  @Property({ type: types.string, default: 'org_0' })
  tid!: string & Opt;
  @Property({ type: types.string })
  eid!: string & Opt;
  @Property({ type: types.string })
  uid!: string & Opt;
}
