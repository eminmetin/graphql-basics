const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
} = require('graphql');

var personeller = [
  //   { id: '1', isim: 'Ali', yas: 30, email: 'ali@google.com' },
  //   { id: '2', isim: 'Osman', yas: 30, email: 'osman@google.com' },
  //   { id: '3', isim: 'Esra', yas: 25, email: 'esra@google.com' },
  //   { id: '4', isim: 'Öykü', yas: 22, email: 'oyku@google.com' },
];

const PersonelType = new GraphQLObjectType({
  name: 'Personel',
  fields: () => ({
    id: { type: GraphQLString },
    isim: { type: GraphQLString },
    email: { type: GraphQLString },
    yas: { type: GraphQLInt },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    personel: {
      type: PersonelType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        // //veriye erişim
        // for (let i = 0; i < personeller.length; i++) {
        //   if (personeller[i].id === args.id) {
        //     return personeller[i];
        //   }
        // }
        return axios
          .get('http://localhost:3000/personeller/' + args.id)
          .then((res) => res.data);
      },
    },
    personeller: {
      type: new GraphQLList(PersonelType),
      resolve(parent, args) {
        // return personeller;
        return axios
          .get('http://localhost:3000/personeller')
          .then((res) => res.data);
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    personelEkle: {
      type: PersonelType,
      args: {
        isim: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        yas: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        return axios
          .post('http://localhost:3000/personeller', {
            isim: args.isim,
            email: args.email,
            yas: args.yas,
          })
          .then((res) => res.data);
      },
    },
    personelSil: {
      type: PersonelType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return axios
          .delete('http://localhost:3000/personeller/' + args.id)
          .then((res) => res.data);
      },
    },
    personelGuncelle: {
      type: PersonelType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        isim: { type: GraphQLString },
        yas: { type: GraphQLString },
        email: { type: GraphQLString },
      },
      resolve(_, args) {
        return (
          axios
            //put metodunde graphiql'de (yas) girip onu güncellersem sadece yası günceller diğerlerini null olarak döndürür ve siler çünkü diğerleri hakkında bir değişim bilgisi vermedim.
            //patch metodunda graphiql'de (yas) girip onu güncellersem sadece ilgili property değişir ve diğerleri sabit kalır.
            .patch('http://localhost:3000/personeller/' + args.id, args)
            .then((res) => res.data)
        );
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation,
});
