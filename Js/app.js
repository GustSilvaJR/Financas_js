class Despesas{ //Criando uma classe que servirá de base para criação do meu objeto despesa
    constructor(ano,mes,dia,tipo,descricao,valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){ //Criação de um método para validação dos dados inseridos
        for(let aux in this){
            if(this[aux] != "" && this[aux] != undefined && this[aux] != null){
                 //valor valido
            }else{
                return false
            }
        }
        return true //Se percorrer todos os campos e não retornar false por ter campo em branco, retorna true no final   
    }
}

class RegistroBanco{ //Minha classe que representa minha comunicacao com o LocalStorage
   
    constructor(){
        if (localStorage.getItem("Id") === null) {
            localStorage.setItem("Id", 0)
        }
        //Aqui assim que o meu objeto do tipo RegistroBanco for construido, nesse caso o objeto "bd" criado logo abaixo, setá verificado se há salvo no localStorage do navegador se há algum dado salvo com o nome "Id", que será meu contador base para iniciar a contagem dinamica dos meus objetos salv. Caso não haja nenhum, ele cria e seta seu valor inicial como 0.
    }

    proxId(){
       let proximoId = localStorage.getItem("Id")
        return parseInt(proximoId) + 1
        
        //Aqui estou recuperando o meu valor base que ja foi instanciado no navegador e a partir do valor a ele setado estou retornando ele mais 1. Assim retornando o valor do proximo id disponivel para salvar um novo objeto
    }

    salvarDados(obj){ //salvar dados em localstorage
        //localStorage.setItem('despesa', JSON.stringify(obj)) Onde tenho despesa preciso substituir por um identificador dinamico 

        let id = this.proxId() //Aqui, a partir da funcao proxId(), salvo o proximo id disponivel para ser atrelado a um novo objeto

        localStorage.setItem(id, JSON.stringify(obj)) //Salvo no LocalStorage meu novo objeto passando como identificador a ele nossa variavel id

        localStorage.setItem("Id", id) //Seto o vaor da minha variavel base para contagem dos Ids, que registra a quantidade de ids registrados e que uso como referencia para o retorno do metodo proximoId()
    }

    captarRegistros(){ //Salvar todos dados cadastrados em um array
        let registros = Array() //Onde irei armazenar todos os dados do meu localStorage
        let id = localStorage.getItem('Id') //Recuperando a quantidade de dados cadastrados

        for(let i=1;i<=id;i++){ //Percorrer todos os meus dados cadastrados no meu localstorage
            if(localStorage.getItem(i)===null){
                continue //continua para o prox laço de reptiçao
            }else{
                let despesa = JSON.parse(localStorage.getItem(i))//Convertendo de json para o objeto literal e salvando dentro do meu array registros
                
                despesa.id = i
                console.log(despesa)

                registros.push(despesa)
            }
        }

        return registros
        //Para conseguir acessar os dados, preciso utilizar uma estrutura de repetição que irá filtrar pelo id de cada dado cadastrado
    }

    pesquisar(despesa){
        let todosRegistros = Array() 
        todosRegistros = this.captarRegistros()

        //O filter só irá retornar para dentro do array todosRegistros os dados que contenha os requisitos especificados

        //Ano
        if(despesa.ano != ''){
           todosRegistros = todosRegistros.filter(f => f.ano == despesa.ano)
        }

        //Mes
        if(despesa.mes != ''){
            todosRegistros = todosRegistros.filter(f => parseInt(f.mes) == parseInt(despesa.mes))
            
        }

        //Dia
        if(despesa.dia != ''){
            todosRegistros = todosRegistros.filter(f => f.dia == despesa.dia)
        }    

        //Tipo
        if(despesa.tipo != ''){
            todosRegistros = todosRegistros.filter(f => f.tipo == despesa.tipo)
        }

        //Descricao
        if(despesa.descricao != ''){
            todosRegistros = todosRegistros.filter(f => f.descricao == despesa.descricao)
        }

        //Valor
        if(despesa.valor != ''){ 
            console.log('passei aqui')   
            todosRegistros = todosRegistros.filter(f => parseInt(f.valor) <= parseInt(despesa.valor))
        }

        return todosRegistros
    }

    removerRegistro(id){
        localStorage.removeItem(id)
    }
}

let bd = new RegistroBanco() //Instanciando meu objeto RegistroBanco

