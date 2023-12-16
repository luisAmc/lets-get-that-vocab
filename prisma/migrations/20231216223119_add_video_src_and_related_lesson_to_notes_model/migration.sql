-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "relatedLessonId" TEXT,
ADD COLUMN     "videoSrc" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_relatedLessonId_fkey" FOREIGN KEY ("relatedLessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
