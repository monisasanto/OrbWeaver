class SchemaAPI {
  constructor(baseUrl) { this.baseUrl = baseUrl; }
  async getSchema(schemaId) {
    const res = await fetch(\`\${this.baseUrl}/schemas/\${schemaId}\`);
    return await res.json();
  }
  async register(entityType, fields) {
    const res = await fetch(\`\${this.baseUrl}/schemas\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityType, fields })
    });
    return await res.json();
  }
}
module.exports = SchemaAPI;
