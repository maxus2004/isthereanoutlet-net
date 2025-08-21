-- CreateTable
CREATE TABLE "public"."Point" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'has-outlets',
    "coordinates" TEXT NOT NULL,
    "photo" TEXT NOT NULL DEFAULT '',
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "date_added" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_edited" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Point_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "nickname" TEXT NOT NULL,
    "pass_hash" TEXT NOT NULL DEFAULT '',
    "date_registered" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "access_level" TEXT NOT NULL DEFAULT 'user',
    "account_status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Point_coordinates_key" ON "public"."Point"("coordinates");

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "public"."User"("nickname");

-- AddForeignKey
ALTER TABLE "public"."Point" ADD CONSTRAINT "Point_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
