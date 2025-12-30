
const fs = require('fs');
const dotenv = require('dotenv');

// Load env
const envConfig = dotenv.parse(fs.readFileSync('.env'));

const key = 'LMA_EDGE_2025';

function xorEncrypt(text, key) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return Buffer.from(result).toString('base64');
}

const geminiKey = envConfig.GEMINI_API_KEY;
const supabaseUrl = envConfig.VITE_SUPABASE_URL;
const supabaseAnon = envConfig.VITE_SUPABASE_ANON_KEY;

const content = `// Encrypted Credentials for Production Bundle
// Generated automatically. Do not edit manually.

const XOR_KEY = '${key}';

function decrypt(encrypted: string): string {
  const text = atob(encrypted);
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ XOR_KEY.charCodeAt(i % XOR_KEY.length));
  }
  return result;
}

export const Secrets = {
  get GEMINI_API_KEY() { return decrypt('${xorEncrypt(geminiKey, key)}'); },
  get SUPABASE_URL() { return decrypt('${xorEncrypt(supabaseUrl, key)}'); },
  get SUPABASE_ANON_KEY() { return decrypt('${xorEncrypt(supabaseAnon, key)}'); }
};
`;

fs.mkdirSync('src/config', { recursive: true });
fs.writeFileSync('src/config/secrets.ts', content);
console.log('Secrets generated in src/config/secrets.ts');
