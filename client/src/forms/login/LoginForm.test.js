import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import LoginForm from "./index";
afterEach(cleanup);

describe("LoginForm", () => {
    it("updates the input value on change", () => {
      const { getByTestId } = render(<LoginForm />);
      const nameInput = getByTestId("login-email");
      fireEvent.change(nameInput, { target: { value: "test1@gmail.com" } });
      expect(nameInput.value).toBe("test1@gmail.com");
    });
  
    it("matches snapshot", () => {
      const { asFragment } = render(<LoginForm />);
      expect(asFragment()).toMatchSnapshot();
    });
  });