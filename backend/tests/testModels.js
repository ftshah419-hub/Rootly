import mongoose from 'mongoose';
import * as models from '../models/index.js';

console.log('Testing registration of all 26 Mongoose models:');
const modelNames = Object.keys(models);
console.log(`Found ${modelNames.length} exported models.`);

if (modelNames.length !== 26) {
  console.error(`Error: Expected exactly 26 models, but found ${modelNames.length}`);
  process.exit(1);
}

modelNames.forEach((name, i) => {
  const model = models[name];
  const collectionName = model.collection.name;
  console.log(`[${i + 1}/26] Model: ${name} -> Collection: ${collectionName}`);
});

console.log('\nAll 26 Mongoose models verified and registered successfully!');
process.exit(0);
