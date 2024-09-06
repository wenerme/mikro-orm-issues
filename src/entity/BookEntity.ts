import { Entity, ManyToOne, Property, types } from '@mikro-orm/core';
import { AuthorEntity } from './AuthorEntity';
import { StandardBaseEntity } from './StandardBaseEntity';

@Entity({ tableName: 'book' })
export class BookEntity extends StandardBaseEntity {
  @Property({ type: types.string })
  title!: string;

  @Property({ type: types.string })
  authorCode!: string;

  // @ManyToOne(() => AuthorEntity, {
  //   inversedBy: 'books',
  //   joinColumns: ['tid', 'author_code'],
  //   referencedColumnNames: ['tid', 'code'],
  //   nullable: true, // but it's not nullable in the database
  // })
  // author!: any;
}
