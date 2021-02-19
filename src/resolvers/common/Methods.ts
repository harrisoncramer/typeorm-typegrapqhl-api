export const findOne = async (entity: any, id: string) => {
  let record = await entity.findOne({ id });
  if (!record) {
    throw new Error("Record not found.");
  }

  return record;
};

export const findAndRemove = async (entity: any, id: string) => {
  let record = await entity.findOne({ id });
  if (!record) {
    throw new Error("Record not found.");
  }

  await record.remove();
};
