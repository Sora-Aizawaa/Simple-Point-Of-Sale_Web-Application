<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {
            $table->increments('id_barang');
            $table->string('kode_item');
            $table->string('nama_item');
            $table->integer('stok');
            $table->string('satuan');
            $table->string('jenis');
            $table->string('merk');
            $table->decimal('harga', 10, 2);
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
