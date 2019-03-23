if(!process.env.PORT){
  process.env.PORT = 3000;
}
process.env.BASE_URL = 'http://localhost:' + process.env.PORT;
