<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('data_transaksi', function (Blueprint $table) {
            $table->increments('id_transaksi');
            $table->integer('id_pembeli');
            $table->string('order_id')->unique();
            $table->json('riwayat_transaksi')->nullable();
            $table->decimal('subtotal_keseluruhan', 15, 2)->nullable();
            $table->decimal('potongan_harga', 15, 2)->nullable();
            $table->decimal('uang_yang_dibayarkan', 15, 2)->nullable();
            $table->decimal('total_pembayaran', 15, 2)->nullable();
            $table->decimal('kembalian', 15, 2)->nullable();
            $table->dateTime('tanggal_transaksi');
            $table->enum('metode_pembayaran', ['bank_transfer', 'credit_card', 'qris', 'gopay', 'shopeepay', 'other'])->nullable();
            $table->string('nama_bank')->nullable();
            $table->enum('status_pembayaran', ['Unpaid', 'Paid', 'Pending', 'Failed'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data_transaksi');
    }
};
