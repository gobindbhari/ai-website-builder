/*
  Warnings:

  - You are about to drop the column `files` on the `Project` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('File');

-- AlterEnum
ALTER TYPE "Framwork" ADD VALUE 'React';

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "files",
ALTER COLUMN "name" SET DEFAULT 'no name',
ALTER COLUMN "language" SET DEFAULT 'Typescript';

-- CreateTable
CREATE TABLE "ProjectFile" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT NOT NULL,
    "type" "FileType" NOT NULL,
    "path" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectFile_projectId_idx" ON "ProjectFile"("projectId");

-- AddForeignKey
ALTER TABLE "ProjectFile" ADD CONSTRAINT "ProjectFile_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
