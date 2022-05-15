import { ChildProcessWithoutNullStreams } from "child_process";
import { DataFlowRepository } from "../../domain/repositories/dataFlowRepository";
import { DatabaseMongo } from "../dataSource/mongoDB/databaseMongo";
import fs from "fs";
import path from "path";
export class DataFlowMongoRepository implements DataFlowRepository {
  getAllBackups(): string[] {
    const backupPath = path.join(__dirname, "../../../backup/");
    const backups = fs.readdirSync(backupPath, "utf8");
    return backups;
  }
  restore(backup: string): Promise<void> {
    return DatabaseMongo.getDB.restoreMongo(backup);
  }
  async backup(): Promise<void> {
    return DatabaseMongo.getDB.backupMongo();
  }
}
