/*
  Warnings:

  - You are about to drop the `_ProjectTasks` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `projectId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ProjectTasks" DROP CONSTRAINT "_ProjectTasks_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectTasks" DROP CONSTRAINT "_ProjectTasks_B_fkey";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "projectId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_ProjectTasks";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
