export function withId<T extends { _id: unknown }>(doc: T) {
  return {
    ...doc,
    id: String(doc._id)
  };
}
