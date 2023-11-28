import { ApolloServer } from 'apollo-server-express';
import { Application } from 'express';
import typeDefs from '../graphql/schema/schema';
import resolvers from '../graphql/resolvers/resolver';
import depthLimit from 'graphql-depth-limit';

// Cette fonction reçoit l'instance Express et y attache Apollo Server
export async function startApolloServer(app: Application) {
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        validationRules: [depthLimit(7)], // Utilisez depthLimit pour prévenir des attaques de requêtes trop profondes
        context: ({ req, res }) => ({ req, res }) // context permet d'accéder à req et res dans chaque résolver
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({
        app: app as any,
        path: '/graphql',
        cors: true
    });
}