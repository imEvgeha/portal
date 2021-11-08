import React from "react";
import { render } from "@testing-library/react";

import { Button } from "./Button";
import { ButtonProps } from "./Button.types";

describe("Test Button", () => {
  let props: ButtonProps;

  beforeEach(() => {
    props = {
      children: "click me"
    };
  });

  const renderButton = () => render(<Button {...props} />);

  it("should have primary className with default props", () => {
    const { getByText } = renderButton();

    expect(getByText(/click me/i)).toBeInTheDocument();
  });
});