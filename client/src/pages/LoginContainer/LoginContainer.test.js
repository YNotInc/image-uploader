import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import LoginContainer from "./index";
afterEach(cleanup);

describe("LoginContainer", () => {
    const getRole = ()=>{}
    it("renders correctly", () => {
        
      const { getByText } = render(<LoginContainer 
        getRole={getRole} 
        />);
      expect(getByText("Login Form")).toBeTruthy();
    //   expect(getByText(props.address)).toBeTruthy();
    //   expect(getByText(props.phone)).toBeTruthy();
    //   expect(getByText(props.cuisine)).toBeTruthy();
    });
    it("matches snapshot", () => {
      const { asFragment } = render(<LoginContainer 
        getRole={getRole} 
        />);
      expect(asFragment()).toMatchSnapshot();
    });
  });