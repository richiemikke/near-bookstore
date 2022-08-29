import { v4 as uuid4 } from "uuid";
import { parseNearAmount } from "near-api-js/lib/utils/format";

const GAS = 100000000000000;

export function createBook(book) {
  book.id = uuid4();
  book.price = parseNearAmount(book.price + "");
  book.available = Number(book.available);
  return window.contract.setBook({ book });
}

export function addAvailableBook(Id, _ammount) {
  const ammount_ =  parseInt(_ammount);
  return window.contract.addMoreBook({ bookId: Id, amount: ammount_ }, GAS );
}

export function changePrice( Id, _price ) {
  const price = parseNearAmount(_price + "");
  return window.contract.editPrice( { bookId: Id, newPrice: price }, GAS );
}

export function likeBook( Id ) {
  return window.contract.likeBook( { bookId: Id }, GAS );
}

export function changeDescription( Id, description ) {
  return window.contract.editDescription( { bookId: Id, newDescription: description }, GAS );
}

export function getBooks() {
  return window.contract.getBooks();
}

export async function buyBook({ id, price }) {
  await window.contract.buyBook({ bookId: id }, GAS, price);
}
