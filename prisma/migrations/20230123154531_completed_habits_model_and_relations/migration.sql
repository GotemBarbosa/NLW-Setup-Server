-- CreateTable
CREATE TABLE "CompletedHabits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "completed_day" DATETIME NOT NULL,
    "habit_id" TEXT NOT NULL,
    CONSTRAINT "CompletedHabits_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habits" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
