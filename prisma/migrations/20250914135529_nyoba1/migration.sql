/*
  Warnings:

  - You are about to drop the `cuti` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `golongan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `karyawan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lembur` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `penggajian` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."cuti" DROP CONSTRAINT "cuti_karyawan_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."karyawan" DROP CONSTRAINT "karyawan_golongan_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."lembur" DROP CONSTRAINT "lembur_karyawan_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."penggajian" DROP CONSTRAINT "penggajian_karyawan_id_fkey";

-- DropTable
DROP TABLE "public"."cuti";

-- DropTable
DROP TABLE "public"."golongan";

-- DropTable
DROP TABLE "public"."karyawan";

-- DropTable
DROP TABLE "public"."lembur";

-- DropTable
DROP TABLE "public"."penggajian";

-- CreateTable
CREATE TABLE "public"."Golongan" (
    "id" SERIAL NOT NULL,
    "nama_golongan" VARCHAR(100) NOT NULL,
    "gaji_pokok" INTEGER NOT NULL,
    "tunjangan_istri" INTEGER NOT NULL,
    "tunjangan_anak" INTEGER NOT NULL,
    "tunjangan_transport" INTEGER NOT NULL,
    "tunjangan_makan" INTEGER NOT NULL,

    CONSTRAINT "Golongan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Karyawan" (
    "id" SERIAL NOT NULL,
    "nip" VARCHAR(12) NOT NULL,
    "nik" VARCHAR(12) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "jenis_kelamin" "public"."JenisKelamin" NOT NULL,
    "tempat_lahir" VARCHAR(100) NOT NULL,
    "tanggal_lahir" DATE NOT NULL,
    "telpon" VARCHAR(12) NOT NULL,
    "agama" VARCHAR(15) NOT NULL,
    "status_nikah" "public"."StatusNikah" NOT NULL,
    "alamat" TEXT NOT NULL,
    "foto" VARCHAR(150) NOT NULL,
    "golongan_id" INTEGER NOT NULL,

    CONSTRAINT "Karyawan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Lembur" (
    "id" SERIAL NOT NULL,
    "tanggal_lembur" DATE NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "karyawan_id" INTEGER NOT NULL,

    CONSTRAINT "Lembur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cuti" (
    "id" SERIAL NOT NULL,
    "tanggal_cuti" DATE NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "karyawan_id" INTEGER NOT NULL,

    CONSTRAINT "Cuti_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Penggajian" (
    "id" SERIAL NOT NULL,
    "karyawan_id" INTEGER NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "tanggal_gajian" TIMESTAMP(3) NOT NULL,
    "gaji_pokok_saat_itu" INTEGER NOT NULL,
    "total_tunjangan" INTEGER NOT NULL,
    "total_upah_lembur" INTEGER NOT NULL,
    "total_potongan_cuti" INTEGER NOT NULL,
    "gaji_diterima" INTEGER NOT NULL,
    "keterangan" TEXT,

    CONSTRAINT "Penggajian_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Karyawan_nip_key" ON "public"."Karyawan"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "Karyawan_nik_key" ON "public"."Karyawan"("nik");

-- AddForeignKey
ALTER TABLE "public"."Karyawan" ADD CONSTRAINT "Karyawan_golongan_id_fkey" FOREIGN KEY ("golongan_id") REFERENCES "public"."Golongan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lembur" ADD CONSTRAINT "Lembur_karyawan_id_fkey" FOREIGN KEY ("karyawan_id") REFERENCES "public"."Karyawan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cuti" ADD CONSTRAINT "Cuti_karyawan_id_fkey" FOREIGN KEY ("karyawan_id") REFERENCES "public"."Karyawan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Penggajian" ADD CONSTRAINT "Penggajian_karyawan_id_fkey" FOREIGN KEY ("karyawan_id") REFERENCES "public"."Karyawan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
