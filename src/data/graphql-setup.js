import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
    uri: process.env.HYGRAPH_CONTENT_API_PATH,
    cache: new InMemoryCache(),
});