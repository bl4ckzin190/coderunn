
const questions = [
  {q: 'O que este código faz? console.log ("Olá, mundo!");', a:['Cria uma variável','Exibe uma mensagem no terminal','Lê um dado do usuário',' Faz um cálculo
'], correct:1},
  {q: 'O que este código faz? let (mas pode ser var) nome = "Ana";console.log("Olá " + nome)', a:[' Soma duas variáveis','Concatena texto e imprime no console','Lê nome do usuário','Altera o valor da variável
'], correct:1},
  {q: 'O que acontece?let x = 5;let y = 3;console.log(x + y);', a:['Exibe 53',' Exibe 5','Exibe 3','Exibe 8'], correct:3},
  {q: 'QO que o código faz? let texto = "Programação";console.log(texto.length);', a:['Exibe o primeiro caractere','Exibe o último caractere','Exibe quantas letras há no texto','Exibe Programação'], correct:2},
  {q: 'O que esse código faz? const pi = 3.14;console.log(pi);', a:[' Cria uma variável que pode ser alterada','Cria uma constante e a exibe','Erro: const não existeErro: const não existe',' Soma números'], correct:1},
  {q: 'Qual o resultado?let n1 = 4;let n2 = 6;console.log((n1 + n2) / 2);', a:['10','5','2)','4'], correct:1},
  {q: 'Qual estrutura serve para repetir enquanto condição?', a:['for','while','switch','if'], correct:1},
  {q: 'O que aparece no console? let nome = "Ana";console.log("Olá, " + nome + "!");', a:['Olá','Ana','Olá, Ana!','!Ana'], correct:2},
  {q: 'Qual forma cria array?', a:['{}','[]','()','<>'], correct:1},
  {q: 'Como acessar primeiro elemento do array arr?', a:['arr.first','arr(0)','arr[0]','arr->0'], correct:2},
  {q: 'Qual operador lógico É OU?', a:['&&','||','!','?'], correct:1},
  {q: 'Como converter JSON em objeto?', a:['JSON.toObj()','JSON.parse()','parse.JSON()','eval()'], correct:1},
  {q: 'Qual escopo tem `var`?', a:['bloco','global/função','módulo','arquivo'], correct:1},
  {q: 'Qual método adiciona item ao final do array?', a:['push','pop','shift','unshift'], correct:0},
  {q: 'Qual retorna índice do elemento?', a:['indexOf','find','search','where'], correct:0},
  {q: 'Qual Promise.resolve faz?', a:['cria promise resolvida','cancela promise','espera 1s','faz fetch'], correct:0},
  {q: 'Qual evento impede envio de formulário?', a:['e.preventDefault()','e.stopPropagation()','e.block()','return false'], correct:0},
  {q: 'O que template literals usam?', a:['""','``','<>','()'], correct:1},
  {q: 'Qual é typeof []?', a:['array','object','list','null'], correct:1},
  {q: 'Qual palavra cria classe?', a:['struct','class','object','new'], correct:1}
];

// UI refs
const qText = document.getElementById('question-text');
const choices = document.getElementById('choices');
const nextBtn = document.getElementById('next-btn');
const board = document.getElementById('board');
const player = document.getElementById('player');

let idx = 0; // current question index
let position = 0; // position on board 0..19

// build board
for(let i=0;i<20;i++){
  const sq = document.createElement('div');
  sq.className='square';
  sq.dataset.pos=i;
  sq.textContent = i+1;
  if(i===0) sq.style.border='1px solid var(--accent)';
  board.appendChild(sq);
}

function renderQuestion(){
  const item = questions[idx];
  qText.textContent = `(${idx+1}/${questions.length}) ${item.q}`;
  choices.innerHTML='';
  item.a.forEach((opt,i)=>{
    const b = document.createElement('button');
    b.className='choice';
    b.textContent = opt;
    b.addEventListener('click',()=>select(i));
    choices.appendChild(b);
  });
  nextBtn.classList.add('hidden');
}

function select(i){
  const item = questions[idx];
  const correct = item.correct;
  if(i===correct){
    // advance 1 or 2 spaces randomly
    const advance = Math.random() < 0.2 ? 2 : 1;
    position = Math.min(19, position + advance);
    movePlayerTo(position);
    showTempMessage('Correto — você avança ' + advance + '2 casa(s).', false);
  } else {
    // penalize: move back 1
    position = Math.max(0, position - 1);
    movePlayerTo(position);
    showTempMessage('Resposta incorreta — sistema corrompido...', true);
  }
  // disable choices
  Array.from(choices.children).forEach(b=>b.disabled=true);
  nextBtn.classList.remove('hidden');
}

function movePlayerTo(pos){
  const target = board.querySelector(`[data-pos='${pos}']`);
  if(!target) return;
  // place relative to grid
  player.style.left = (target.offsetLeft + 12) + 'px';
  player.style.top = (target.offsetTop + 12) + 'px';
}

function showTempMessage(txt, isError){
  const el = document.createElement('div');
  el.className='card';
  el.textContent = txt;
  if(isError) el.style.border='1px dashed #d04b4b';
  document.getElementById('question-area').appendChild(el);
  setTimeout(()=>el.remove(),1500);
}

nextBtn.addEventListener('click',()=>{
  idx++;
  if(idx>=questions.length){
    qText.textContent='Fim das situações — parabéns.';
    choices.innerHTML='';
    nextBtn.classList.add('hidden');
    return;
  }
  renderQuestion();
});

// initial
renderQuestion();
movePlayerTo(0);
