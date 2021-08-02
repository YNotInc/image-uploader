import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import LoginForm from "./index";
afterEach(cleanup);

describe("LoginForm", () => {
  const props = {
    name: "Name",
    value: "",
    // mock changeHandler
    changeHandler: jest.fn(),
    id: "formGroupEmail"
  };

  it("updates the input value on change", () => {
    const { getByTestId } = render(<LoginForm {...props} />);
    // Grabs the test id
    const nameInput = getByTestId("login-email");
    fireEvent.change(nameInput, { target: { value: "test1@gmail.com" } });
    expect(nameInput.value).toBe("test1@gmail.com");
  });

  it("calls changeHandler on change", () => {
    const { getByLabelText } = render(<LoginForm {...props} />);
    // Grabs the input between the label for an input element
    const nameInput = getByLabelText("Email");
    fireEvent.change(nameInput, { target: { value: "test1@gmail.com" } });
    expect(props.changeHandler).toHaveBeenCalled();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<LoginForm {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });
});