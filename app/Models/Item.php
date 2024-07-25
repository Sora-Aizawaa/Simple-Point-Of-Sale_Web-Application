<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_item',
        'nama_item',
        'stok',
        'satuan',
        'jenis',
        'merk',
        'harga',
        'image',
    ];
}
