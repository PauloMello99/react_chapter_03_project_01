import {
  render,
  screen,
  // waitFor,
  // waitForElementToBeRemoved,
} from "@testing-library/react";

import { Async } from ".";

describe("Async Component", () => {
  it("should render properly", async () => {
    render(<Async />);

    expect(screen.getByText("Hello World")).toBeInTheDocument();

    // expect(await screen.findByText("Button")).toBeInTheDocument();

    // await waitFor(() => expect(screen.getByText("Button")).not.toBeInTheDocument());

    // await waitForElementToBeRemoved(screen.queryByText("Button"));
  });
});
