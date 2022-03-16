import { Fragment } from "react";
import Prismic from "@prismicio/client";
import { RichText } from "prismic-dom";
import Head from "next/head";

import { GetStaticProps } from "next";
import { getPrismicClient } from "../../services/prismic";

import styles from "./styles.module.scss";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <Fragment>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts?.map((post) => (
            <a key={post.slug} href={`/posts/${post.slug}`}>
              <time>{post.updatedAt}</time>
              <strong>{post.title}</strong>
              <p>{post.excerpt}</p>
            </a>
          ))}
        </div>
      </main>
    </Fragment>
  );
}

export const getStaticProps: GetStaticProps<PostsProps> = async () => {
  const prismic = getPrismicClient();

  const response: any = await prismic.query(
    [Prismic.Predicates.at("document.type", "post")],
    { fetch: ["post.title", "post.content"], pageSize: 100 }
  );

  const posts: Post[] = response.results.map((post) => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt:
        post.data.content.find((content) => content.type === "paragraph")
          ?.text ?? "",
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      ),
    };
  });

  return { props: { posts } };
};
