// Diagnostic fixture set, not a held-out benchmark and not production accuracy.
const fixtures=require('./replies.json'),{analyzeReply}=require('../src/engine.js');
let passed=0;const failures=[];
for (const row of fixtures) {const got=analyzeReply(row.text);const ok=got.intent===row.expected&&(!row.must_abstain||got.draft==='');if(ok)passed++;else failures.push({text:row.text,expected:row.expected,actual:got.intent,draft:got.draft});}
console.log(JSON.stringify({total:fixtures.length,passed,failed:failures.length,failures,note:'Synthetic diagnostic examples; not real-world accuracy. Known failures are retained to guide contributions.'},null,2));
