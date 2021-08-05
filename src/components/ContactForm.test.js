import React from "react";
import { getByTestId, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";

const randNum = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

test("renders without errors", () => {
  render(<ContactForm />);
});

test("renders the contact form header", () => {
  render(<ContactForm />);
  const header = screen.getByText(/Contact Form/i);
  expect(header).toBeInTheDocument();
  expect(header).toBeTruthy();
  expect(header).toHaveTextContent("Contact Form");
});

test("renders ONE error message if user enters less then 5 characters into firstname.", async () => {
  render(<ContactForm />);
  const inputText = "a";
  const firstNameInput = screen.getByLabelText("First Name*");
  userEvent.type(firstNameInput, inputText.repeat(randNum(1, 5)));
  const errorMessages = screen.getAllByTestId("error");
  expect(errorMessages).toHaveLength(1);
  //   userEvent(firstNameInput).type("hel");
  //   expect(errorMessages).toBeInTheDocument();
});

test("renders THREE error messages if user enters no values into any fields.", async () => {
  render(<ContactForm />);
  const submitBtn = screen.getByRole("button");
  userEvent.click(submitBtn);
  const errorMessages = screen.getAllByTestId("error");
  expect(errorMessages).toHaveLength(3);
});

test("renders ONE error message if user enters a valid first name and last name but no email.", async () => {
  render(<ContactForm />);
  const firstNameInput = screen.getByLabelText("First Name*");
  const lastNameInput = screen.getByLabelText("Last Name*");
  const submitBtn = screen.getByRole("button");
  userEvent.type(firstNameInput, "a".repeat(randNum(5, 15)));
  userEvent.type(lastNameInput, "a".repeat(randNum(5, 15)));
  userEvent.click(submitBtn);
  const errorMessages = screen.getAllByTestId("error");
  expect(errorMessages).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm />);
  const emailInput = screen.getByLabelText("Email*");
  userEvent.type(emailInput, "notrealemail");
  const errorMessages = screen.getAllByTestId("error");
  expect(errorMessages).toHaveLength(1);
  expect(errorMessages[0]).toHaveTextContent(
    "email must be a valid email address"
  );
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm />);
  const firstNameInput = screen.getByLabelText("First Name*");
  const emailInput = screen.getByLabelText("Email*");
  const submitBtn = screen.getByRole("button");
  userEvent.type(firstNameInput, "a".repeat(randNum(5, 15)));
  userEvent.type(emailInput, "test@test.com");
  userEvent.click(submitBtn);
  const errorMessage = screen.getByTestId("error");
  expect(errorMessage).toHaveTextContent("lastName is a required field");
});

test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {
  render(<ContactForm />);
  const firstNameInput = screen.getByLabelText("First Name*");
  const lastNameInput = screen.getByLabelText("Last Name*");
  const emailInput = screen.getByLabelText("Email*");
  const submitBtn = screen.getByRole("button");

  userEvent.type(firstNameInput, "a".repeat(randNum(5, 15)));
  userEvent.type(lastNameInput, "a".repeat(randNum(5, 15)));
  userEvent.type(emailInput, "test@test.com");

  let displayComponent = screen.queryByTestId("popup");
  expect(displayComponent).not.toBeInTheDocument();

  userEvent.click(submitBtn);

  displayComponent = screen.queryByTestId("popup");
  expect(displayComponent).toBeInTheDocument();
  expect(displayComponent).toHaveTextContent(firstNameInput.value);
  expect(displayComponent).toHaveTextContent(lastNameInput.value);
  expect(displayComponent).toHaveTextContent(emailInput.value);
});

test("renders all fields text when all fields are submitted.", async () => {
  render(<ContactForm />);
  const firstNameInput = screen.getByLabelText("First Name*");
  const lastNameInput = screen.getByLabelText("Last Name*");
  const emailInput = screen.getByLabelText("Email*");
  const messageInput = screen.getByLabelText("Message");

  const submitBtn = screen.getByRole("button");

  userEvent.type(firstNameInput, "a".repeat(randNum(5, 15)));
  userEvent.type(lastNameInput, "a".repeat(randNum(5, 15)));
  userEvent.type(emailInput, "test@test.com");
  userEvent.type(messageInput, "This is a test message");

  userEvent.click(submitBtn);

  const displayComponent = screen.queryByTestId("popup");

  expect(displayComponent).toHaveTextContent(firstNameInput.value);
  expect(displayComponent).toHaveTextContent(lastNameInput.value);
  expect(displayComponent).toHaveTextContent(emailInput.value);
  expect(displayComponent).toHaveTextContent(messageInput.value);
});
