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
        Schema::table('data_transaksi', function (Blueprint $table) {
            $table->unsignedInteger('id_pembeli')->change();
           
            $table->foreign('id_pembeli')
            ->references('id_pembeli')
            ->on('datapembelis')
            ->onUpdate('restrict')
            ->onDelete('restrict');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('data_transaksi', function (Blueprint $table) {
            $table->integer('id_pembeli')->change();
          
            $table->dropForeign('data_transaksi_id_pembeli_foreign');
          
        });
    }
};
