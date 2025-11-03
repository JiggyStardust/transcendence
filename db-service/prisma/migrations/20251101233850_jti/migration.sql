/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_uuid_key" ON "RefreshToken"("uuid");
