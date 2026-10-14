/* Shared browser / Node core. No network, model, database or send capability. */
(function (root) {
  'use strict';
  const RULES = [
    {intent:'unsubscribe', label:'Do not contact', pattern:/\b(unsubscribe|opt[ -]?out|remove me|quit reaching out|stop (?:contacting|messaging|emailing)|do not (?:contact|message|email)|don['’]?t (?:contact|message|email))\b/i, action:'Mark do-not-contact in your source system; do not draft a sales reply.', draft:''},
    {intent:'not_interested', label:'Not interested', pattern:/\b(not interested|not interesting|aren['’]?t interested|no thanks|no thank you|not a fit|not for us|don['’]?t need|do not need)\b/i, action:'Close the sales follow-up. Respect the decline.', draft:'Thanks for letting me know. I’ll leave it here.'},
    {intent:'wrong_person', label:'Wrong person', pattern:/\b(wrong person|not (?:my|the right) (?:area|person|department)|speak (?:to|with)|contact my colleague|no longer (?:work|with))\b/i, action:'Check the referral manually; do not assume consent from the referred person.', draft:'Thanks for pointing me in the right direction. I’ll check who handles this.'},
    {intent:'later', label:'Follow up later', pattern:/\b(next (?:month|quarter|year)|in \d+ (?:weeks?|months?)|reach (?:back )?out (?:in|after)|circle back|not (?:right )?now|after (?:the )?(?:holidays|launch))\b/i, action:'Confirm a follow-up date manually. No reminder has been scheduled.', draft:'Understood. Would it be okay if I checked back closer to that time?'},
    {intent:'objection', label:'Objection / question', pattern:/\b(no budget|too expensive|cost|pricing|price|already (?:have|use|work)|case stud(?:y|ies)|proof|how (?:does|would)|what (?:does|would))\b/i, action:'Answer the specific question with verified facts before asking for a meeting.', draft:'Happy to clarify. [Add a verified answer to their question here.] Would that address your concern?'},
    {intent:'interested', label:'Interested', pattern:/\b(sounds (?:good|interesting)|interested|let['’]?s (?:talk|chat|meet)|book (?:a|the) (?:call|meeting)|send (?:me )?(?:some |more )?(?:details|info)|available (?:on|at)|happy to (?:chat|talk))\b/i, action:'Offer a relevant next step. Confirm time zone and availability before booking.', draft:'Happy to share more. Would you prefer a short overview here or a quick conversation?'}
  ];
  function required(value, label, max=12000) {
    if (typeof value !== 'string' || !value.trim()) throw new Error(label + ' is required.');
    if (value.length > max) throw new Error(label + ' is too long.');
    return value.trim();
  }
  function analyzeReply(text) {
    text=required(text,'Latest prospect reply');
    const matches=RULES.map(rule=>({rule,match:text.match(rule.pattern)})).filter(x=>x.match);
    const chosen=matches[0];
    const uncertain=/\b(if|unless|not sure|maybe|perhaps)\b/i.test(text);
    // Declines override positive words; all other multi-intent replies need review.
    const suppress=chosen && ['unsubscribe','not_interested'].includes(chosen.rule.intent);
    const negatedPositive=!suppress && /\b(?:not|never|isn['’]?t|aren['’]?t|wasn['’]?t|don['’]?t)\s+(?:(?:really|very)\s+)?(?:available|interested|happy|good|interesting)\b/i.test(text);
    const review=!chosen || negatedPositive || (!suppress && (matches.length>1 || uncertain));
    const rule=chosen && !negatedPositive ? chosen.rule : {intent:'review',label:'Needs human review',action:'Read the context and choose the next step manually.',draft:''};
    return {intent:rule.intent,label:rule.label,action:rule.action,draft:review?'':rule.draft,
      evidence:matches.map(x=>({intent:x.rule.intent,quote:x.match[0]})),
      review_required:true,ambiguous:review,do_not_contact:rule.intent==='unsubscribe',
      sales_followup_allowed:!suppress&&!review,mode:'rules',
      note:review?'No draft: ambiguous wording or no supported rule.':'Matched phrases are a heuristic, not a confidence score.'};
  }
  function campaignAudit(before, after) {
    function validate(p) {
      const out={};
      for (const key of ['sent','replies','interested','booked']) {
        if (p[key] === '' || p[key] == null || !Number.isInteger(Number(p[key])) || Number(p[key])<0) throw new Error('Use non-negative whole numbers for every campaign field.');
        out[key]=Number(p[key]);
      }
      if(out.replies>out.sent||out.interested>out.replies||out.booked>out.interested) throw new Error('Use a single cohort: sent ≥ replies ≥ interested ≥ booked.');
      return out;
    }
    before=validate(before); after=validate(after);
    const deltas=Object.fromEntries(Object.keys(before).map(k=>[k,after[k]-before[k]]));
    const rate=(n,d)=>d===0?null:Math.round(n/d*10000)/100;
    const rates=p=>({reply_rate:rate(p.replies,p.sent),interest_rate:rate(p.interested,p.replies),booking_rate:rate(p.booked,p.interested)});
    const b=rates(before),a=rates(after);
    const findings=[];
    if(after.sent<before.sent) findings.push('Send volume fell by '+(before.sent-after.sent)+'. Check sender access, daily capacity and campaign pauses.');
    for (const [key,label] of [['reply_rate','Replies per send'],['interest_rate','Interested replies per reply'],['booking_rate','Bookings per interested reply']]) {
      if(b[key]!==null&&a[key]!==null&&a[key]<b[key]) findings.push(label+' fell. Inspect this stage; counts alone do not establish the cause.');
    }
    if(!findings.length) findings.push('No measured stage declined on these inputs. Inspect cohort age and reply quality before drawing conclusions.');
    return {before,after,deltas,rates:{before:b,after:a},findings,caveat:'Compare equal observation windows and the same cohort definition. Small samples are unstable; these are diagnostic prompts, not causal claims.'};
  }
  function followUp(input) {
    const name=required(input.name,'First name',120), goal=required(input.goal,'Stated goal',1500);
    const step=required(input.step,'Agreed next step',1500);
    const timing=(input.timing||'').trim();
    return {draft:`Hi ${name},\n\nThanks for the conversation. You mentioned that your priority is ${goal}.\n\nAs discussed, the next step is ${step}${timing ? ' ('+timing+')' : ''}.\n\nHave I captured that correctly?`, checklist:['Check that the goal reflects their words.','Verify the next step was actually agreed.',timing?'Confirm the date and time zone.':'Add a date only if it was agreed.'],mode:'template'};
  }
  function messageCheck(text) {
    text=required(text,'Outreach draft');
    const words=text.split(/\s+/).length,questions=(text.match(/\?/g)||[]).length;
    const flags=[];
    if(words>90)flags.push('Long first message: consider trimming to one useful point.');
    if(questions>1)flags.push('Multiple asks: choose one next step.');
    if(/guarantee|guaranteed|100%|risk.free|double your/i.test(text))flags.push('Strong promise: substantiate or remove it.');
    if(/\[[^\]]+\]|\{[^}]+\}/.test(text))flags.push('Unfilled placeholder: replace it before sending.');
    if(/just following up|bumping this|touching base/i.test(text))flags.push('Generic follow-up: explain why this is useful to the recipient.');
    if(!questions)flags.push('No question detected: check that the intended next step is clear.');
    return {words,questions,flags,verdict:flags.length?'Review before sending':'No listed checks triggered',note:'This checks writing patterns only; it cannot verify claims, personalization, consent or deliverability.'};
  }
  function buildUTM(input) {
    let url;
    try {url=new URL(required(input.url,'Destination URL',2000));} catch {throw new Error('Enter a full http:// or https:// destination URL.');}
    if(!['https:','http:'].includes(url.protocol)||url.username||url.password)throw new Error('Use a normal HTTP(S) URL without credentials.');
    const normalize=s=>required(s,'Source, medium and campaign',160).toLowerCase().replace(/\s+/g,'_');
    for(const key of ['source','medium','campaign'])url.searchParams.set('utm_'+key,normalize(input[key]));
    if(input.content && input.content.trim())url.searchParams.set('utm_content',normalize(input.content));
    else url.searchParams.delete('utm_content');
    return {url:url.toString(),note:'This creates a tagged link. It does not collect clicks or install analytics.'};
  }
  const api={analyzeReply,campaignAudit,followUp,messageCheck,buildUTM};
  if(typeof module!=='undefined'&&module.exports)module.exports=api; else root.GTMLab=api;
})(typeof globalThis!=='undefined'?globalThis:this);
