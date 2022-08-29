import { PersistentUnorderedMap, context, u128 } from "near-sdk-as";

/**
 * This class represents a book that can be listed on a marketplace.
 * It contains basic properties that are needed to define a book.
 * The price of the book is of type u128 that allows storing it in yocto-NEAR, where `1 yocto = 1^-24`.
 * {@link nearBindgen} - it's a decorator that makes this class serializable so it can be persisted on the blockchain level. 
 */
@nearBindgen
export class Book {
    id: string;
    author: string;
    title: string;
    description: string;
    image: string;
    price: u128;
    owner: string;
    sold: u32;
    available: u32;
    likes: u32;

    public static fromPayload(payload: Book): Book {
        const book = new Book();
        book.id = payload.id;
        book.author = payload.author;
        book.title = payload.title;
        book.description = payload.description;
        book.image = payload.image;
        book.price = payload.price;
        book.owner = context.sender;
        book.available = payload.available;
        book.likes = payload.likes;
        return book;
    }
    public incrementSoldAmount(): void {
        this.sold = this.sold + 1;
        this.available = this.available - 1;
    }

    public incrementLikes(): void {
        this.likes = this.likes + 1;
    }

    public addAmount(amount: u32 = 1): void {
        this.available = this.available + amount;
    }

    public changeDescription(newDescrption: string): void {
        this.description = newDescrption;
    }

    public changePrice(newPrice: u128): void {
        this.price = newPrice;
    }
}
export const likedStorage = new PersistentUnorderedMap<string, string[]>("LIKED_BOOKS");

export const booksStorage = new PersistentUnorderedMap<string, Book>("LISTED_BOOKS");
