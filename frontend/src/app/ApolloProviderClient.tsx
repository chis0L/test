'use client';

import { ApolloProvider } from '@apollo/client';
import client from '@/graphql/apolloClient';

export default function ApolloProviderClient({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
} 