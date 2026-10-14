const fs=require('node:fs');
const engine=require('./engine.js');
try {
  const input=JSON.parse(fs.readFileSync(0,'utf8'));
  if(input.tool!=='analyzeReply')throw new Error('Unsupported tool');
  console.log(JSON.stringify(engine.analyzeReply(input.text)));
} catch(error) {console.error(error.message);process.exitCode=1;}
