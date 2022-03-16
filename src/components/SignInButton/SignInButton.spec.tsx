import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";

import { useSession } from "next-auth/react";

import SignInButton from ".";

jest.mock("next-auth/react");

describe("SignInButton Component", () => {
  it("should render properly when user is not authenticated", () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
    });

    render(<SignInButton />);
    expect(screen.getByText("Sign in with Github")).toBeInTheDocument();
  });

  it("should render properly when user is authenticated", () => {
    const name = "John Doe";

    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
      data: { expires: "expire-date", user: { name } },
      status: "authenticated",
    });

    render(<SignInButton />);

    expect(screen.getByText(name)).toBeInTheDocument();
  });
});
