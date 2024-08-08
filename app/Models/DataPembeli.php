<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DataPembeli extends Model
{
    use HasFactory;

    protected $table = 'datapembelis';
    protected $primaryKey = 'id_pembeli';

    protected $fillable = [
        'nama', 
        'alamat', 
        'nomor_telepon', 
        'email', 
        'tanggal_pendaftaran', 
        'riwayat_pembelian'
    ];

    protected $casts = [
        'riwayat_pembelian' => 'array',
        'tanggal_pendaftaran' => 'date',
    ];
}
