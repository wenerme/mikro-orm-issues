import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
  types,
  BaseEntity,
} from "@mikro-orm/core";
import { Book } from "./book.entity";

@Entity({ tableName: "author" })
export class Author extends BaseEntity<Author, "id"> {
  @PrimaryKey({ type: types.string })
  id!: string;

  @Property({ type: types.string })
  tid!: string;

  @Property({ type: types.string })
  code!: string;

  @OneToMany(() => Book, (book) => book.author)
  books = new Collection<Book>(this);
}
