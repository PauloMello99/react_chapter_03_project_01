import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { mocked } from "jest-mock";

import { getPrismicClient } from "../../services/prismic";
import Post, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { useRouter } from "next/router";

jest.mock("next-auth/react");
jest.mock("next/router");
jest.mock("../../services/prismic");

const post = {
  slug: "my-new-post",
  title: "My New Post",
  content: "<p>Post excerpt</p>",
  updatedAt: "01 de abril de 2022",
};

describe("Post Preview Page", () => {
  it("should render properly", () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
    });

    render(<Post post={post} />);

    expect(screen.getByText("My New Post")).toBeInTheDocument();
    expect(screen.getByText("Post excerpt")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  it("should redirect user to full post when subscribed", async () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);

    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce({
      data: { activeSubscription: "fake-active-sub" } as any,
      status: "authenticated",
    });
    useRouterMocked.mockReturnValueOnce({ push: pushMock } as any);

    render(<Post post={post} />);

    expect(pushMock).toHaveBeenCalledWith(`/posts/${post.slug}`);
  });

  it("should load initial data", async () => {
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

    const response = await getStaticProps({
      params: { slug: "my-new-post" },
    } as any);

    expect(response).toEqual(expect.objectContaining({ props: { post } }));
  });
});
