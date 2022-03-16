import { render, screen } from "@testing-library/react";
import ActiveLink from ".";

jest.mock("next/router", () => ({ useRouter: () => ({ asPath: "/" }) }));

describe("ActiveLink Component", () => {
  it("should render properly", () => {
    const title = "Home";

    render(
      <ActiveLink href="/" activeClassName="active">
        <a>{title}</a>
      </ActiveLink>
    );

    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it("should have active class if asPath is the same as href", () => {
    const title = "Home";

    render(
      <ActiveLink href="/" activeClassName="active">
        <a>{title}</a>
      </ActiveLink>
    );

    expect(screen.getByText(title)).toHaveClass("active");
  });
});
