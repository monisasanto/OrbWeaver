const required = ['DATABASE_HOST', 'ETHEREUM_RPC'];
required.forEach(key => {
  if (!process.env[key]) console.error(\`Missing: \${key}\`);
});
