const { request, response } = require('express')
const express = require('express')
const app= express()
app.use(express.json())
const uuid= require('uuid')

let despesas = [
    {id: uuid.v4(), dataCompra:'15/06/2021', localCompra:'Kabum', valor:2000 , responsavel: 'João' },
    {id: uuid.v4(), dataCompra:'20/06/2021', localCompra:'Terabyte', valor:5000 , responsavel: 'Pedro' }
]

const CheckInArray = (request, response, next) =>{
    const {id} = request.params
    const funcid= despesas.find(func => func.id === id)
    console.log(funcid)

    if(!funcid){
        return response
            .status(400)
            .json({Error: 'Id inexistente.'})
    }
    return next()
}

const validafunc = (request, response, next) =>{
    const {dataCompra, localCompra, valor, responsavel} = request.body
    if(!dataCompra || !localCompra || !valor || !responsavel){
        return response
        .status(400)
        .json({Error:'Um dos campos está incompleto, favor preencher todos.'})
    }
    return next()
}


app.post('/despesas', validafunc, (request, response)=>{
    const {dataCompra, localCompra, valor, responsavel} = request.body
    const inserir={
        id: uuid.v4(),
        dataCompra,
        localCompra,
        valor,
        responsavel
    }
    despesas=[... despesas, inserir]
    return response
        .status(200)
        .json(inserir)
})


app.get('/despesas', (request, response)=>{
    return response
        .status(200)
        .json(despesas)
})


app.get('/despesas/gastotal', (request, response) =>{
    gastoTotal= despesas.reduce((total ,a)=> total += a.valor, 0)
    return response
        .status(200)
        .json({"Gasto total foi": gastoTotal })
})

app.get('/despesas/gastoresponsavel', (request, response) =>{
    const {responsavel} = request.query
    const respfilter= despesas.filter((resp) => resp.responsavel === responsavel)

    return response
        .status(200)
        .json(respfilter)
  
})


app.get('/despesas/:id', CheckInArray, (request, response)=>{
    const{id}= request.params
    const funcid= despesas.find(func => func.id === id)
    return response
        .status(200)
        .json(funcid)
})


app.listen(3333, () =>{
    console.log('Servidor Rodando !!')
})