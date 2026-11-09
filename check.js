
(()=>{
'use strict';
const $=id=>document.getElementById(id);
let level='easy', currentGame='math', questions=[], index=0, score=0, answered=false, lastGame='math';
let total=Number(localStorage.getItem('abtal_total')||0), best=Number(localStorage.getItem('abtal_best')||0);
const names={math:'جدول الضرب',colors:'عالم الألوان',animals:'مملكة الحيوانات',shapes:'الأشكال الهندسية',mix:'التحدي الشامل'};
const animals=[
 ['🐱','القطة','مياو','cat-meow'],['🐶','الكلب','نباح','dog-bark'],['🐄','البقرة','خوار','cow-moo'],['🐑','الخروف','ثغاء','sheep-bleat'],['🦁','الأسد','زئير','lion-roar'],['🐴','الحصان','صهيل','horse-neigh'],['🦆','البطة','بطبط','duck-quack'],['🐓','الديك','صياح','rooster-crow'],
 ['🐷','الخنزير','شخير','pig-oink'],['🐺','الذئب','عواء','wolf-howl'],['🐸','الضفدع','نقيق','frog-croak'],['🦉','البومة','هسهسة','owl-hoot'],['🐦','العصفور','زقزقة','songbird-chirp'],['🐒','القرد','صياح','monkey-chatter'],['🐔','الدجاجة','قوقأة','hen-cluck'],['🦇','الخفاش','صرير','bat-screech']
];
const animalAudio={
 'cat-meow':'https://sfxmint.com/dl/animal-cat-meow-34.mp3',
 'dog-bark':'https://sfxmint.com/dl/animal-dog-bark-25.mp3',
 'cow-moo':'https://sfxmint.com/dl/cow-moo-02.mp3',
 'sheep-bleat':'https://sfxmint.com/dl/sheep-bleat-02.mp3',
 'lion-roar':'https://sfxmint.com/dl/lion-roar-02.mp3',
 'horse-neigh':'https://sfxmint.com/dl/horse-neigh-03.mp3',
 'duck-quack':'https://sfxmint.com/dl/duck-quack-02.mp3',
 'rooster-crow':'https://sfxmint.com/dl/rooster-crow-02.mp3',
 'pig-oink':'https://sfxmint.com/dl/pig-oink-02.mp3',
 'wolf-howl':'https://sfxmint.com/dl/wolf-howl-02.mp3',
 'frog-croak':'https://sfxmint.com/dl/animal-frog-14.mp3',
 'owl-hoot':'https://sfxmint.com/dl/animal-owl-01.mp3',
 'songbird-chirp':'https://sfxmint.com/dl/animal-bird-24.mp3',
 'monkey-chatter':'https://sfxmint.com/dl/monkey-chatter-02.mp3',
 'hen-cluck':'https://sfxmint.com/dl/hen-cluck-02.mp3',
 'bat-screech':'https://sfxmint.com/dl/bat-screech-01.mp3'
};
let animalPlayer=null;
const colors=[['🔴','أحمر'],['🔵','أزرق'],['🟢','أخضر'],['🟡','أصفر'],['🟣','بنفسجي'],['🟠','برتقالي'],['⚫','أسود'],['⚪','أبيض'],['🟤','بني'],['🩷','وردي']];
const shapes=[['🔺','مثلث'],['🟦','مربع'],['🔵','دائرة'],['▭','مستطيل'],['⭐','نجمة'],['❤️','قلب'],['⬡','سداسي'],['🥚','بيضاوي']];
const rand=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>a.sort(()=>Math.random()-.5);
function distractors(correct,pool,n=3){return shuffle([...new Set([correct,...shuffle(pool.filter(x=>x!==correct)).slice(0,n)])]).slice(0,4)}
function makeQuestion(text,emoji,correct,pool){return {text,emoji,correct,answers:distractors(correct,pool)}}
function buildMath(){
 let arr=[];let max=level==='easy'?5:level==='medium'?9:12;let min=level==='hard'?6:1;
 for(let i=0;i<10;i++){let a=Math.floor(Math.random()*(max-min+1))+min,b=Math.floor(Math.random()*(max-min+1))+min,c=a*b;let pool=Array.from({length:25},(_,j)=>Math.max(0,c+Math.floor(Math.random()*13)-6)).filter(x=>x!==c);arr.push(makeQuestion(`${a} × ${b} = ؟`,'✖️',String(c),pool.map(String)))}
 return arr;
}
function buildList(kind,data){
 return Array.from({length:10},()=>{
  let item=rand(data),ask=kind==='colors'?'ما اسم اللون ده؟':kind==='animals'?'ما اسم الحيوان ده؟':'ما اسم الشكل ده؟';
  if(kind==='animals'&&Math.random()>.5){ask=`ما صوت ${item[1]}؟`;let q=makeQuestion(ask,item[0],item[2],data.map(x=>x[2]));q.animalSound=item[3];q.animalName=item[1];return q}
  let q=makeQuestion(ask,item[0],item[1],data.map(x=>x[1]));if(kind==='animals'){q.animalSound=item[3];q.animalName=item[1]}return q;
 });
}
function makeGameQuestions(game){return game==='math'?buildMath():game==='colors'?buildList('colors',colors):game==='animals'?buildList('animals',animals):game==='shapes'?buildList('shapes',shapes):shuffle([...buildMath().slice(0,3),...buildList('colors',colors).slice(0,2),...buildList('animals',animals).slice(0,3),...buildList('shapes',shapes).slice(0,2)]);}
function start(game){
 currentGame=game;lastGame=game;index=0;score=0;answered=false;
 questions=makeGameQuestions(game);$('quiz').classList.add('show');$('result').classList.remove('show');$('quiz').scrollIntoView({behavior:'smooth',block:'start'});$('gameName').textContent=names[game];render();
}
function render(){
 const q=questions[index];answered=false;$('questionNo').textContent=index+1;$('progressBar').style.width=(index/10*100)+'%';$('qEmoji').textContent=q.emoji;$('questionText').textContent=q.text;$('feedback').textContent='';$('nextBtn').disabled=true;$('nextBtn').textContent=index===9?'ابدأ جولة جديدة 🌟':'السؤال التالي ←';
 $('animalSoundBtn').classList.toggle('show',!!q.animalSound);$('answers').innerHTML='';q.answers.forEach(ans=>{let b=document.createElement('button');b.className='answer';b.textContent=ans;b.addEventListener('click',()=>choose(b,ans));$('answers').appendChild(b)});
 if($('soundToggle').checked)speak(q.text);
}
function choose(button,answer){
 if(answered)return;answered=true;let q=questions[index],correct=answer===q.correct;
 [...$('answers').children].forEach(b=>{b.disabled=true;if(b.textContent===q.correct)b.classList.add('correct')});
 if(correct){let earned=level==='easy'?10:level==='medium'?15:20;score+=earned;total+=earned;best=Math.max(best,score);localStorage.setItem('abtal_total',total);localStorage.setItem('abtal_best',best);updateStats();$('feedback').textContent='برافو عليك! إجابة صحيحة ⭐';$('feedback').style.color='var(--good)';if($('effectToggle').checked)beep(660)}
 else{button.classList.add('wrong');$('feedback').textContent=`مش مشكلة! الإجابة الصحيحة: ${q.correct}`;$('feedback').style.color='var(--bad)';if($('effectToggle').checked)beep(220)}
 $('nextBtn').disabled=false;
}
function next(){if(!answered)return;if(index<questions.length-1){index++;render()}else{questions=makeGameQuestions(currentGame);index=0;render();$('feedback').textContent='عاش يا بطل! جولة جديدة بأسئلة مختلفة 🌟';$('feedback').style.color='var(--good)';}}
function finish(){
 best=Math.max(best,score);localStorage.setItem('abtal_best',best);updateStats();
 $('quiz').classList.remove('show');$('result').classList.add('show');$('progressBar').style.width='100%';
 $('resultEmoji').textContent=score>=120?'🥇':score>=70?'🏆':'💪';$('resultTitle').textContent=score>=120?'أسطورة المعرفة!':score>=70?'أحسنت يا بطل!':'بداية جميلة، حاول تاني!';
 $('resultText').textContent=`جمعت ${score} نقطة من أصل ${level==='easy'?100:level==='medium'?150:200} نقطة في ${names[currentGame]}. استمر في التدريب وهتوصل للأفضل!`;$('result').scrollIntoView({behavior:'smooth'});
}
function updateStats(){$('totalScore').textContent=total;$('bestScore').textContent=best}
function playAnimalSound(){let q=questions[index];if(!q?.animalSound)return;try{if(animalPlayer){animalPlayer.pause();animalPlayer.currentTime=0}animalPlayer=new Audio(animalAudio[q.animalSound]);animalPlayer.volume=.9;animalPlayer.play().catch(()=>speak(`صوت ${q.animalName} ${animals.find(a=>a[1]===q.animalName)?.[2]||''}`))}catch(e){speak(`صوت ${q.animalName}`)}}
function speak(text){if(!('speechSynthesis'in window))return;window.speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(text);u.lang='ar-EG';u.rate=.85;window.speechSynthesis.speak(u)}
function beep(freq){try{let c=new(window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=freq;g.gain.value=.07;o.start();o.stop(c.currentTime+.12)}catch(e){}}
function home(){$('quiz').classList.remove('show');$('result').classList.remove('show');window.scrollTo({top:0,behavior:'smooth'})}
document.querySelectorAll('.game').forEach(b=>b.addEventListener('click',()=>start(b.dataset.game)));
document.querySelectorAll('.level').forEach(b=>b.addEventListener('click',()=>{level=b.dataset.level;document.querySelectorAll('.level').forEach(x=>x.classList.toggle('active',x===b))}));
$('nextBtn').addEventListener('click',next);$('homeBtn').addEventListener('click',home);$('resultHomeBtn').addEventListener('click',home);$('againBtn').addEventListener('click',()=>start(lastGame));$('speakBtn').addEventListener('click',()=>speak(questions[index]?.text||''));$('animalSoundBtn').addEventListener('click',playAnimalSound);$('resetBtn').addEventListener('click',()=>{if(confirm('متأكد إنك عايز تصفر مجموع النقاط وأفضل نتيجة؟')){total=0;best=0;localStorage.removeItem('abtal_total');localStorage.removeItem('abtal_best');updateStats()}});
updateStats();
})();
