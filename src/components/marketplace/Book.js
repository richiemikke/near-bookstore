import React from "react";
import PropTypes from "prop-types";
import { utils } from "near-api-js";
import { Card, Button, Col, Badge, Stack, Form } from "react-bootstrap";
import { useState } from "react";

const Book = ({
	book,
	buy,
	addAvailable,
	editPrice,
	editDescription,
	likebook,
	isOwner,
}) => {
	const {
		id,
		price,
		available,
		author,
		title,
		description,
		sold,
		image,
		owner,
		likes,
	} = book;

	const [newPrice, setNewPrice] = useState("");
	const [newbooks, setNewBooks] = useState("");
	const [newDescription, setNewDescription] = useState("");

	const triggerBuy = () => {
		buy(id, price);
	};

	const triggerAddAvailable = () => {
		addAvailable(id, newbooks);
	};
	const triggereditPrice = () => {
		editPrice(id, newPrice);
	};
	const triggerLike = () => {
		likebook(id);
	};

	const triggereditDescription = () => {
		editDescription(id, newDescription);
	};

	return (
		<Col>
			<Card className=" h-100">
				<Card.Header>
					<Stack direction="horizontal" gap={3}>
						<span className="font-monospace text-secondary">
							{owner}
						</span>
						<Badge bg="secondary" className="ms-auto">
							{sold} Sold
						</Badge>
						<Badge bg="secondary" className="ms-auto">
							{available} Available
						</Badge>
					</Stack>
				</Card.Header>
				<div className=" ratio ratio-4x3">
					<img
						src={image}
						alt={author}
						style={{ objectFit: "cover" }}
					/>
				</div>
				<Card.Body className="d-flex  flex-column text-center">
					<Card.Title>Author Name: {author}</Card.Title>
					<Card.Title> Book Title: {title}</Card.Title>
					<Card.Text className="flex-grow-1 ">
						{description}
					</Card.Text>
					<Card.Text className="text-secondary">
						<span>Likes: {likes}</span>
					</Card.Text>

					{isOwner === true && (
						<>
							<Form.Control
								className={"pt-2 mb-1"}
								type="text"
								placeholder="Enter ammount to add"
								onChange={(e) => {
									setNewBooks(e.target.value);
								}}
							/>

							<Button
								variant="primary"
								className={"mb-4"}
								onClick={() => triggerAddAvailable()}
							>
								Add more inventory
							</Button>
						</>
					)}

					{isOwner === true && (
						<>
							<Form.Control
								className={"pt-2 mb-1"}
								type="text"
								placeholder="Enter new price"
								onChange={(e) => {
									setNewPrice(e.target.value);
								}}
							/>

							<Button
								variant="primary"
								className={"mb-4"}
								onClick={() => triggereditPrice()}
							>
								Change Price
							</Button>
						</>
					)}

					{isOwner === true && (
						<>
							<Form.Control
								className={"pt-2 mb-1"}
								type="text"
								placeholder="Enter new description"
								onChange={(e) => {
									setNewDescription(e.target.value);
								}}
							/>

							<Button
								variant="primary"
								className={"mb-4"}
								onClick={() => triggereditDescription()}
							>
								Change Description
							</Button>
						</>
					)}

					{isOwner !== true && (
						<>
							<Button
								variant="primary"
								className={"mb-4"}
								onClick={() => triggerLike()}
							>
								Like Book
							</Button>
						</>
					)}

					{isOwner !== true && available > 0 ? (
						<Button
							variant="outline-dark"
							onClick={triggerBuy}
							className="w-100 py-3"
						>
							Buy for {utils.format.formatNearAmount(price)} NEAR
						</Button>
					) : (
						<Card.Title>{isOwner ? "" : "SOLD OUT!!"}</Card.Title>
					)}
				</Card.Body>
			</Card>
		</Col>
	);
};

Book.propTypes = {
	book: PropTypes.instanceOf(Object).isRequired,
	buy: PropTypes.func.isRequired,
};

export default Book;
