function renderPotion(){
  if(index>=20)return complete();
  updateProgress();
  const q=rounds.potion[index];
  if(potionPhase==='vowel'){
    document.querySelector('#game-instruction').textContent='Choose the missing vowel for the potion word.';
    board.innerHTML=`<div class="potion-board"><p class="potion-step">STEP 1 · ADD THE VOWEL</p><div class="potion-word">${q.pattern}</div><div class="potion-options">${['a','e','i','o','u'].map(v=>`<button class="potion-vial" data-v="${v}">${v}</button>`).join('')}</div></div>`;
    board.querySelectorAll('.potion-vial').forEach(button=>button.onclick=()=>{
      if(locked)return;
      if(button.dataset.v!==q.vowel){playSound(false);feedback.textContent='That ingredient does not complete the word. Try again!';feedback.className='feedback bad';button.animate([{transform:'rotate(-7deg)'},{transform:'rotate(7deg)'},{transform:'rotate(0)'}],{duration:280});return}
      locked=true;playSound(true);reward();button.classList.add('correct');feedback.textContent=`Perfect! The word is “${q.word}”.`;feedback.className='feedback good';potionPhase='type';setTimeout(()=>{locked=false;feedback.textContent='';renderPotion()},700)
    });
    return;
  }
  document.querySelector('#game-instruction').textContent='Now identify the syllable type.';
  board.innerHTML=`<div class="potion-board"><p class="potion-step">STEP 2 · NAME THE SYLLABLE</p><div class="potion-word">${q.word}</div><div class="potion-types"><button class="answer" data-type="Open">open syllable</button><button class="answer" data-type="Closed">closed syllable</button></div></div>`;
  board.querySelectorAll('.answer').forEach(button=>button.onclick=()=>{
    if(locked)return;
    if(button.dataset.type!==q.type){playSound(false);feedback.textContent=`Look at the final letter in “${q.word}”. Try again!`;feedback.className='feedback bad';button.classList.add('wrong');setTimeout(()=>button.classList.remove('wrong'),450);return}
    locked=true;playSound(true);reward();button.classList.add('correct');feedback.textContent=`Correct — “${q.word}” has a ${q.type.toLowerCase()} syllable!`;feedback.className='feedback good';setTimeout(()=>{index++;potionPhase='vowel';locked=false;feedback.textContent='';renderPotion()},850)
  });
}

function renderDragon(){
  if(index>=20)return complete();
  updateProgress();
  document.querySelector('#game-instruction').textContent='Select an egg, then choose its syllable nest.';
  const eggs=rounds.dragon[index];let selected=null,hatched=0;
  board.innerHTML=`<div class="dragon-board"><div class="egg-row">${eggs.map(([word,type],i)=>`<button class="word-egg" data-index="${i}" data-type="${type}">${word}</button>`).join('')}</div><p class="dragon-tip">Choose an egg to rescue.</p><div class="nest-row"><button class="nest" data-type="Open">☀ OPEN NEST</button><button class="nest" data-type="Closed">◉ CLOSED NEST</button></div></div>`;
  const tip=board.querySelector('.dragon-tip');
  board.querySelectorAll('.word-egg').forEach(egg=>egg.onclick=()=>{if(egg.classList.contains('hatched')||locked)return;board.querySelectorAll('.word-egg').forEach(e=>e.classList.remove('selected'));egg.classList.add('selected');selected=egg;tip.textContent=`Where does “${egg.textContent}” belong?`});
  board.querySelectorAll('.nest').forEach(nest=>nest.onclick=()=>{
    if(locked)return;
    if(!selected){playSound(false);tip.textContent='Choose an egg first!';return}
    if(nest.dataset.type!==selected.dataset.type){playSound(false);feedback.textContent=`“${selected.textContent}” belongs in the other nest.`;feedback.className='feedback bad';selected.animate([{transform:'translateX(-5px)'},{transform:'translateX(5px)'},{transform:'translateX(0)'}],{duration:280});return}
    playSound(true);reward();selected.classList.remove('selected');selected.classList.add('hatched');hatched++;feedback.textContent='The egg is safe — a baby dragon hatched! ✦';feedback.className='feedback good';selected=null;tip.textContent=hatched<3?'Choose the next egg.':'All three dragons are safe!';
    if(hatched===3){locked=true;setTimeout(()=>{index++;locked=false;feedback.textContent='';renderDragon()},1800)}
  });
}
