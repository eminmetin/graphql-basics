const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const myGraphQlSchema = require('./schema');
const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema: myGraphQlSchema,
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log('server 4000. portta çalışıyor');
});
