import { Book, booksStorage } from './model';
import { context, ContractPromiseBatch, u128 } from "near-sdk-as";


 // buying a book from the marketplace
export function buyBook(bookId: string): void {
    const book = getBook(bookId);
    if (book == null) {
        throw new Error("book not found");
    }
    if (book.price.toString() != context.attachedDeposit.toString()) {
        throw new Error("attached deposit should be greater than the book's price");
    }
    if (book.available <= 0){
        throw new Error("Book stock is over")
    }

    ContractPromiseBatch.create(book.owner).transfer(context.attachedDeposit);
    book.incrementSoldAmount();
    book.decreaseAvailableAmount();
    booksStorage.set(book.id, book);
}

/* adding more available books to the marketplace */
export function addMoreBook(bookId: string, ammount: u32): void {
    const book = getBook(bookId);
    if (book == null) {
      throw new Error("book not found");
    }
    if (book.owner != context.sender.toString()) {
        throw new Error("You don't have permission add more books");
    }
    book.addAmount(ammount); 
    booksStorage.set(book.id, book);
  }

  // liking a book
  export function likeBook(bookId: string): void {
    const book = getBook(bookId);
    if (book == null) {
      throw new Error("book not found");
    }
    if (book.owner == context.sender.toString()) {
        throw new Error("You cannot like your own book");
    }
    book.incrementLikes(); 
    booksStorage.set(book.id, book);
  }

// changing the description of a book in the marketplace
  export function editDescription(bookId: string, newDescription: string): void {
    const book = getBook(bookId);
    if (book == null) {
      throw new Error("book not found");
    }
    if (book.owner != context.sender.toString()) {
        throw new Error("You don't have permission to edit description ");
    }
    book.changeDescription(newDescription); 
    booksStorage.set(book.id, book); 
  }

// changing the price of a book in the marketplace
  export function editPrice(bookId: string, newPrice: u128): void {
    const book = getBook(bookId);
    if (book == null) {
      throw new Error("book not found");
    }
    if (book.owner != context.sender.toString()) {
        throw new Error("You don't have permission to change price ");
    }
    book.changePrice(newPrice); 
    booksStorage.set(book.id, book); 
  }



/**
 * 
 * @param book - a book to be added to the blockchain
 */
export function setBook(book: Book): void {
    let storedBook = booksStorage.get(book.id);
    if (storedBook !== null) {
        throw new Error(`a book with id=${book.id} already exists`);
    }
    booksStorage.set(book.id, Book.fromPayload(book));
}


 // getting a book from the block-chain
export function getBook(id: string): Book | null {
    return booksStorage.get(id);
}

/**
 * 
 * A function that returns an array of products for all accounts
 * 
 * @returns an array of objects that represent a book
 */
export function getBooks(): Array<Book> {
    return booksStorage.values();
}
