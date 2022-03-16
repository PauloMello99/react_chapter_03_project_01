import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { RichText } from "prismic-dom";
import { Fragment, useEffect } from "react";

import { getPrismicClient } from "../../../services/prismic";

import styles from "../post.module.scss";

export interface Post {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
}

interface PostPreviewProps {
  post: Post;
}

export default function PostPreview({ post }: PostPreviewProps) {
  const { data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (data?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [data, data?.activeSubscrition, post.slug, router]);

  return (
    <Fragment>
      <Head>
        <title>{post.title} | ig.news</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles.content} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </Fragment>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient();
  const response: any = await prismic.getByUID("post", String(slug), {});

  const post: Post = {
    slug: String(slug),
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };

  return {
    props: { post },
    revalidate: 60 * 30, // 30 minutes
  };
};