function cadastroDados(){ //Recuperando valores do meu formulário e Instanciando meu Objeto

    let despesa = new Despesas(document.getElementById("ano").value, document.getElementById("mes").value, document.getElementById("dia").value, document.getElementById("tipo").value, document.getElementById("descricao").value, document.getElementById("valor").value)

    if (despesa.validarDados())
    {
        bd.salvarDados(despesa)

        document.getElementById('textModal').innerText = 'Despesa salva com sucesso!!'

        document.getElementById("conteudoModal").className = document.getElementById("conteudoModal").className.replace( /(?:^|\s)text-danger(?!\S)/g , ' text-success' )

        document.getElementById("buttonModal").className = document.getElementById("buttonModal").className.replace( /(?:^|\s)btn-danger(?!\S)/g , ' btn-success' )

        document.getElementById("ano").value = ''
        document.getElementById("mes").value = ''
        document.getElementById("dia").value = ''
        document.getElementById("tipo").value = ''
        document.getElementById("descricao").value = ''
        document.getElementById("valor").value = ''

        $("#responseFormModal").modal("show")
    }
    else
    {
        document.getElementById('textModal').innerText = 'Válor inserido inválido!'
        
        $("#responseFormModal").modal("show")

        document.getElementById("conteudoModal").className = document.getElementById("conteudoModal").className.replace( /(?:^|\s)text-success(?!\S)/g , ' text-danger' )

        document.getElementById("buttonModal").className = document.getElementById("buttonModal").className.replace( /(?:^|\s)btn-success(?!\S)/g , ' btn-danger' )
        
    }

    //Utilizei uma expressão regular para identificar se há ou não a classe que procuro e ,principalmente, alterar se necessário, dependendo se os dados foram inseridos da maneira correta ou não

}

function recuperarRegistros(desp = Array(), filter = false){//Função responsável por carregar todos os dados ja cadastrados no
                              //local storage na minha tabela de consulta.html assim que for abert

    let tabelaRegistros = document.getElementById('tableRegistros') //recuperando minha tabela
    tabelaRegistros.innerHTML = ''

    if (desp.length == 0 && filter == false){
        desp = bd.captarRegistros() //salvando todos os registros retornados pela funcao em uma var ja que comprovei que nao foi uma pesquisa feita pelo usuario, e sim uma abertura padrao da pagina consulta
    }

    desp.forEach(function(d){ //foreach para percorrer os objetos literais do meu array

        line = tabelaRegistros.insertRow() //criando uma linha na minha tabela

        function identificaTipo(){ //funcao para tratar valor do tipo
            switch (d.tipo) {
                case '1':
                    return 'Alimentação'
                    break;

                case '2':
                    return 'Educação'
                    break;

                case '3':
                    return 'Lazer'
                    break;

                case '4':
                    return 'Saúde'
                    break;

                case '5':
                    return 'Transporte'
                    break;            

                default:
                    return 'errorTipo'
                    break;
            }
        }

        //Inserindo colunas na linha que criei
        line.insertCell(0).innerText = `${d.dia}/${d.mes}/${d.ano}`
        line.insertCell(1).innerText = `${identificaTipo()}`
        line.insertCell(2).innerText = `${d.descricao}`
        line.insertCell(3).innerText = `${d.valor}`

        //Criando botão de exclusao
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        line.insertCell(4).append(btn)

        btn.onclick=function(){
            let idRemove = this.id.replace('id_despesa_','')
            bd.removerRegistro(idRemove)
            window.location.reload()
        }
    })
}

function filtrarConteudo(){
    ano = document.getElementById("ano").value 
    mes = document.getElementById("mes").value 
    dia = document.getElementById("dia").value 
    tipo = document.getElementById("tipo").value 
    descricao = document.getElementById("descricao").value 
    valor = document.getElementById("valor").value     

    let despFilter = new Despesas(ano,mes,dia,tipo,descricao,valor)

    let despesas = bd.pesquisar(despFilter)

    recuperarRegistros(despesas, true)   
}

    /* --------------SOBRE JSON----------------
    Criando uma função que irá salvar o meu objeto "despesa" dentro do local storage do navegador

     //Dessa forma eu to passando o objeto como um JSON, que basicamente converte o meu objeto literal em uma string( Literal pois eu ja setei seus valores) e salva no local storage do navegador

    //Um arquivo JSON geralmente é uma string que contem o comando de criacao refertente a algum objeto que eu queira enviar para outra aplicação. Dessa forma a outra aplicação conseguiria replicar meu objeto dando um JSON.parse(nome_objeto) convertendo assim para a instrução responsável por sua criação
    
    let teste = JSON.stringify(despesa)
    console.log(teste)

    testeConvertido = JSON.parse(teste)
    console.log(testeConvertido)*/
