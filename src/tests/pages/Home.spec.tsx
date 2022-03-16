import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";

import { stripe } from "../../services/stripe";
import Home, { getStaticProps } from "../../pages";

jest.mock("next/router");
jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "authenticated" }),
}));
jest.mock("../../services/stripe");

describe("Home Page", () => {
  it("should render properly", () => {
    render(<Home product={{ priceId: "price-id", amount: 10 }} />);
    expect(screen.getByText("for $10.00 month")).toBeInTheDocument();
  });

  it("should load initial data", async () => {
    const priceId = "fake-price-id";
    const unit_amount = 1000;

    const retrieveStripePriceMocked = mocked(stripe.prices.retrieve);
    retrieveStripePriceMocked.mockResolvedValueOnce({
      id: priceId,
      unit_amount,
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: { product: { priceId, amount: unit_amount / 100 } },
      })
    );
  });
});
