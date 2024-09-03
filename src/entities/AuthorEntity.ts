import { Collection, Entity, OneToMany, Property, types } from '@mikro-orm/core';
import { BookEntity } from './BookEntity';
import { StandardBaseEntity } from './StandardBaseEntity';

@Entity({ tableName: 'author' })
export class AuthorEntity extends StandardBaseEntity {
  @Property({ type: types.string })
  code!: string;

  // @OneToMany(() => BookEntity, (book) => book.author)
  // books = new Collection<BookEntity>(this);
}
