import Head from 'next/head'

import Layout from '@components/Layout';
import Header from '@components/Header';
import Container from '@components/Container';
import Button from '@components/Button';

import styles from '@styles/Product.module.scss'

import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

export default function Product({ product }) {
  return (
    <Layout>
      <Head>
        <title>{product.name}</title>
        <meta name="description" content={`Find ${product.name} at TheNextGraphCart`} />
      </Head>

      <Container>
        <div className={styles.productWrapper}>
          <div className={styles.productImage}>
            <img width={product.image.width} height={product.image.height} src={product.image.url} alt={product.name} />
          </div>
          <div className={styles.productContent}>
            <h1>{product.name}</h1>
            <div className={styles.productDescription}
              dangerouslySetInnerHTML={{ __html: product.description?.html }}
            />
            <p className={styles.productPrice}>
              ${product.price}
            </p>
            <p className={styles.productBuy}>
              <Button>
                Add to Cart
              </Button>
            </p>
          </div>
        </div>
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  const client = new ApolloClient({
    uri: 'https://api-ap-south-1.hygraph.com/v2/cl8gb3itm4ban01ue537z7pay/master',
    cache: new InMemoryCache(),
  });
  const data = await client.query({
    query: gql`
      query PageProduct($slug: String) {
        product(where: {slug: $slug}) {
          id
          name
          image
          price
          description {
            html
          }
        }
      }
    `,
    variables: {
      slug: params.productSlug
    }
  });

  const product = data.data.product;

  return {
    props: {
      product
    }
  };
}

export async function getStaticPaths() {
  const client = new ApolloClient({
    uri: 'https://api-ap-south-1.hygraph.com/v2/cl8gb3itm4ban01ue537z7pay/master',
    cache: new InMemoryCache(),
  });
  const data = await client.query({
    query: gql`
      query PageProducts {
        products {
          id
          name
          price
          slug
          image
        }
      }
    `,
  });

  const paths = data.data.products.map(product => {
    return {
      params: {
        productSlug: product.slug,
      }
    };
  });

  return {
    paths,
    fallback: false
  };
}