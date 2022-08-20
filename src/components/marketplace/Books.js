import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import AddBook from "./AddBook";
import Book from "./Book";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";

import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  getBooks as getBookList,
  buyBook,
  addAvailableBook,
  changeDescription,
  changePrice,
  likeBook,
  createBook,
} from "../../utils/marketplace";


const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const account = window.walletConnection.account();

  // function to get the list of books
  const getBooks = useCallback(async () => {
    try {
      setLoading(true);
      setBooks(await getBookList());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const addBook = async (data) => {
    setLoading(true);

    try {
      await createBook(data).then((resp) => {
        toast(<NotificationSuccess text="Book added successfully." />);
        getBooks();
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to add a book." />);
    } finally {
      setLoading(false);
    }
  };

  const addAvailable = async (_Id, _ammount) => {
    setLoading(true);

    try {
      await addAvailableBook(_Id, _ammount).then((resp) => {
        toast(<NotificationSuccess text="Book added successfully." />);
        getBooks();
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to add more books." />);
    } finally {
      setLoading(false);
    }
  };

  const likebook = async (_Id) => {
    setLoading(true);

    try {
      await likeBook(_Id).then((resp) => {
        toast(<NotificationSuccess text="you successfully like this book" />);
        getBooks();
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to like this book." />);
    } finally {
      setLoading(false);
    }
  };




  const editPrice = async (_Id, _price) => {
    setLoading(true);

    try {
      await changePrice(_Id, _price).then((resp) => {
        toast(<NotificationSuccess text="price changed successfully." />);
        getBooks();
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to change the price." />);
    } finally {
      setLoading(false);
    }
  };

  const editDescription = async (_Id, _description) => {
    setLoading(true);

    try {
      await changeDescription(_Id, _description).then((resp) => {
        toast(<NotificationSuccess text="description changed successfully." />);
        getBooks();
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to change the description." />);
    } finally {
      setLoading(false);
    }
  };

  //  function to initiate transaction
  const buy = async (id, price) => {
    try {
      await buyBook({
        id,
        price,
      }).then((resp) =>{
        toast(<NotificationSuccess text="Book bought successfully" />);
        getBooks()
      });
    } catch (error) {
      toast(<NotificationError text="Failed to purchase book." />);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <>
      {!loading ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fs-4 fw-bold mb-0">Near Bookstore</h1>
            <AddBook save={addBook} />
          </div>
          <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
            {books.map((_book) => (
              <Book
                book={{
                  ..._book,
                }}
                key={_book.id}
                buy={buy}
                editPrice={editPrice}
                editDescription={editDescription}
                addAvailable={addAvailable}
                likebook={likebook}
                isOwner = {account.accountId === _book.owner}
              />
            ))}
          </Row>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Books;
