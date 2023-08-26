import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  ManyToMany,
  Collection,
  types,
  OptionalProps,
  BaseEntity,
} from "@mikro-orm/core";
import { Author } from "./author.entity";

@Entity({ tableName: "book" })
export class Book extends BaseEntity<Book, "id"> {
  [OptionalProps]?: 'author';

  @PrimaryKey({ type: types.string })
  id!: string;

  @Property({ type: types.string })
  tid!: string;

  @Property()
  title!: string;

  @Property()
  authorCode!: string;

  @ManyToOne(() => Author, {
    inversedBy: "books",
    joinColumns: ["tid", "author_code"],
    referencedColumnNames: ["tid", "code"],
    nullable: true, // but it's not nullable in the database
  })
  author!: any;
}
