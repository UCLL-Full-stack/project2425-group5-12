/*
  Warnings:

  - You are about to drop the `_ProjectToTask` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProjectToTask" DROP CONSTRAINT "_ProjectToTask_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToTask" DROP CONSTRAINT "_ProjectToTask_B_fkey";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "done" SET DEFAULT false;

-- DropTable
DROP TABLE "_ProjectToTask";

-- CreateTable
CREATE TABLE "_ProjectTasks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectTasks_AB_unique" ON "_ProjectTasks"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectTasks_B_index" ON "_ProjectTasks"("B");

-- AddForeignKey
ALTER TABLE "_ProjectTasks" ADD CONSTRAINT "_ProjectTasks_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectTasks" ADD CONSTRAINT "_ProjectTasks_B_fkey" FOREIGN KEY ("B") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
