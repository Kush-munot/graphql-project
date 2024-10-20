import { ApolloServer, gql } from 'apollo-server-micro';
import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import Item from './models/Item';

// TypeScript types for Item and GraphQL arguments
type ItemType = {
  id: string;
  name: string;
  description: string;
};

interface AddItemArgs {
  name: string;
  description: string;
}

interface UpdateItemArgs {
  id: string;
  name?: string;
  description?: string;
}

interface DeleteItemArgs {
  id: string;
}

interface GetItemArgs {
  id: string;
}

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI as string;

if (!mongoose.connection.readyState) {
  mongoose.connect(MONGODB_URI);
}

// Define GraphQL Schema (CRUD Operations)
const typeDefs = gql`
  type Item {
    id: ID!
    name: String!
    description: String!
  }

  type Query {
    getItems: [Item]
    getItem(id: ID!): Item
  }

  type Mutation {
    addItem(name: String!, description: String!): Item
    updateItem(id: ID!, name: String, description: String): Item
    deleteItem(id: ID!): Item
  }
`;

// Define Resolvers
const resolvers = {
  Query: {
    getItems: async (): Promise<ItemType[]> => {
      return await Item.find();
    },
    getItem: async (_: unknown, { id }: GetItemArgs): Promise<ItemType | null> => {
      return await Item.findById(id);
    },
  },
  Mutation: {
    addItem: async (_: unknown, { name, description }: AddItemArgs): Promise<ItemType> => {
      const newItem = new Item({ name, description });
      await newItem.save();
      return newItem;
    },
    updateItem: async (_: unknown, { id, name, description }: UpdateItemArgs): Promise<ItemType | null> => {
      const updatedItem = await Item.findByIdAndUpdate(id, { name, description }, { new: true });
      return updatedItem;
    },
    deleteItem: async (_: unknown, { id }: DeleteItemArgs): Promise<ItemType | null> => {
      const deletedItem = await Item.findByIdAndDelete(id);
      return deletedItem;
    },
  },
};

// Create Apollo Server
const apolloServer = new ApolloServer({ typeDefs, resolvers });

const startServer = apolloServer.start();

// Next.js API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await startServer;
  await apolloServer.createHandler({ path: '/api/graphql' })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
