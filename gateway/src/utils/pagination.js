function paginate(items, page = 1, size = 20) {
  const offset = (page - 1) * size;
  return {
    items: items.slice(offset, offset + size),
    page, size, total: items.length, hasMore: offset + size < items.length
  };
}
module.exports = { paginate };
