import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client';
import { AppProps } from 'next/app'; // Import types for Next.js

// Initialize Apollo Client
const client = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache(),
});

// Define MyApp function with TypeScript
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
    
  );
}

export default MyApp;
