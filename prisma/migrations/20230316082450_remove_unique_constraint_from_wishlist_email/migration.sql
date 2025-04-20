-- DropIndex
DROP INDEX "WishlistEmails_email_key";

-- AlterTable
ALTER TABLE "WishlistEmails" ADD CONSTRAINT "WishlistEmails_pkey" PRIMARY KEY ("email");
