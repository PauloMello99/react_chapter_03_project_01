import { render, screen, fireEvent } from "@testing-library/react";
import { mocked } from "jest-mock";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import SubscribeButton from ".";

jest.mock("next-auth/react");
jest.mock("next/router");

describe("SubscribeButton Component", () => {
  it("should render properly", () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
    });

    render(<SubscribeButton />);
    expect(screen.getByText("Subscribe now")).toBeInTheDocument();
  });

  it("should redirect user to sign in when not authenticated", () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
    });

    const signInMocked = mocked(signIn);

    render(<SubscribeButton />);

    fireEvent.click(screen.getByText("Subscribe now"));

    expect(signInMocked).toHaveBeenCalled();
  });

  it("should redirect user to posts when already have subscriptions", () => {
    const useRouterMocked = mocked(useRouter);
    const useSessionMocked = mocked(useSession);

    const pushMock = jest.fn();

    useRouterMocked.mockReturnValueOnce({ push: pushMock } as any);
    useSessionMocked.mockReturnValueOnce({
      data: {
        expires: "expire-date",
        user: { name: "John Doe" },
        activeSubscription: "active-sub",
      },
      status: "authenticated",
    });

    render(<SubscribeButton />);

    fireEvent.click(screen.getByText("Subscribe now"));

    expect(pushMock).toHaveBeenCalled();
  });
});
