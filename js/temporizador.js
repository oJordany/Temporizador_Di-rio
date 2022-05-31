(function($){
    $.fn.temporizador = function (opcoes){
        // Caso eu não passe nenhuma mensagem, ele usa essa como padrão
        // Nssa função extend() vc passa um objeto com todos os valores 'padrão' no primeiro parâmetro e no segundo vc passa o objeto recebido
        // Caso a mensagem não esteja presente em opces, ele sobrescreve pela mensagem que eu passei como parâmetro
        const opcoesFinais = $.extend({
            mensagem: 'Para o próximo dia!',
            horario: '23:59:59'
        }, opcoes)

        const horaDezena = $('<span class="digito">').html('0')
        const horaUnidade = $('<span class="digito">').html('0')
        const minutoDezena = $('<span class="digito">').html('0')
        const minutoUnidade = $('<span class="digito">').html('0')
        const segundoDezena = $('<span class="digito">').html('0')
        const segundoUnidade = $('<span class="digito">').html('0')
        
        const separadorHora = $('<span class="separador">').html(':')
        const separadorMinuto = $('<span class="separador">').html(':')
        const mensagem = $('<div class="mensagem">').html(opcoesFinais.mensagem)

        // Eu preciso dessa classe pois lá no CSS, eu estou assumindo que o elemento atual vai ter a classe temporizador
        // o elemento atual é a div
        // Esse this é o que é retornado pra mim lá no plugin2.html quando eu faço $('div')
        // Ou seja, ele me retorna um objeto/elemento jQuery
        // Se eu der o this, portanto, eu to falando desse objeto
        // Daí, eu posso adicionar as classes, dar o append ... tudo q o objeto jQuery permite
        $(this).addClass('temporizador')
        $(this).append(horaDezena, horaUnidade, separadorHora, 
            minutoDezena, minutoUnidade, separadorMinuto,
            segundoDezena, segundoUnidade, mensagem)
                    
        // Criando um grupo de captura com regex
        // Com isso,eu posso acessar o grupo que eu quero, pois ele me devolve um Array da seguinte forma [formatoCompleto, grupoHora, grupoMinuto, grupoSegundo]
        // Agora eu tenho acesso a cada grupo separadamente
        const regex = new RegExp(/(\d\d):(\d\d):(\d\d)/)
        const horarioAlvo = regex.exec(opcoesFinais.horario) // Isso devolve o meu array, que fica armazenado em horarioAlvo
        // console.log(horarioAlvo)
        
        let temporizador = setInterval(() => {
            const agora = new Date()
            const alvo = new Date()  
            alvo.setHours(horarioAlvo[1])
            alvo.setMinutes(horarioAlvo[2])
            alvo.setSeconds(horarioAlvo[3])

            // para pegar o tempo em milissegundos, a gente usa o .getTime()
            // Então, a diferença do horário alvo e do horário atual em milissegundos é dada por: 
            const diferencaEmMili = alvo.getTime() - agora.getTime()
            
            // Transformando isso para o formato de hora:minuto:segundo de novo 
            // Detalhe, a gente só vai fazer a regressão se a diferencaEmMili for positiva
            if (diferencaEmMili >= 0) {
                const diferenca = regex.exec(new Date(diferencaEmMili).toISOString()) // Transformo para ISOString, pq se não ele considera o meu Time Zone
                // Sem toISOString, ele pega com o TimeZone, daí não dá a hora exata que eu quero de fato
                // Com toISOString, ele pega a exata hora que eu to pedindo
                // Exemplo: Supondo que eu dê um new Date(1000 * 60 * 60 * 5 + 6000).toISOString()
                // Ele me retornaria isso: 
                // "1970-01-01T05:00:06.000Z" → Esse é o formato toISOString. Portanto eu uso a regex para capturar somente a parte que eu quero → 05:00:06
                // Então diferença já corresponde a diferença no formato certinho
                // No caso, como diferenca é um regex, é um array com o seguinte formato: [05:00:06, 05, 00, 06]
                // console.log(diferenca)

                // Agora é só formatar e colocar na página
                horaDezena.html(diferenca[1][0])
                horaUnidade.html(diferenca[1][1])
                minutoDezena.html(diferenca[2][0])
                minutoUnidade.html(diferenca[2][1])
                segundoDezena.html(diferenca[3][0])
                segundoUnidade.html(diferenca[3][1])
            } /*else {
                clearInterval(temporizador) // Isso aqui serve para parar de ficar monitorando essa minha variável temporizador
            }*/
        }, 1000) // Isso aqui vai ficar sendo atualizado de 1000 em 1000 milissegundos, conforme eu botei no meu setInterval()

        return this
    }
})(jQuery)