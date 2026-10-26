import {build} from 'esbuild';
import fs from 'node:fs';
const result=await build({entryPoints:['main.tsx'],bundle:true,write:false,minify:true,format:'iife',target:'es2022',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'}});
const js=result.outputFiles[0].text.replace(/<\/script/gi,'<\\/script');
const css=fs.readFileSync('style.css','utf8').replace('@import "tailwindcss";','');
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#091d23"><title>AFTERLIGHT — A Signal Worth Saving</title><meta name="description" content="Different clues. One drone. A shared way home. A cooperative rescue game for 2–6 explorers."><meta property="og:title" content="AFTERLIGHT — A Signal Worth Saving"><meta property="og:image" content="https://sabahatseemeen2127-cmd.github.io/afterlight/cover.png"><style>${css}</style></head><body><div id="root"></div><script>${js}</script></body></html>`;
fs.writeFileSync('index.html',html);console.log('Built self-contained index.html: '+Buffer.byteLength(html)+' bytes.');
