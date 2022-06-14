import { ICar } from "../interfaces/car.interface";
import { CarSchema } from "../schemas/car.schema";
import BaseRepository from "./base.repository";

export class CarRepository extends BaseRepository<ICar> {
  constructor() {
    super("Car", CarSchema);
  }
}
