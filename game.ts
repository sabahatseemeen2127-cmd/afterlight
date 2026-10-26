export type Direction = 'N'|'E'|'S'|'W';
export type Player = {id:string; name:string; token:string; seen:number; approved:number};
export type Room = {practice?:boolean; code:string; host:string; players:Player[]; phase:'lobby'|'playing'|'won'|'lost'; map:number; pos:number; energy:number; rescued:number[]; discovered:number[]; route:Direction[]; revision:number; turn:number; history:string[]; messages:{name:string;text:string}[]; pins:number[]; trace:number[]};
export const maps = [
 {name:'The Sunken Garden', subtitle:'The city went quiet. Three signals did not.', hazards:[2,8,10,13,16,25,27,32], people:[5,18,29], start:0, exit:35},
 {name:'Glasshouse District', subtitle:'Somewhere under the glass, a light is still on.', hazards:[1,9,11,12,16,19,28,33], people:[4,23,30], start:0, exit:35},
 {name:'The Last Observatory', subtitle:'Bring the stargazers home before dawn.', hazards:[3,7,10,14,18,22,25,27,34], people:[5,24,29], start:0, exit:35}
];
export const coordinate=(n:number)=>'ABCDEF'[n%6]+(Math.floor(n/6)+1);
export function createRoom(code:string,name:string,token:string):Room {const p={id:crypto.randomUUID(),name,token,seen:Date.now(),approved:-1}; return {code,host:p.id,players:[p],phase:'lobby',map:0,pos:0,energy:26,rescued:[],discovered:[0],route:[],revision:0,turn:0,history:['Expedition assembled. Awaiting your crew.'],messages:[],pins:[],trace:[]};}
export function publicState(r:Room,token:string){const me=r.players.find(p=>p.token===token); if(!me)throw Error('Your crew pass is invalid. Rejoin from the start screen.'); const map=maps[r.map]; const index=r.players.findIndex(p=>p.id===me.id); const clues=map.hazards.filter((_,i)=>i%r.players.length===index); return {...r,players:r.players.map(({token,...p})=>p),me:me.id,clues:r.phase==='lobby'?[]:r.practice?map.hazards:clues,signals:map.people,mission:{name:map.name,subtitle:map.subtitle,exit:map.exit},hazards:(r.phase==='won'||r.phase==='lost')?map.hazards:map.hazards.filter(n=>r.discovered.includes(n))};}
export function act(r:Room,token:string,a:any,now=Date.now()):Room{
 const me=r.players.find(p=>p.token===token);if(!me)throw Error('Invalid crew pass.');me.seen=now;
 const host=()=>{if(r.host!==me.id)throw Error('Only the captain can do that.');};
 if(a.type==='heartbeat')return r;
 if(a.type==='claim'){if(r.players.find(p=>p.id===r.host)!.seen>now-45000)throw Error('The captain is still connected.');r.host=me.id;return r;}
 if(a.type==='message'){const text=String(a.text||'').trim().slice(0,160);if(text)r.messages=[...r.messages,{name:me.name,text}].slice(-24);return r;}
 if(a.type==='map'){host();if(r.phase!=='lobby')throw Error('Choose a mission in the lobby.');if(!Number.isInteger(a.map)||!maps[a.map])throw Error('Unknown mission.');r.map=a.map;return r;}
 if(a.type==='start'||a.type==='restart'){host();if(a.type==='start'&&r.phase!=='lobby')throw Error('Already launched.');if(a.type==='restart'&&!['won','lost'].includes(r.phase))throw Error('Finish this expedition first.');if(r.players.length<2)throw Error('At least two explorers are needed.');r.phase='playing';r.pos=0;r.energy=26;r.rescued=[];r.discovered=[0];r.route=[];r.revision++;r.turn=0;r.pins=[];r.trace=[];r.history=['Rescue three lightkeepers, then reach F6. Every step costs 1 charge.'];r.players.forEach(p=>p.approved=-1);return r;}
 if(r.phase!=='playing')throw Error('Launch the expedition first.');
 if(a.type==='pin'){if(!Number.isInteger(a.cell)||a.cell<0||a.cell>35)throw Error('Invalid square.');r.pins=r.pins.includes(a.cell)?r.pins.filter(n=>n!==a.cell):[...r.pins,a.cell];return r;}
 if(a.type==='route'){if(a.revision!==r.revision)throw Error('The route changed. Review the latest plan.');if(!Array.isArray(a.route)||a.route.length>3||a.route.some((d:string)=>!['N','E','S','W'].includes(d)))throw Error('Plan up to three compass moves.');r.route=a.route;r.revision++;r.players.forEach(p=>p.approved=-1);return r;}
 if(a.type==='approve'){if(a.revision!==r.revision)throw Error('The route changed. Review it again.');if(!r.route.length)throw Error('Add a move first.');me.approved=r.revision;return r;}
 if(a.type==='execute'){host();if(a.revision!==r.revision)throw Error('The route changed.');if(!r.route.length)throw Error('Add a move first.');if(r.players.some(p=>p.seen>now-45000&&p.approved!==r.revision))throw Error('Wait for the connected crew to approve this route.');
 r.trace=[r.pos];r.turn++;let events:string[]=[];const map=maps[r.map];
 for(const d of r.route){r.energy--;let target=r.pos+({N:-6,E:1,S:6,W:-1}[d]);const edge=target<0||target>35||(d==='E'&&r.pos%6===5)||(d==='W'&&r.pos%6===0);if(edge){r.energy-=2;events.push('Boundary impact −3');}else if(map.hazards.includes(target)){r.energy-=2;if(!r.discovered.includes(target))r.discovered.push(target);events.push('Debris at '+coordinate(target)+' −3');}else{r.pos=target;r.trace.push(target);if(!r.discovered.includes(target))r.discovered.push(target);if(map.people.includes(target)&&!r.rescued.includes(target)){r.rescued.push(target);r.energy+=3;events.push('Lightkeeper rescued at '+coordinate(target)+' +3');}}
 if(r.rescued.length===3&&r.pos===map.exit){r.phase='won';events.push('All lightkeepers home. The beacon is alive.');break;}if(r.energy<=0){r.energy=0;r.phase='lost';events.push('Battery empty. Your next expedition starts wiser.');break;}}
 r.history=[`Turn ${r.turn} · ${r.route.join(' → ')} · ${events.join(' / ')||'Clear passage to '+coordinate(r.pos)}`,...r.history].slice(0,30);r.route=[];r.revision++;r.players.forEach(p=>p.approved=-1);return r;}
 throw Error('Unknown action.');
}




