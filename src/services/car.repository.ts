import { ICar } from "../interfaces/car.interface";
import { CarSchema } from "../schemas/car.schema";
import logger from "../utils/logger";
import BaseRepository from "./base.repository";

const log = logger("car-service");

export class CarRepository extends BaseRepository<ICar> {
  constructor() {
    super("Car", CarSchema);
    log.info("Car mongo model created");
  }
}
