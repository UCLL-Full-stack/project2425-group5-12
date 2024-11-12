-- CreateTable
CREATE TABLE "_ProjectToTask" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToTask_AB_unique" ON "_ProjectToTask"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToTask_B_index" ON "_ProjectToTask"("B");

-- AddForeignKey
ALTER TABLE "_ProjectToTask" ADD CONSTRAINT "_ProjectToTask_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToTask" ADD CONSTRAINT "_ProjectToTask_B_fkey" FOREIGN KEY ("B") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
