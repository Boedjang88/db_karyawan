-- CreateEnum
CREATE TYPE "public"."JenisKelamin" AS ENUM ('pria', 'wanita');

-- CreateEnum
CREATE TYPE "public"."StatusNikah" AS ENUM ('belum_nikah', 'nikah');

-- CreateTable
CREATE TABLE "public"."golongan" (
    "id" SERIAL NOT NULL,
    "nama_golongan" VARCHAR(100) NOT NULL,
    "gaji_pokok" INTEGER NOT NULL,
    "tunjangan_istri" INTEGER NOT NULL,
    "tunjangan_anak" INTEGER NOT NULL,
    "tunjangan_transport" INTEGER NOT NULL,
    "tunjangan_makan" INTEGER NOT NULL,

    CONSTRAINT "golongan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."karyawan" (
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

    CONSTRAINT "karyawan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lembur" (
    "id" SERIAL NOT NULL,
    "tanggal_lembur" DATE NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "karyawan_id" INTEGER NOT NULL,

    CONSTRAINT "lembur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cuti" (
    "id" SERIAL NOT NULL,
    "tanggal_cuti" DATE NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "karyawan_id" INTEGER NOT NULL,

    CONSTRAINT "cuti_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."penggajian" (
    "id" SERIAL NOT NULL,
    "tanggal" DATE NOT NULL,
    "keterangan" TEXT NOT NULL,
    "jumlah_gaji" INTEGER NOT NULL,
    "jumlah_lembur" INTEGER NOT NULL,
    "potongan" INTEGER NOT NULL,
    "total_gaji_diterima" INTEGER NOT NULL,
    "karyawan_id" INTEGER NOT NULL,

    CONSTRAINT "penggajian_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "karyawan_nip_key" ON "public"."karyawan"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "karyawan_nik_key" ON "public"."karyawan"("nik");

-- AddForeignKey
ALTER TABLE "public"."karyawan" ADD CONSTRAINT "karyawan_golongan_id_fkey" FOREIGN KEY ("golongan_id") REFERENCES "public"."golongan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lembur" ADD CONSTRAINT "lembur_karyawan_id_fkey" FOREIGN KEY ("karyawan_id") REFERENCES "public"."karyawan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cuti" ADD CONSTRAINT "cuti_karyawan_id_fkey" FOREIGN KEY ("karyawan_id") REFERENCES "public"."karyawan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."penggajian" ADD CONSTRAINT "penggajian_karyawan_id_fkey" FOREIGN KEY ("karyawan_id") REFERENCES "public"."karyawan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
