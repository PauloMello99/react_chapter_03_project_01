import { render, screen } from "@testing-library/react";
import { getSession } from "next-auth/react";
import { mocked } from "jest-mock";

import { getPrismicClient } from "../../services/prismic";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";

jest.mock("next-auth/react");
jest.mock("../../services/prismic");

const post = {
  slug: "my-new-post",
  title: "My New Post",
  content: "<p>Post excerpt</p>",
  updatedAt: "01 de abril de 2022",
};

describe("Post Page", () => {
  it("should render properly", () => {
    render(<Post post={post} />);
    expect(screen.getByText("My New Post")).toBeInTheDocument();
    expect(screen.getByText("Post excerpt")).toBeInTheDocument();
  });

  it("should redirect user if no subscription is found", async () => {
    const sessionMocked = mocked(getSession);
    sessionMocked.mockResolvedValueOnce({ activeSubscription: null } as any);

    const response = await getServerSideProps({
      params: { slug: "my-new-post" },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({ destination: "/" }),
      })
    );
  });

  it("should load initial data", async () => {
    const sessionMocked = mocked(getSession);
    sessionMocked.mockResolvedValueOnce({
      activeSubscription: "fake-active-sub",
    } as any);

    const getPrismicClientMocked = mocked(getPrismicClient);
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: "heading", text: "My New Post" }],
          content: [{ type: "paragraph", text: "Post excerpt" }],
        },
        last_publication_date: "04-01-2022",
      }),
    } as any);

    const response = await getServerSideProps({
      params: { slug: "my-new-post" },
    } as any);

    expect(response).toEqual(expect.objectContaining({ props: { post } }));
  });
});
