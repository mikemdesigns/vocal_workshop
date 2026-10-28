(()=>{
'use strict';
// Edit the practice labels, video IDs and run timestamps in assets/content.js.
const content=window.DAILY_VOCAL_CONTENT;
const steps=content.steps;
const brand=content.studio||{};
function showBrand(){
  const name=brand.name||'Superstar Vocal Studio';
  document.title=name+' · My Practice';
  document.querySelectorAll('[data-studio-name]').forEach(el=>el.textContent=name);
  const match=name.match(/^(.*?)\s+Vocal Studio$/i);
  document.querySelectorAll('[data-studio-primary]').forEach(el=>el.textContent=(match?match[1]:name).toUpperCase());
  document.querySelectorAll('[data-studio-secondary]').forEach(el=>el.textContent=match?'VOCAL STUDIO':'MY MUSIC STUDIO');
  const h=document.querySelector('[data-studio-headline]');
  // The headline uses only trusted, repo-authored content; don't place user input here.
  if(h&&brand.headline)h.innerHTML=brand.headline;
  const m=document.querySelector('[data-studio-message]');if(m&&brand.message)m.textContent=brand.message;
}
const KEY='daily-vocal-studio-v3';
const OLD_KEY='daily-vocal-studio-v2';
const $=id=>document.getElementById(id);
const today=()=>{let d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
let state={date:today(),step:0,completed:[false,false,false,false,false],history:{},songTitle:'',songUrl:'',songPhrase:'',chapter:0,songDraft:null,savedPhrases:[],activePhraseId:null};
try {let p=JSON.parse(localStorage.getItem(KEY)||localStorage.getItem(OLD_KEY)||'{}');if(p&&typeof p==='object'){state={...state,...p};if(state.date!==today()){state.date=today();state.step=0;state.completed=[false,false,false,false,false];state.chapter=0;}if(!Array.isArray(state.completed)||state.completed.length!==5)state.completed=[false,false,false,false,false];if(!state.history||typeof state.history!=='object')state.history={};}} catch(e){}

// Keep the former song notes and link when updating from v2 on the same site.
if(!Array.isArray(state.savedPhrases))state.savedPhrases=[];
if(!state.songDraft||typeof state.songDraft!=='object'){
 const migrated=parseSongLink(state.songUrl||'');
 state.songDraft={source:state.songUrl||'',videoId:migrated?.videoId||'',title:state.songTitle||'',label:'',notes:state.songPhrase||'',start:migrated?.start??0,end:migrated?.end??8,tempo:migrated?.tempo??75};
}
function getDraft(){return state.songDraft;}

let timerSeconds=420,timerRunning=false,timerInterval=null,timerFor=3;
function persist(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function youtube(id,start=0,end=0){let p=new URLSearchParams({rel:'0',playsinline:'1',modestbranding:'1'});if(start)p.set('start',String(start));if(end)p.set('end',String(end));return `https://www.youtube-nocookie.com/embed/${id}?${p.toString()}`;}
function youtubelink(id,start=0){return `https://www.youtube.com/watch?v=${id}${start?'&t='+start+'s':''}`;}
function resource(id,start,end,label){let link=youtubelink(id,start);return `<div class="media-wrap"><iframe src="${youtube(id,start,end)}" title="${esc(label)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe></div><div class="resource-line"><span>${esc(label)}</span><a href="${link}" target="_blank" rel="noopener noreferrer">Open directly on YouTube ↗</a></div>`}
function select(i){clearTimer();state.step=i;state.chapter=0;persist();render();window.scrollTo({top:0,behavior:'smooth'});}
function markAndNext(){state.completed[state.step]=true;state.history[state.date]=state.completed.every(Boolean);const old=Object.keys(state.history).sort().reverse().slice(0,90);state.history=Object.fromEntries(old.map(k=>[k,state.history[k]]));if(state.step===4){state.step=5;}else{state.step+=1;}clearTimer();persist();render();window.scrollTo({top:0,behavior:'smooth'})}
function clearTimer(){timerRunning=false;if(timerInterval!==null)clearInterval(timerInterval);timerInterval=null;timerSeconds=420;}
function chapterChoice(i){state.chapter=i;persist();renderContentOnly()}
function parseTime(v){
 if(typeof v==='number')return Number.isFinite(v)&&v>=0?v:null;
 const text=String(v||'').trim();
 if(!text)return null;
 if(/^\d+(?:\.\d+)?$/.test(text))return Number(text);
 if(/^\d+(?:\.\d+)?s$/.test(text))return Number(text.slice(0,-1));
 const yt=text.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+(?:\.\d+)?)s)?$/i);
 if(yt&&yt[0]&&(yt[1]||yt[2]||yt[3]))return Number(yt[1]||0)*3600+Number(yt[2]||0)*60+Number(yt[3]||0);
 if(!/^\d+(?::\d{1,2}){1,2}(?:\.\d+)?$/.test(text))return null;
 const units=text.split(':').map(Number);
 if(units.some(n=>!Number.isFinite(n)))return null;
 let value=0;for(const n of units)value=value*60+n;
 return value;
}
function formatTime(v){
 let sec=Number(v);if(!Number.isFinite(sec)||sec<0)sec=0;
 let m=Math.floor(sec/60),s=sec-m*60;
 const sTxt=s.toFixed(2).padStart(5,'0');
 return m+':'+sTxt;
}
function parseSongLink(text){
 const original=String(text||'').trim();
 if(/^[A-Za-z0-9_-]{11}$/.test(original))return {videoId:original};
 let raw=original;
 if(/^(?:www\.)?(?:youtu\.be|youtube\.com|m\.youtube\.com|music\.youtube\.com|looptube\.xyz|www\.looptube\.xyz)\//i.test(raw))raw='https://'+raw;
 let u;try{u=new URL(raw);}catch{return null;}
 if(!['http:','https:'].includes(u.protocol))return null;
 const host=u.hostname.toLowerCase().replace(/^www\./,'');let id='';
 if(host==='youtu.be')id=u.pathname.split('/')[1]||'';
 else if(['youtube.com','m.youtube.com','music.youtube.com','youtube-nocookie.com'].includes(host)){
  const paths=u.pathname.split('/').filter(Boolean);
  if(paths[0]==='watch')id=u.searchParams.get('v')||'';
  else if(['embed','shorts','live','v'].includes(paths[0]))id=paths[1]||'';
 }else if(host==='looptube.xyz'){
  const paths=u.pathname.split('/').filter(Boolean);
  id=paths[0]==='embed'?(paths[1]||''):(u.searchParams.get('vid')||'');
 }else return null;
 if(!/^[A-Za-z0-9_-]{11}$/.test(id))return null;
 const startRaw=u.searchParams.get('start')||u.searchParams.get('t');
 const endRaw=u.searchParams.get('end');
 let tempoRaw=u.searchParams.get('tempo');
 let tempo=tempoRaw==null?null:Number(tempoRaw);
 if(tempo!=null&&tempo>0&&tempo<=2)tempo=tempo*100;
 if(tempo!=null&&(!Number.isFinite(tempo)||tempo<25||tempo>200))tempo=null;
 let start=startRaw==null?null:parseTime(startRaw);
 let end=endRaw==null?null:parseTime(endRaw);
 return {videoId:id,start,end,tempo};
}
function loopUrl(d,forEmbed=true){
 if(!d.videoId||!/^[A-Za-z0-9_-]{11}$/.test(d.videoId))return '';
 const url=forEmbed?`https://www.looptube.xyz/embed/${d.videoId}`:'https://www.looptube.xyz/';
 const qs=new URLSearchParams();
 if(!forEmbed)qs.set('vid',d.videoId);
 if(Number.isFinite(d.start))qs.set('start',String(d.start));
 if(Number.isFinite(d.end))qs.set('end',String(d.end));
 if(Number.isFinite(d.tempo))qs.set('tempo',String(d.tempo));
 if(forEmbed){qs.set('theme','neutral');qs.set('controls','full');qs.set('brandColor','2c7367');}
 return url+'?'+qs.toString();
}
function feedback(msg,isError=false){let node=$('songFeedback');if(node){node.textContent=msg;node.classList.toggle('error',isError)}}
function syncDraftText(){
 const d=getDraft();
 for(const [id,key] of [['songTitleNew','title'],['songPhraseNew','label'],['songNotes','notes']]){
  if($(id))d[key]=$(id).value;
 }
 persist();
}
function renderPlayer(){
 const d=getDraft(),container=$('loopEmbedSlot');if(!container)return;
 if(!d.videoId){container.innerHTML=`<div class="loop-placeholder"><span class="play-symbol" aria-hidden="true">♫</span><b>Your song goes here</b><p>Paste a YouTube or LoopTube link above and tap Load video.</p></div>`;}
 else{
  const url=loopUrl(d);
  container.innerHTML=`<iframe id="looptubeFrame" src="${esc(url)}" title="LoopTube player for ${esc(d.title||'my song')}" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>`;
 }
 const original=$('openLoopTube');if(original){original.href=d.videoId?loopUrl(d,false):'https://www.looptube.xyz/';}
 const direct=$('originalVideo');if(direct){direct.href=d.videoId?'https://www.youtube.com/watch?v='+d.videoId:'https://www.youtube.com/';}
}
function draftFromInputs(){
 syncDraftText();
 const d=getDraft();
 const a=parseTime($('loopStart').value),b=parseTime($('loopEnd').value);
 const tempo=Number($('loopTempo').value);
 if(a===null||b===null||b<=a){feedback('Enter a valid start and end (example: 1:26.32 to 1:47.96), with end after start.',true);return false;}
 if(!Number.isFinite(tempo)||tempo<25||tempo>200){feedback('Choose a speed between 25% and 200%.',true);return false;}
 if(!d.videoId){feedback('Load a YouTube or LoopTube link first.',true);return false;}
 d.start=Math.round(a*100)/100;d.end=Math.round(b*100)/100;d.tempo=tempo;
 persist();return true;
}
function applyLoop(){if(!draftFromInputs())return false;renderPlayer();feedback('Loop applied to player. Press play in LoopTube to practice.');return true;}
function loadSongInput(){
 const raw=$('songLinkInput').value.trim();
 const parsed=parseSongLink(raw);
 if(!parsed){feedback('Paste a valid YouTube or LoopTube link (or an 11-character YouTube video ID).',true);return;}
 syncDraftText();
 const prev=getDraft(),same=prev.videoId===parsed.videoId;
 state.songDraft={...prev,source:raw,videoId:parsed.videoId,
  start:parsed.start??(same?prev.start:0),
  end:parsed.end??(same?prev.end:Math.max(8,(parsed.start??0)+8)),
  tempo:parsed.tempo??(same?prev.tempo:75)};
 if(state.songDraft.end<=state.songDraft.start)state.songDraft.end=state.songDraft.start+8;
 state.activePhraseId=null;persist();renderContentOnly();
 feedback('Video loaded! Set a loop and save it to return to this phrase.');
}
function savePhrase(forceNew=false){
 if(!draftFromInputs())return;
 const d=getDraft();const title=d.title.trim()||'My song',label=d.label.trim()||`Phrase ${formatTime(d.start)}–${formatTime(d.end)}`;
 const id=(!forceNew&&state.activePhraseId)?state.activePhraseId:String(Date.now())+'-'+String(Math.random()).slice(2,7);
 const entry={...d,title,label,id,updated:Date.now()};
 const ix=state.savedPhrases.findIndex(x=>x.id===id);
 if(ix>=0)state.savedPhrases[ix]=entry;else state.savedPhrases.unshift(entry);
 state.activePhraseId=id;
 persist();renderPlayer();renderSavedPhrases();feedback(ix>=0?'Saved changes. This phrase will be ready next time.':'Phrase saved! It will be here when you reopen the app.');
}
function loadSaved(id){
 const phrase=state.savedPhrases.find(x=>x.id===id);if(!phrase)return;
 state.songDraft={...phrase};state.activePhraseId=id;persist();renderContentOnly();feedback(`Resumed “${phrase.label}”.`);
}
function deleteSaved(id){
 const found=state.savedPhrases.find(x=>x.id===id);if(!found)return;
 if(!confirm(`Remove saved phrase “${found.label}”?`))return;
 state.savedPhrases=state.savedPhrases.filter(x=>x.id!==id);
 if(state.activePhraseId===id)state.activePhraseId=null;
 persist();renderSavedPhrases();feedback('Saved phrase removed.');
}
function newPhrase(){
 syncDraftText();state.activePhraseId=null;
 state.songDraft={...getDraft(),label:'',notes:''};
 persist();renderContentOnly();feedback('New phrase ready. Change the loop times, name it, and save.');
 if($('songPhraseNew'))$('songPhraseNew').focus();
}
function renderSavedPhrases(){
 const el=$('savedList');if(!el)return;
 const list=state.savedPhrases||[];
 if(!list.length){el.innerHTML='<div class="saved-empty">No saved phrases yet. Pick your first A–B loop and tap “Save phrase.”</div>';return;}
 el.innerHTML=list.map(p=>`<div class="saved-entry ${p.id===state.activePhraseId?'current':''}"><div><div class="saved-name">${esc(p.label||'Saved phrase')}</div><div class="saved-meta">${esc(p.title||'My song')} · ${formatTime(p.start)}–${formatTime(p.end)} · ${p.tempo}%</div></div><div class="saved-buttons"><button type="button" class="ghostbtn" data-load-id="${esc(p.id)}">▶ Resume</button><button type="button" class="ghostbtn del" aria-label="Remove ${esc(p.label||'phrase')}" data-delete-id="${esc(p.id)}">Remove</button></div></div>`).join('');
 el.querySelectorAll('[data-load-id]').forEach(b=>b.addEventListener('click',()=>loadSaved(b.dataset.loadId)));
 el.querySelectorAll('[data-delete-id]').forEach(b=>b.addEventListener('click',()=>deleteSaved(b.dataset.deleteId)));
}
function initSongStudio(){
 const d=getDraft();
 $('songLinkInput').value=d.source||(d.videoId?'https://www.youtube.com/watch?v='+d.videoId:'');
 $('songTitleNew').value=d.title||'';
 $('songPhraseNew').value=d.label||'';
 $('songNotes').value=d.notes||'';
 $('loopStart').value=formatTime(d.start??0);
 $('loopEnd').value=formatTime(d.end??8);
 $('loopTempo').value=String(d.tempo??75);
 $('songLoadBtn').addEventListener('click',loadSongInput);
 $('songLinkInput').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();loadSongInput();}});
 $('songApply').addEventListener('click',()=>applyLoop());
 $('songSave').addEventListener('click',()=>savePhrase(false));
 $('songSaveNew').addEventListener('click',()=>savePhrase(true));
 $('songNew').addEventListener('click',newPhrase);
 for(const id of ['songTitleNew','songPhraseNew','songNotes'])$(id).addEventListener('input',syncDraftText);
 $('songLinkInput').addEventListener('input',()=>{getDraft().source=$('songLinkInput').value;persist()});
 renderPlayer();renderSavedPhrases();
}
// LoopTube publishes only a height message, not changed loop markers or speed.
// Authenticate that message against the known iframe and its origin.
window.addEventListener('message',e=>{
 if(e.origin!=='https://www.looptube.xyz'||!e.data||e.data.type!=='looptube:height')return;
 const iframe=$('looptubeFrame');if(iframe&&iframe.contentWindow===e.source){
  const h=Number(e.data.height);if(Number.isFinite(h)&&h>=260&&h<1600)iframe.style.height=Math.ceil(h)+'px';
 }
});
function videoHeader(stepIndex){let s=steps[stepIndex];return `<span class="pill">STEP ${stepIndex+1} OF 5</span><span class="time">◷ ${s.minutes} MINUTES</span>`}
function render(){
 $('dateChip').textContent=new Intl.DateTimeFormat('en-US',{weekday:'short',month:'short',day:'numeric'}).format(new Date());
 $('stepList').innerHTML=steps.map((s,i)=>`<button type="button" class="step-tab ${state.step===i?'active':''} ${state.completed[i]?'done':''}" data-step="${i}" ${state.step===i?'aria-current="step"':''}><span class="num">${state.completed[i]?'✓':i+1}</span><span><b>${esc(s.short)}</b><small>${s.minutes} min</small></span></button>`).join('');
 document.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>select(Number(b.dataset.step))));
 const n=state.completed.filter(Boolean).length; $('progressLabel').textContent=`${n} / 5`; $('progressFill').style.width=(n*20)+'%';$('progressTrack').setAttribute('aria-valuenow',String(n));
 const days=['S','M','T','W','T','F','S'];let hs='';for(let j=6;j>=0;j--){let d=new Date();d.setDate(d.getDate()-j);let k=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;hs+=`<div class="day" title="${k}"><span>${days[d.getDay()]}</span><div class="dot ${state.history[k]?'hit':''}">${state.history[k]?'✓':''}</div></div>`;} $('history').innerHTML=hs;
 renderContentOnly();
}
function renderContentOnly(){
 if(state.step===5){$('practiceTop').innerHTML=`<span class="pill">ALL FIVE STEPS</span><span class="time">✓ DONE FOR TODAY</span>`;$('content').innerHTML=`<section class="finish"><div class="star" aria-hidden="true">✦</div><div class="eyebrow">Practice complete</div><h2>You showed up for your voice.</h2><p>Great work. Tomorrow you'll see your five steps ready again. What mattered today was listening, staying comfortable, and improving one small thing.</p><div class="cta"><button class="button secondary" id="reviewSong">Review my song notes</button><button class="button primary" id="startAgain">Practice again</button></div></section>`;$('controls').innerHTML='';$('reviewSong').onclick=()=>select(3);$('startAgain').onclick=()=>select(0);return;}
 $('practiceTop').innerHTML=videoHeader(state.step);
 let h='';
 switch(state.step){
 case 0:
 h=`<h2>Wake up your voice.</h2><p class="lede">Start gently with a real coach. You don't need to sing loudly to warm up well.</p>${resource(steps[0].id,content.warmup.start,content.warmup.end,content.warmup.label)}<div class="instructions"><h3>Do this</h3><p>Sing along at a comfortable volume. Gently hum or lip-trill where you can. If an exercise sits outside your range, skip it or sing a comfortable note instead.</p></div>`;
 break;
 case 1:{let chapters=content.runChapters;let c=chapters[Math.min(state.chapter,chapters.length-1)];
 h=`<h2>Build the notes in a run.</h2><p class="lede">Learn each note first. Clear, accurate patterns turn into effortless runs with time.</p><div class="tabs" role="group" aria-label="Choose a riff exercise">${chapters.map((c,i)=>`<button class="chapter" type="button" data-chapter="${i}" aria-pressed="${i===state.chapter}">${esc(c.name)}</button>`).join('')}</div>${resource(steps[1].id,c.start,c.end,`Riffs & Runs · ${c.name} · Aussie Vocal Coach`)}<div class="instructions"><h3>Do this</h3><ul><li>Play the slow example and repeat it at least twice.</li><li>Listen for each separate note; don't smear between them.</li><li>Only try the fast version when the slow one feels clean and easy.</li></ul></div>`;
 break;}
 case 2:
 h=`<h2>Explore a different musical world.</h2><p class="lede">Learn Raag Bhoopali from singer and teacher Bidisha Ghosh. Listen, echo, then make up a short answer.</p>${resource(steps[2].id,content.raga.start,content.raga.end,content.raga.label)}<div class="instructions"><h3>Your five-minute raga exercise</h3><ul><li>Listen to one short phrase. Pause and copy it.</li><li>Listen again and notice how the notes connect.</li><li>Invent a tiny response using the same notes: <b>Sa Re Ga Pa Dha Sa′</b>.</li><li>The lesson's Sa is set to A♯. If the pitches aren't comfortable, listen and learn the shapes rather than forcing that pitch.</li></ul></div><p class="hint">A raga isn't simply a scale. Pay attention to the teacher's phrasing, melodic direction, and ornamentation.</p>`;
 break;
 case 3:
 h=`<h2>Make a song your own.</h2><p class="lede">Loop a few seconds of a song, slow it down without changing pitch, and save the exact phrase to practice tomorrow. Powered by the official LoopTube embed.</p>
 <section class="song-panel" aria-label="Song loader"><h3>1 · Load your song</h3><p class="song-sub">You can paste a YouTube link, a LoopTube share link (including A/B times), or a video ID.</p>
 <div class="song-row"><label class="field" for="songLinkInput">Video or LoopTube link<input class="input" id="songLinkInput" type="text" placeholder="Paste a YouTube or LoopTube URL" autocomplete="off" spellcheck="false"></label><button class="button primary" type="button" id="songLoadBtn">Load video</button></div>
 <p class="song-feedback" role="status" id="songFeedback"></p>
 <div class="loop-preview" id="loopEmbedSlot"></div>
 <div class="song-tiny-links"><a id="openLoopTube" target="_blank" rel="noopener noreferrer">Open current loop in LoopTube ↗</a><a id="originalVideo" target="_blank" rel="noopener noreferrer">See original video on YouTube ↗</a></div></section>
 <section class="song-panel" aria-label="Loop to save"><h3>2 · Name &amp; save the part you're learning</h3><p class="song-sub">Set the start, end, and speed here so our app can save them. Press Apply to load these values in LoopTube.</p>
 <div class="saved-grid"><label class="field" for="songTitleNew">Song / artist<input class="input" id="songTitleNew" maxlength="150" placeholder="Song and artist"></label><label class="field" for="songPhraseNew">Name this phrase<input class="input" id="songPhraseNew" maxlength="110" placeholder="e.g., Chorus run #1"></label></div>
 <div class="loop-grid"><label class="field" for="loopStart">A · Start<input class="input" id="loopStart" inputmode="decimal" placeholder="1:26.32"><div class="field-hint">mm:ss.ss</div></label><label class="field" for="loopEnd">B · End<input class="input" id="loopEnd" inputmode="decimal" placeholder="1:47.96"><div class="field-hint">mm:ss.ss</div></label><label class="field tempo-field" for="loopTempo">Speed (%)<input class="input" id="loopTempo" type="number" min="25" max="200" step="1"><div class="field-hint">25–200%; original pitch</div></label></div>
 <label class="field" for="songNotes">What am I listening for?<textarea class="input" id="songNotes" maxlength="500" placeholder="e.g., Separate the 4 notes before connecting the run"></textarea></label>
 <div class="song-actions"><button class="button secondary" type="button" id="songApply">↻ Apply to player</button><button class="button primary" type="button" id="songSave">★ Save phrase</button><button class="button secondary" type="button" id="songSaveNew">Save as new</button><button class="button secondary" type="button" id="songNew">＋ New phrase</button></div>
 <div class="information"><b>Important:</b> LoopTube's draggable A/B markers and speed slider work inside the embedded player, but it does not send their changes back to Daily Vocal Studio. To remember a loop, enter its final A/B times and speed in the fields above and tap <b>Save phrase</b>. You can also paste a LoopTube share link above to import its saved settings.</div></section>
 <section class="saved-phrases" aria-label="Saved songs and phrases"><h3>3 · Pick up where you left off</h3><p class="song-sub">Your saved sections are kept on this device in this browser. Tap Resume next time, even on a new day.</p><div id="savedList"></div></section>
 <div class="instructions"><h3>The 7-minute song lab</h3><ul><li><b>1 min:</b> Listen closely to a short phrase.</li><li><b>2 min:</b> Play at 50%, sing individual notes.</li><li><b>2 min:</b> Connect the notes at 50–75%; check tricky pitches.</li><li><b>2 min:</b> Try without the guide and record one take.</li></ul></div>${timerHtml(7)}`;
 break;
 case 4:
 h=`<h2>Leave your voice feeling easy.</h2><p class="lede">A soft reset before you finish. This one doesn't need a video.</p><div class="instructions"><h3>Minute one · soft humming</h3><p>Make a relaxed “mm” sound and gently slide downward like a quiet sigh. Stay on easy, comfortable notes.</p></div><div class="instructions"><h3>Minute two · lip trills or “oo”</h3><p>Use a loose lip trill or a very gentle “oo” glide. Let it become softer and smaller. Stop if anything feels uncomfortable.</p></div>${timerHtml(2)}<p class="hint">Prefer a teacher-led version? <a href="https://www.youtube.com/watch?v=9yZynryrAAI" target="_blank" rel="noopener noreferrer">Dr. Dan's 5-minute vocal cool down ↗</a> (longer than today's plan).</p>`;
 break;
 }
 $('content').innerHTML=h;
 $('controls').innerHTML=`${state.step>0?'<button class="button secondary" id="prev">← Previous</button>':'<span class="checkline">♪ One step at a time</span>'}<span class="spacer"></span><button class="button primary" id="next">${state.step===4?'Finish workout ✓':'Done · Next step →'}</button>`;
 $('next').addEventListener('click',markAndNext);if($('prev'))$('prev').addEventListener('click',()=>select(state.step-1));
 if(state.step===1)document.querySelectorAll('[data-chapter]').forEach(b=>b.addEventListener('click',()=>chapterChoice(Number(b.dataset.chapter))));
 if(state.step===3)initSongStudio();
 if(state.step===3||state.step===4){timerFor=state.step;timerSeconds=state.step===3?420:120;updateTimer();$('timerStart').addEventListener('click',toggleTimer);$('timerReset').addEventListener('click',resetTimer)}
}
function timerHtml(minutes){return `<div class="timer"><span class="digits" id="timerClock">${String(minutes).padStart(2,'0')}:00</span><button class="button primary smallbtn" type="button" id="timerStart">Start timer</button><button class="button secondary smallbtn" type="button" id="timerReset">Reset</button><span class="timer-note">Optional · A guide, not a limit</span></div>`}
function updateTimer(){if(!$('timerClock'))return;$('timerClock').textContent=`${String(Math.floor(timerSeconds/60)).padStart(2,'0')}:${String(timerSeconds%60).padStart(2,'0')}`;$('timerStart').textContent=timerRunning?'Pause timer':timerSeconds===0?'Start again':'Start timer';}
function toggleTimer(){if(timerSeconds===0)timerSeconds=timerFor===3?420:120;timerRunning=!timerRunning;if(timerInterval)clearInterval(timerInterval);timerInterval=null;if(timerRunning){timerInterval=setInterval(()=>{timerSeconds=Math.max(0,timerSeconds-1);if(timerSeconds===0){timerRunning=false;clearInterval(timerInterval);timerInterval=null}updateTimer()},1000)}updateTimer()}
function resetTimer(){if(timerInterval)clearInterval(timerInterval);timerInterval=null;timerRunning=false;timerSeconds=timerFor===3?420:120;updateTimer()}
showBrand();
render();
})();
