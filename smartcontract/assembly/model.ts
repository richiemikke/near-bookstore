import { PersistentUnorderedMap, context, PersistentMap, u128 } from "near-sdk-as";

/**
 * This class represents a product that can be listed on a marketplace.
 * It contains basic properties that are needed to define a product.
 * The price of the product is of type u128 that allows storing it in yocto-NEAR, where `1 yocto = 1^-24`.
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
    }

    public incrementLikes(): void {
        this.likes = this.likes + 1;
    }
    public decreaseAvailableAmount(): void {
        this.available = this.available - 1;
    }

    public addAmount(number: u32 = 1): void {
        this.available = this.available + number;
    }

    public changeDescription(newDescrption: string): void {
        this.description = newDescrption;
    }

    public changePrice(newPrice: u128): void {
        this.price = newPrice;
    }
}

@nearBindgen
export class UserBuy {
    bookId: string;
    quantity: u32;

    public static init(bookId: string) : UserBuy {
        const userBuy = new UserBuy();

        userBuy.bookId = bookId;
        userBuy.quantity = 1;

        return userBuy;
    }

    public increaseBoughtQuantity() : void {
        this.quantity++;
    }
}

export const booksStorage = new PersistentUnorderedMap<string, Book>("LISTED_BOOKS");

export const userBuyStorage = new PersistentUnorderedMap<string, UserBuy[]>("LISTED_BUYS");
