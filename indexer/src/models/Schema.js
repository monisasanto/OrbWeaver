class Schema {
  constructor(data) {
    this.schemaId = data.schemaId;
    this.entityType = data.entityType;
    this.version = data.version || 1;
    this.fields = data.fields || [];
  }
  validate() {
    if (!this.entityType) throw new Error('Missing entity type');
    if (this.fields.length === 0) throw new Error('No fields');
    return true;
  }
}
module.exports = Schema;
