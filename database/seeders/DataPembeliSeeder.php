<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DataPembeliSeeder extends Seeder
{
    public function run()
    {
        $faker = \Faker\Factory::create();

        foreach (range(1, 10) as $index) {
            DB::table('datapembelis')->insert([
                'nama' => $faker->name,
                'alamat' => $faker->address,
                'nomor_telepon' => $faker->phoneNumber,
                'email' => $faker->unique()->safeEmail,
                'tanggal_pendaftaran' => $faker->date(),
                'riwayat_pembelian' => json_encode([
                    [
                        'id_produk' => $faker->numberBetween(1, 100),
                        'nama_produk' => $faker->word,
                        'tanggal_pembelian' => $faker->date(),
                        'jumlah' => $faker->numberBetween(1, 5),
                    ],
                    [
                        'id_produk' => $faker->numberBetween(1, 100),
                        'nama_produk' => $faker->word,
                        'tanggal_pembelian' => $faker->date(),
                        'jumlah' => $faker->numberBetween(1, 5),
                    ]
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
