'use strict';
const $=id=>document.getElementById(id);
const samples=[
  {name:'Alex Morgan',role:'Founder · Example Analytics',text:'Sounds interesting. Could you send me more details?'},
  {name:'Sam Taylor',role:'Revenue lead · Example Studio',text:'We are focused on our launch. Can you circle back next quarter?'},
  {name:'Jordan Lee',role:'Operations · Example Systems',text:'We already have an agency. What does your service cost?'},
  {name:'Casey Brooks',role:'Marketing · Example Works',text:'Please remove me from your list. Do not contact me again.'},
  {name:'Riley Chen',role:'People team · Example Labs',text:'I am the wrong person. Please speak to our sales team.'},
  {name:'Taylor Quinn',role:'Founder · Example Cloud',text:'Maybe. We need to think about it internally.'}
];
let current=null;
function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
function clear(id){const n=$(id);n.replaceChildren();return n;}
function list(parent,items){const ul=el('ul');items.forEach(x=>ul.append(el('li',x)));parent.append(ul);}
function error(id,e){const n=clear(id);n.append(el('p',e.message,'error'));}
function resetApproval(){$('approved').checked=false;$('copy').disabled=true;$('copy-status').textContent='';}
function renderReply(){
  resetApproval();current=null;$('download').disabled=true;$('draft').value='';
  try {
    current=GTMLab.analyzeReply($('reply-text').value);
    const box=el('div',undefined,'result'+(current.ambiguous||current.do_not_contact?' warning':''));
    box.append(el('h3',current.label),el('p',current.action));
    box.append(el('p','Evidence: '+(current.evidence.map(x=>'“'+x.quote+'”').join(' · ')||'No supported phrase matched'),'evidence'));
    box.append(el('p',current.note));clear('reply-result').append(box);$('draft').value=current.draft;
    $('draft').disabled=current.do_not_contact;$('download').disabled=false;
  }catch(e){error('reply-result',e);$('draft').disabled=false;}
}
samples.forEach((sample,i)=>{
  const b=el('button',undefined,'sample');b.type='button';b.setAttribute('aria-label','Load '+sample.name+' sample');
  b.append(el('span',sample.name.split(' ').map(x=>x[0]).join(''),'avatar'));
  const body=el('span',undefined,'sample-body');body.append(el('strong',sample.name),el('small',sample.role),el('span',sample.text,'snippet'));b.append(body);
  b.addEventListener('click',()=>{document.querySelectorAll('.sample').forEach(n=>n.classList.remove('selected'));b.classList.add('selected');$('reply-text').value=sample.text;$('sample-name').textContent=sample.name;renderReply();});$('samples').append(b);
  if(i===0)b.click();
});
document.querySelectorAll('.nav').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.view').forEach(n=>n.hidden=n.id!==b.dataset.view);
  document.querySelectorAll('.nav').forEach(n=>n.classList.toggle('active',n===b));
  $('breadcrumb').textContent=b.textContent.replace(/^\d+\s*/,'').replace('HERO','').trim().toUpperCase();
}));
$('analyze').addEventListener('click',renderReply);
$('reply-text').addEventListener('input',()=>{current=null;clear('reply-result');$('draft').value='';$('draft').disabled=false;$('download').disabled=true;resetApproval();});
$('draft').addEventListener('input',resetApproval);
$('approved').addEventListener('change',()=>{$('copy').disabled=!$('approved').checked||!$('draft').value.trim()||!current||current.do_not_contact;});
$('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('draft').value);$('copy-status').textContent='Copied. Review once more in your messaging app before sending.';}catch{$('draft').select();$('copy-status').textContent='Select and copy the draft manually using your keyboard.';}});
$('download').addEventListener('click',()=>{
  if(!current)return;
  const blob=new Blob([JSON.stringify({...current,draft:$('draft').value,human_reviewed:$('approved').checked},null,2)],{type:'application/json'});
  const a=el('a');a.href=URL.createObjectURL(blob);a.download='reply-review.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
});
$('audit-form').addEventListener('submit',e=>{e.preventDefault();try{
  const read=p=>Object.fromEntries(['sent','replies','interested','booked'].map(k=>[k,$(p+'-'+k).value]));
  const r=GTMLab.campaignAudit(read('b'),read('a')),n=clear('audit-out');n.append(el('h3','What changed'));
  const table=el('table'),head=el('tr');['Stage','Earlier','Later','Change'].forEach(t=>head.append(el('th',t)));table.append(head);
  Object.keys(r.deltas).forEach(k=>{const row=el('tr');[k,r.before[k],r.after[k],(r.deltas[k]>0?'+':'')+r.deltas[k]].forEach(v=>row.append(el('td',v)));table.append(row);});n.append(table);list(n,r.findings);n.append(el('p',r.caveat,'micro'));
}catch(x){error('audit-out',x);}});
$('follow-form').addEventListener('submit',e=>{e.preventDefault();try{
  const r=GTMLab.followUp({name:$('f-name').value,goal:$('f-goal').value,step:$('f-step').value,timing:$('f-time').value});const n=clear('follow-out');n.append(el('h3','Your follow-up'));
  const ta=el('textarea');ta.value=r.draft;ta.setAttribute('aria-label','Generated follow-up draft');n.append(ta);list(n,r.checklist);
}catch(x){error('follow-out',x);}});
$('check-form').addEventListener('submit',e=>{e.preventDefault();try{const r=GTMLab.messageCheck($('check-text').value),n=clear('check-out');n.append(el('h3',r.verdict),el('p',r.words+' words · '+r.questions+' questions'));list(n,r.flags);n.append(el('p',r.note,'micro'));}catch(x){error('check-out',x);}});
$('utm-form').addEventListener('submit',e=>{e.preventDefault();try{const read=k=>$('u-'+k).value,r=GTMLab.buildUTM({url:read('url'),source:read('source'),medium:read('medium'),campaign:read('campaign'),content:read('content')}),n=clear('utm-out');n.append(el('h3','Tagged link'),el('p',r.url,'link-output'),el('p',r.note,'micro'));}catch(x){error('utm-out',x);}});

document.querySelector('.brand').addEventListener('click',()=>document.querySelector('[data-view="reply"]').click());
