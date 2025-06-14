<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kasir extends Model
{
    use HasFactory;

    protected $table = 'data_transaksi';
    protected $primaryKey = 'id_transaksi';

    protected $fillable = [
        'id_pembeli',
        'order_id',
        'riwayat_transaksi',
        'subtotal_keseluruhan',
        'potongan_harga',
        'uang_yang_dibayarkan',
        'total_pembayaran',
        'kembalian',
        'tanggal_transaksi',
        'metode_pembayaran',
        'nama_bank',
        'status_pembayaran',
    ];

    protected $casts = [
        'riwayat_transaksi' => 'array', // Jika Anda menggunakan JSON untuk menyimpan data riwayat transaksi
    ];

    public function pembeli()
    {
        return $this->belongsTo(DataPembeli::class, 'id_pembeli', 'id_pembeli');
    }

}
