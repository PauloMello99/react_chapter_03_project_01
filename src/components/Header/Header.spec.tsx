import { render, screen } from "@testing-library/react";
import Header from ".";

jest.mock("next/router", () => ({ useRouter: () => ({ asPath: "/" }) }));

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  useSession: () => ({ data: {}, status: "authenticated" }),
}));

describe("Header Component", () => {
  it("should render properly", () => {
    render(<Header />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Posts")).toBeInTheDocument();
  });
});
