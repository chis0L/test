import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/', // убедитесь, что backend доступен по этому адресу
  cache: new InMemoryCache(),
});

export default client; 