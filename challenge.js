// Desafio Final: 20 minutos para decodificar "Aguardo vocês aqui"
const phrase = 'Aguardo vocês aqui';
// Para o desafio faremos uma cifra combinada (Caesar shift + base64) para dar dificuldade
function encodeFinal(s){
  // shift letters by 5 (preserve spaces and non-letters) then base64
  const shifted = s.split('').map(ch=>{
    const A='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const idx = A.indexOf(ch);
    if(idx===-1) return ch;
    const base = idx<26?0:26;
    return A[(idx-base+5)%26 + base];
  }).join('');
  return btoa(unescape(encodeURIComponent(shifted)));
}

const encodedText = encodeFinal(phrase);

const encodedEl = document.getElementById('encoded');
const timerEl = document.getElementById('timer');
const finalInput = document.getElementById('final-attempt');
const finalCheck = document.getElementById('final-check');
const finalMsg = document.getElementById('final-msg');

encodedEl.textContent = encodedText;

let total = 20*60; // seconds
let started = false;
let interval = null;

function startTimer(){
  if(started) return; started=true;
  interval = setInterval(()=>{
    total--;
    const m = Math.floor(total/60).toString().padStart(2,'0');
    const s = (total%60).toString().padStart(2,'0');
    timerEl.textContent = `${m}:${s}`;
    if(total<=0){ clearInterval(interval); finalFail('Tempo esgotado.'); }
  },1000);
}

function finalFail(txt){
  finalMsg.textContent = txt; finalMsg.style.color='#ff6666';
}

function finalSuccess(takenSeconds){
  finalMsg.textContent = 'Decodificado! Enviando para ranking...'; finalMsg.style.color='lightgreen';
  // Save ranking in localStorage (simulando ranking online)
  const name = prompt('Nome do grupo para o ranking:') || 'Anônimo';
  const list = JSON.parse(localStorage.getItem('jsgame_ranking')||'[]');
  list.push({name, time:takenSeconds, date:new Date().toISOString()});
  list.sort((a,b)=>a.time-b.time);
  localStorage.setItem('jsgame_ranking', JSON.stringify(list));
  // redirect to ranking page
  window.location.href = '../ranking.html';
}

finalCheck.addEventListener('click',()=>{
  startTimer();
  const val = finalInput.value.trim();
  if(!val) return finalFail('Digite a frase decodificada.');
  if(val.toLowerCase() === phrase.toLowerCase()){
    const elapsed = 20*60 - total;
    clearInterval(interval);
    finalSuccess(elapsed);
  } else finalFail('Entrada incorreta — corrupção detectada.');
});

// start timer when user focuses input
finalInput.addEventListener('focus',startTimer);
