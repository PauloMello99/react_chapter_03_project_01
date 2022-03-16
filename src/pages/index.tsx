import { Fragment } from "react";
import { GetStaticProps } from "next";
import Image from "next/image";
import Head from "next/head";

import { stripe } from "../services/stripe";

import SubscribeButton from "../components/SubscribeButton";

import styles from "./home.module.scss";

interface Product {
  priceId: string;
  amount: number;
}

interface HomeProps {
  product: Product;
}

export default function Home({ product }: HomeProps) {
  const formattedPrice = product.amount.toLocaleString("en-US", {
    currency: "USD",
    style: "currency",
  });

  return (
    <Fragment>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, Helcome</span>
          <h1>
            News about <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {formattedPrice} month</span>
          </p>
          <SubscribeButton />
        </section>
        <Image
          src="/images/avatar.svg"
          alt="Girl Coding"
          width="100%"
          height="100%"
        />
      </main>
    </Fragment>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const price = await stripe.prices.retrieve("price_1J6DhnJufjAAU5DkV9t0xKOp");

  const product: Product = {
    priceId: price.id,
    amount: price.unit_amount / 100,
  };

  return {
    props: { product },
    revalidate: 60 * 60 * 24, // 24 horas
  };
};
