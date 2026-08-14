function renderPotion(){
  if(index>=20)return complete();
  updateProgress();
  const q=rounds.potion[index];
  if(potionPhase==='vowel'){
    document.querySelector('#game-instruction').textContent='Choose the missing vowel for the potion word.';
    board.innerHTML=potionStage(q,`<p class="potion-step">STEP 1 · CHOOSE AN INGREDIENT</p><div class="potion-word">${q.pattern}</div><div class="potion-options">${['a','e','i','o','u'].map((v,i)=>`<button class="potion-vial vial-${i}" data-v="${v}"><i></i><b>${v}</b></button>`).join('')}</div>`);
    board.querySelectorAll('.potion-vial').forEach(button=>button.onclick=()=>{
      if(locked)return;
      if(button.dataset.v!==q.vowel){playSound(false);feedback.textContent='That ingredient does not complete the word. Try again!';feedback.className='feedback bad';button.animate([{transform:'rotate(-7deg)'},{transform:'rotate(7deg)'},{transform:'rotate(0)'}],{duration:280});return}
      locked=true;playSound(true);reward();button.classList.add('correct');addPotionIngredient(button.dataset.v);feedback.textContent=`Perfect! The word is “${q.word}”.`;feedback.className='feedback good';potionPhase='type';setTimeout(()=>{locked=false;feedback.textContent='';renderPotion()},1050)
    });
    return;
  }
  document.querySelector('#game-instruction').textContent='Now identify the syllable type.';
  board.innerHTML=potionStage(q,`<p class="potion-step">STEP 2 · NAME THE SYLLABLE</p><div class="potion-word">${q.word}</div><div class="potion-types"><button class="answer" data-type="Open">open syllable</button><button class="answer" data-type="Closed">closed syllable</button></div>`);
  board.querySelectorAll('.answer').forEach(button=>button.onclick=()=>{
    if(locked)return;
    if(button.dataset.type!==q.type){playSound(false);feedback.textContent=`Look at the final letter in “${q.word}”. Try again!`;feedback.className='feedback bad';button.classList.add('wrong');setTimeout(()=>button.classList.remove('wrong'),450);return}
    locked=true;playSound(true);reward();button.classList.add('correct');addPotionIngredient(q.type==='Open'?'e':'a');feedback.textContent=`Correct — “${q.word}” has a ${q.type.toLowerCase()} syllable!`;feedback.className='feedback good';setTimeout(()=>{index++;potionPhase='vowel';locked=false;feedback.textContent='';renderPotion()},1150)
  });
}

function potionStage(q,controls){
  const liquidTop=74-(potionLevel*.28);
  return `<div class="potion-board"><div class="brew-lab"><div class="cauldron-wrap" style="--potion-hue:${potionHue}deg;--liquid-top:${liquidTop}px;--liquid-top-mobile:${41-potionLevel*.155}px;--fill-opacity:${.22+potionLevel*.007}"><div class="potion-liquid"><i></i><i></i><i></i></div><img class="cauldron-img" src="assets/potion-cauldron-3d.png" alt="Magic cauldron filling with potion"><img class="ingredient-drop" src="assets/potion-ingredient-3d.png" alt=""><div class="brew-level"><i style="height:${potionLevel}%"></i></div></div><div class="brew-task">${controls}<small class="brew-count">Potion power: <b>${Math.round(potionLevel)}%</b></small></div></div></div>`
}

function addPotionIngredient(vowel){
  potionLevel=Math.min(100,potionLevel+2.5);potionHue=({a:330,e:42,i:205,o:275,u:155})[vowel]??potionHue;
  const wrap=board.querySelector('.cauldron-wrap');if(!wrap)return;wrap.style.setProperty('--potion-hue',potionHue+'deg');wrap.style.setProperty('--liquid-top',(74-potionLevel*.28)+'px');wrap.style.setProperty('--liquid-top-mobile',(41-potionLevel*.155)+'px');wrap.style.setProperty('--fill-opacity',.22+potionLevel*.007);wrap.querySelector('.brew-level i').style.height=potionLevel+'%';wrap.classList.remove('adding');void wrap.offsetWidth;wrap.classList.add('adding')
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

function renderStarship(){
  if(index>=20)return complete();
  updateProgress();
  const q=rounds.starship[index];let transformed=false;
  board.innerHTML=`<div class="starship-board"><div class="ship-hud"><span>MISSION <b>${q.vowel.toUpperCase()}</b></span><div><i style="width:${starshipFuel}%"></i></div><small>WORDS LAUNCHED ${index}/20</small></div><div class="word-engine"><div class="ship-word">${q.base}</div></div><p class="ship-prompt"><b>CLOSED SYLLABLE</b> · read the word, then launch final e</p><div class="ship-actions"><button class="add-e-button"><span>ADD</span> e</button><button class="ship-next" hidden>NEXT ➜</button></div></div>`;
  const addButton=board.querySelector('.add-e-button'),nextButton=board.querySelector('.ship-next'),engine=board.querySelector('.word-engine'),word=board.querySelector('.ship-word'),prompt=board.querySelector('.ship-prompt');
  addButton.onclick=()=>{if(transformed)return;transformed=true;gameCombo++;starshipFuel=Math.min(100,starshipFuel+5);playSound(true);reward();engine.classList.add('launched');addButton.disabled=true;setTimeout(()=>{word.textContent=q.magic;word.classList.add('long-word');prompt.innerHTML=`<b>MAGIC-E · LONG ${q.vowel.toUpperCase()}</b> · “${q.base}” becomes “${q.magic}”`;addButton.hidden=true;nextButton.hidden=false},430);board.querySelector('.ship-hud i').style.width=starshipFuel+'%';board.querySelector('.ship-hud small').textContent=`WORDS LAUNCHED ${index+1}/20`;feedback.textContent=`Magic! “${q.base}” becomes “${q.magic}”.`;feedback.className='feedback good'};
  nextButton.onclick=()=>{index++;feedback.textContent='';feedback.className='feedback';renderStarship()};
}
