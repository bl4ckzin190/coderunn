// Parte 2: 3 repertórios — cada acerto revela parte da codificação
const repos = [
  {id:0,title:'Repertório A — 01',desc:'Cada acerto revela próximos caracteres cifrados.',cipher:'caesar'},
  {id:1,title:'Repertório B — 02',desc:'Cada acerto revela fatias do texto.',cipher:'base64'},
  {id:2,title:'Repertório C — 03',desc:'Cada acerto revela fatias do texto.',cipher:'morse'}
];

// a frase original que deve ser decodificada (mesma em todos)
const original = 'Tinky winky voltara em breve';

// encoded forms
function caesarEncode(s,shift=3){
  return s.split('').map(c=>{
    const A='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const idx=A.indexOf(c);
    if(idx===-1) return c;
    const base = idx < 26 ? 0 : 26;
    return A[(idx-base+shift)%26 + base];
  }).join('');
}
function toBase64(s){
  try{return btoa(unescape(encodeURIComponent(s)));}catch(e){return window.btoa(s);} }
function toMorse(s){
  const map = {a:'.-',b:'-...',c:'-.-.',d:'-..',e:'.',f:'..-.',g:'--.',h:'....',i:'..',j:'.---',k:'-.-',l:'.-..',m:'--',n:'-.',o:'---',p:'.--.',q:'--.-',r:'.-.',s:'...',t:'-',u:'..-',v:'...-',w:'.--',x:'-..-',y:'-.--',z:'--..',' ':'/'};
  return s.toLowerCase().split('').map(c=>map[c]||c).join(' ');
}

const encoded = [
  caesarEncode(original,3),
  toBase64(original),
  toMorse(original)
];

// Each repo has 15 questions (simplified placeholders)
function makeQuestions(n){
  const qs=[];
  for(let i=0;i<n;i++) qs.push({q:`Pergunta ${i+1}: selecione a resposta correta.`, a:['Opção A','Opção B','Opção C','Opção D'], correct: Math.floor(Math.random()*4)});
  return qs;
}
const repoQs = [makeQuestions(15), makeQuestions(15), makeQuestions(15)];

// UI
const repoBtns = document.querySelectorAll('.repo-btn');
const repoArea = document.getElementById('repo-area');
const repoTitle = document.getElementById('repo-title');
const repoDesc = document.getElementById('repo-desc');
const qWrap = document.getElementById('question-wrap');
const encodedSpan = document.getElementById('encoded-snippet');
const attemptInput = document.getElementById('attempt');
const checkBtn = document.getElementById('check-decode');
const msg = document.getElementById('msg');

let curRepo = null; let qIndex=0; let revealedCount=0; const revealStep=2; // chars per correct

repoBtns.forEach(b=>b.addEventListener('click',()=>openRepo(Number(b.dataset.repo))));
checkBtn.addEventListener('click',checkDecode);

function openRepo(id){
  curRepo = id; qIndex=0; revealedCount=0; repoArea.classList.remove('hidden');
  repoTitle.textContent = repos[id].title; repoDesc.textContent = repos[id].desc;
  encodedSpan.textContent = '—';
  renderQuestion();
}

function renderQuestion(){
  qWrap.innerHTML='';
  const item = repoQs[curRepo][qIndex];
  const p = document.createElement('p'); p.textContent = item.q; qWrap.appendChild(p);
  const list = document.createElement('div');
  item.a.forEach((opt,i)=>{
    const btn = document.createElement('button'); btn.textContent = opt; btn.className='choice'; btn.addEventListener('click',()=>select(i));
    list.appendChild(btn);
  });
  qWrap.appendChild(list);
}

function select(i){
  const item = repoQs[curRepo][qIndex];
  if(i===item.correct){
    // reveal next portion of encoded string
    revealedCount = Math.min(encoded[curRepo].length, revealedCount + revealStep);
    encodedSpan.textContent = encoded[curRepo].slice(0,revealedCount) + (revealedCount < encoded[curRepo].length ? '…' : '');
    showMsg('Acertou — trecho revelado.');
  } else {
    // show buggy message
    showMsg(glitchText('ERRO: falha ao decodificar segmento — 0x03'), true);
  }
  // next question
  qIndex++;
  if(qIndex >= repoQs[curRepo].length) {
    qWrap.innerHTML = '<p>Fim do repertório.</p>';
  } else {
    setTimeout(renderQuestion,700);
  }
}

function showMsg(t,err=false){
  msg.textContent = t; msg.style.color = err ? '#ff6666' : 'lightgreen';
}

function glitchText(s){
  // faz uma string com caracteres corrompidos
  return s.split('').map(ch=> Math.random()<0.12? String.fromCharCode(33+Math.floor(Math.random()*30)) : ch).join('');
}

function checkDecode(){
  const attempt = attemptInput.value.trim();
  if(!attempt) return showMsg('Digite algo para verificar.',true);
  if(attempt.toLowerCase() === original.toLowerCase()){
    showMsg('Decodificação correta — parabéns!');
    // reveal full
    encodedSpan.textContent = encoded[curRepo];
  } else {
    showMsg(glitchText('DECODE ERROR: entrada inválida.'), true);
  }
}
