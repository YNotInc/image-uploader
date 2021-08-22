import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import LoginForm from "./index";
import { api as API } from '../../utils/API';
import { act } from 'react-dom/test-utils'

describe("LoginForm", () => {
  // mock the response:
  const props = {
    getRole: jest.fn()
  };

  //mock api
  API.login = jest
    .fn()
    .mockImplementationOnce(() =>
    ({
      "data":
      {
        "message": "Auth successful", "access_token": "test", "refresh_token": "test", "expiration": "Sun Aug 22 2021 03:36:06 GMT+0000",
        "email": "admin@ymail.com"
      },
      "status": 200,
      "statusText": "OK",
      "request": {}
    }));


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
    //Props no longer passed
    // expect(props.changeHandler).toHaveBeenCalled();
    expect(nameInput.value).toBe("test1@gmail.com");
  });

  it("should call submitHandler and axios when the form submits", async () => {

    // Arrange
    //mock api
    API.login = jest
      .fn()
      .mockImplementationOnce(() =>
      ({
        "data":
        {
          "message": "Auth successful", "access_token": "test", "refresh_token": "test", "expiration": "Sun Aug 22 2021 03:36:06 GMT+0000",
          "email": "admin@ymail.com"
        },
        "status": 200,
        "statusText": "OK",
        "request": {}
      }));

    // Target the form with Data test ID, to fire a submit event on the form
    let { getByTestId } = render(<LoginForm {...props} />);


    const form = getByTestId("login-form");
    // Act
    await act(async () => fireEvent.submit(form));

    // Assert: Anytime an action updates state it must be wrappred in act
    await act(async () => expect(API.login).toHaveBeenCalled());
    await act(async () => expect(props.getRole).toHaveBeenCalled());
  });
  it("should wipe the input fields when the form submits", async () => {

    // Arrange

    // Target the form with Data test ID, to fire a submit event on the form
    let { getByTestId, getByLabelText } = render(<LoginForm />);


    const form = getByTestId("login-form");
    // Act

    // ENter email and Grabs the input between the label for an input element
    const emailInput = getByLabelText("Email");
    // Since we are passing email from API.login, it is prefilled

    //wipe form data on submit:
    await act(async () => fireEvent.submit(form));

    await act(async () => expect(emailInput.value).toBe(""));
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<LoginForm {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });
});