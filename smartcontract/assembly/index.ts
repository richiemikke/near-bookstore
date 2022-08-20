import { Book, likedStorage, booksStorage } from './model';
import { context, ContractPromiseBatch, u128 } from "near-sdk-as";


 /**
  * @dev buying a book from the marketplace
  *   */ 
export function buyBook(bookId: string): void {
    const book = getBook(bookId);
    if (book == null) {
        throw new Error("book not found");
    }
    assert(book.owner.toString() != context.sender.toString(),"You cannot buy your own book");
    assert(book.price.toString() == context.attachedDeposit.toString(), "attached deposit should be greater than the book's price");
    assert(book.available > u32.MIN_VALUE, "Book stock is over");
    ContractPromiseBatch.create(book.owner).transfer(context.attachedDeposit);
    book.incrementSoldAmount();
    booksStorage.set(book.id, book);
}

/**
* @dev adding more books in inventory for a Book
* @param amount is the number to add for the inventory
 */
export function addMoreBook(bookId: string, amount: u32): void {
    const book = getBook(bookId);
    if (book == null) {
      throw new Error("book not found");
    }
    assert(book.owner.toString() == context.sender.toString(),"You don't have permission add more books");
    assert(amount > u32.MIN_VALUE, "Amount must at least be one");
    book.addAmount(amount); 
    booksStorage.set(book.id, book);
  }

  /**
   * @dev allow users to like a book
   */
  export function likeBook(bookId: string): void {
    const book = getBook(bookId);
    if (book == null) {
      throw new Error("book not found");
    }
    assert(book.owner.toString() != context.sender.toString(),"You cannot like your own book");
    const liked = likedStorage.get(context.sender);
    if(liked != null){
      assert(liked.indexOf(bookId) == -1,"You have already liked this book");
      liked.push(bookId);
      likedStorage.set(context.sender,liked);
    }else{
      likedStorage.set(context.sender,[bookId]);
    }
    
    book.incrementLikes(); 
    booksStorage.set(book.id, book);
  }

/**
 * @dev  changing the description of a book in the marketplace
 * @param bookId id of the book
 * @param newDescription the new description of the book
 */
  export function editDescription(bookId: string, newDescription: string): void {
    const book = getBook(bookId);
    if (book == null) {
      throw new Error("book not found");
    }
    assert(book.owner.toString() == context.sender.toString(),"You don't have permission to edit description");
    assert(newDescription.length > 0,"New description can't be empty");
    book.changeDescription(newDescription); 
    booksStorage.set(book.id, book); 
  }

/**
 * @dev changing the price of a book in the marketplace
 * @param bookId id of book
 * @param newPrice the new price of the book
 */
  export function editPrice(bookId: string, newPrice: u128): void {
    const book = getBook(bookId);
    if (book == null) {
      throw new Error("book not found");
    }
    assert(book.owner.toString() == context.sender.toString(),"You don't have permission to change price ");
    assert(newPrice > u128.Min, "New price needs to be greater than the minimum value");
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

 // getting liked books of a user from the block-chain
 export function getLiked(): string[] | null {
  return likedStorage.get(context.sender);
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
