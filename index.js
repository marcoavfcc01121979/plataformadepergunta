const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
//const perguntaModel = require('./src/app/model/Pergunta');
const Pergunta = require('./src/app/model/Pergunta');
const Resposta = require('./src/app/model/Resposta');


connection
  .authenticate()
  .then(() => {
    console.log('conexao feita com sucesso')
  })
  .catch((msgErro)=>{
    console.log(msgErro)
  })

app.set('view engine','ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req,res)=>{
  Pergunta.findAll({raw: true, order:[
    ['id', 'DESC']
  ]}).then(perguntas => {
    res.render('index',{
      perguntas: perguntas
    });
  });
});


app.get("/perguntar", (req,res) => {
  res.render("perguntar")
})

app.post('/salvarpergunta', (req,res) => {
  const { titulo, descricao } = req.body;
  
  Pergunta.create({
    titulo: titulo,
    descricao: descricao
  }).then(()=> {
    res.redirect('/');
  });
})

app.get('/pergunta/:id', (req,res) => {
  const {id} = req.params;

  Pergunta.findOne({
    where: {id: id}
  })
    .then(pergunta => {
      if(pergunta != undefined){
        Resposta.findAll({
          where: {
            perguntaId: pergunta.id
          },
          order: [ ['id','DESC'] ]
        }).then(respostas => {
          res.render('pergunta',{
            pergunta: pergunta,
            respostas: respostas
          });
        })
      }else{
        res.redirect('/');
      }
    })
})

app.post('/responder', (req,res)=>{
  const {corpo, pergunta} = req.body;

  Resposta.create({
    corpo: corpo,
    perguntaId: pergunta
  })
    .then(() => {
      //console.log(pergunta);
      res.redirect("/pergunta/"+pergunta);
    });
});

app.listen(3333,  () => {
  console.log('App rodando!!!');
});