import mongoose from "mongoose";

export default class BaseRepository<T extends mongoose.Document> {
  private Entity?: mongoose.Model<T>;

  public async getAll(props: Record<string, number>): Promise<Partial<T[]>> {
    return this.Entity!.aggregate([{ $project: props }]);
  }

  public async getById(id: string): Promise<T | null> {
    const entity = await this.Entity!.findById(id);
    return entity;
  }

  public async create(entity: T): Promise<T> {
    const newEntity = new this.Entity!(entity);
    return newEntity.save();
  }

  public async update(id: string, entity: Partial<T>): Promise<T | null> {
    const updated = await this.Entity!.findByIdAndUpdate(id, entity, {
      new: true,
    });
    return updated;
  }

  public async deleteById(id: string): Promise<void> {
    await this.Entity!.findByIdAndDelete(id);
  }

  constructor(modelName: string, schema: mongoose.Schema) {
    this.Entity = mongoose.model<T>(modelName, schema);
  }
}
