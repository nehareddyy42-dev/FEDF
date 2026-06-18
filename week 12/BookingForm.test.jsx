import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import "@testing-library/jest-dom";
import BookingForm from "./components/BookingForm";

describe("BookingForm", () => {
  test("Book Ticket button exists", () => {
    render(<BookingForm />);

    const button = screen.getByText("Book Ticket");

    expect(button).toBeInTheDocument();
  });
});