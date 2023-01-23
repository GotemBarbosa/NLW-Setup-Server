/*
  Warnings:

  - You are about to drop the `CompletedHabits` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CompletedHabits";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "completed_habits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "completed_day" DATETIME NOT NULL,
    "habit_id" TEXT NOT NULL,
    CONSTRAINT "completed_habits_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
