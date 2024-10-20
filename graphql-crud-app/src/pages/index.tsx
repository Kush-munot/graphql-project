import { useQuery, gql } from '@apollo/client';

const GET_ITEMS = gql`
  query GetItems {
    getItems {
      id
      name
      description
    }
  }
`;

type ItemType = {
  id: string;
  name: string;
  description: string;
};

export default function Home() {
  const { loading, error, data } = useQuery(GET_ITEMS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Items List</h1>
      <ul>
        {data.getItems.map((item: ItemType) => (
          <li key={item.id}>
            <h2>{item.name}</h2>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
