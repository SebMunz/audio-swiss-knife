import { openDB, type DBSchema } from "idb";

export type RoomProject = {
  id: string;
  name: string;
  updatedAt: string;
  payload: Record<string, unknown>;
};

interface AudioSwissKnifeDb extends DBSchema {
  roomProjects: {
    key: string;
    value: RoomProject;
    indexes: {
      "by-updated-at": string;
    };
  };
}

const DB_NAME = "audio-swiss-knife";
const DB_VERSION = 1;

async function getDb() {
  return openDB<AudioSwissKnifeDb>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore("roomProjects", { keyPath: "id" });
      store.createIndex("by-updated-at", "updatedAt");
    }
  });
}

export async function saveRoomProject(project: RoomProject) {
  const db = await getDb();
  await db.put("roomProjects", project);
}

export async function listRoomProjects() {
  const db = await getDb();
  return db.getAllFromIndex("roomProjects", "by-updated-at");
}

export async function loadRoomProject(id: string) {
  const db = await getDb();
  return db.get("roomProjects", id);
}

export async function deleteRoomProject(id: string) {
  const db = await getDb();
  await db.delete("roomProjects", id);
}
