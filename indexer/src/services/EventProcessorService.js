class EventProcessorService {
  constructor(database, schemaRegistry) {
    this.db = database;
    this.schemaRegistry = schemaRegistry;
  }
  
  async processEvents(events) {
    const results = [];
    for (const event of events) {
      const processed = await this.processEvent(event);
      results.push(processed);
    }
    return results;
  }
  
  async processEvent(event) {
    const schema = await this.schemaRegistry.findSchema(event.address);
    if (!schema) return { ...event, processed: false };
    const decoded = this.decodeEventData(event, schema);
    await this.db.saveEvent(decoded);
    return { ...decoded, processed: true };
  }
  
  decodeEventData(event, schema) {
    return { ...event, decoded: { name: schema.name, params: [] } };
  }
}
module.exports = EventProcessorService;
