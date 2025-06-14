<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Models\DataPembeli;
use App\Models\Item;
use App\Models\Kasir;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Midtrans\Snap;

class KasirController extends Controller
{
    public function index() {
        
        return Inertia::render('MasterData/Kasir', [
            'items' => Item::get(),
            'data_pembeli' => DataPembeli::get()
        ]);
    }

    public function getMidtransConfig()
    {
        return response()->json([
            'clientKey' => env('MIDTRANS_CLIENT_KEY') // Ensure you have this in your .env file
        ]);
    }

    public function transaksi() {
        
        return Inertia::render('MasterData/DataTransaksi', [
            'data_transaksi' => Kasir::with('pembeli')->get()
            
        ]);
    }

    
    // PAYMENT

    public function store(Request $request)
    {
        // Validate the incoming request
        $validatedData = $request->validate([
            'order_id' => 'required',
            'subtotal' => 'required',
            'discount' => 'required',
            'paid_amount' => 'required',
            'gross_amount' => 'required',
            'change' => 'required',
            'transaction_time' => 'required',
            'items' => 'required|array',
            'items.*.id_barang' => 'required',
            'items.*.kode_barang' => 'required',
            'items.*.price' => 'required',
            'items.*.quantity' => 'required',
            'items.*.subtotal_per_unit' => 'required',
            'items.*.nama_item' => 'required',
            'customer_details' => 'required',
            'customer_details.id_pembeli' => 'required',
            'customer_details.name' => 'required',
            'customer_details.email' => 'required',
            'customer_details.phone' => 'required',
            'metode_pembayaran' => 'required',
            'nama_bank' => 'required',
            'status_pembayaran' => 'required',
        ]);

        // Access customer details
        $customerDetails = $validatedData['customer_details'];
        $pembeli = Datapembeli::where('id_pembeli', $customerDetails['id_pembeli'])->firstOrFail();

        // Prepare an array to hold all items for the transaction
        $riwayatTransaksi = [];

        // Process each item in the transaction
        foreach ($validatedData['items'] as $itemDetail) {
            if (empty($itemDetail['id_barang'])) {
                throw new \Exception('Item ID is missing');
            }

            $item = Item::where('id_barang', $itemDetail['id_barang'])->first();
            
            if (!$item) {
                throw new \Exception('Item not found: ' . $itemDetail['id_barang']);
            }
            
            // Add item to the transaction history array
            $riwayatTransaksi[] = [
                'id_barang' => $itemDetail['id_barang'],
                'kode_barang' => $itemDetail['kode_barang'],
                'nama_barang' => $itemDetail['nama_item'],
                'harga_per_unit' => $itemDetail['price'],
                'jumlah' => $itemDetail['quantity'],
                'subtotal_per_unit' => $itemDetail['subtotal_per_unit'],
            ];
        }

        // Save the entire transaction to the database
        Kasir::create([
            'id_transaksi' => $validatedData['order_id'],
            'id_pembeli' => $pembeli->id_pembeli,
            'order_id' => $validatedData['order_id'],
            'riwayat_transaksi' => json_encode($riwayatTransaksi),
            'subtotal_keseluruhan' => $validatedData['subtotal'],
            'potongan_harga' => $validatedData['discount'],
            'uang_yang_dibayarkan' => $validatedData['paid_amount'],
            'total_pembayaran' => $validatedData['gross_amount'],
            'kembalian' => $validatedData['change'],
            'tanggal_transaksi' => $validatedData['transaction_time'],
            'metode_pembayaran' => $validatedData['metode_pembayaran'],
            'nama_bank' => $validatedData['nama_bank'],
            'status_pembayaran' => $validatedData['status_pembayaran'],
        ]);

        // Respond with HTTP 200 OK
        return response()->json(['status' => 'success']);
    }

    // CASH
    public function store2(Request $request)
    {
        // Validate the incoming request
        $validatedData = $request->validate([
            'order_id' => 'required',
            'subtotal' => 'required',
            'discount' => 'required',
            'paid_amount' => 'required',
            'gross_amount' => 'required',
            'change' => 'required',
            'transaction_time' => 'required',
            'items' => 'required|array',
            'items.*.id_barang' => 'required',
            'items.*.kode_barang' => 'required',
            'items.*.price' => 'required',
            'items.*.quantity' => 'required',
            'items.*.subtotal_per_unit' => 'required',
            'items.*.nama_item' => 'required',
            'customer_details' => 'required',
            'customer_details.id_pembeli' => 'required',
            'customer_details.name' => 'required',
            'customer_details.email' => 'required',
            'customer_details.phone' => 'required',
            'metode_pembayaran' => 'required',
            'nama_bank' => 'required',
            'status_pembayaran' => 'required',
        ]);
    
        // Access customer details
        $customerDetails = $validatedData['customer_details'];
        $pembeli = Datapembeli::where('id_pembeli', $customerDetails['id_pembeli'])->firstOrFail();
    
        // Prepare an array to hold all items for the transaction
        $riwayatTransaksi = [];
    
        // Process each item in the transaction
        foreach ($validatedData['items'] as $itemDetail) {
            if (empty($itemDetail['id_barang'])) {
                throw new \Exception('Item ID is missing');
            }
    
            $item = Item::where('id_barang', $itemDetail['id_barang'])->first();
            
            if (!$item) {
                throw new \Exception('Item not found: ' . $itemDetail['id_barang']);
            }
            
            // Add item to the transaction history array
            $riwayatTransaksi[] = [
                'id_barang' => $itemDetail['id_barang'],
                'kode_barang' => $itemDetail['kode_barang'],
                'nama_barang' => $itemDetail['nama_item'],
                'harga_per_unit' => $itemDetail['price'],
                'jumlah' => $itemDetail['quantity'],
                'subtotal_per_unit' => $itemDetail['subtotal_per_unit'],
            ];
        }
    
        // Save the entire transaction to the database
        Kasir::create([
            'id_transaksi' => $validatedData['order_id'],
            'id_pembeli' => $pembeli->id_pembeli,
            'order_id' => $validatedData['order_id'],
            'riwayat_transaksi' => json_encode($riwayatTransaksi),
            'subtotal_keseluruhan' => $validatedData['subtotal'],
            'potongan_harga' => $validatedData['discount'],
            'uang_yang_dibayarkan' => $validatedData['paid_amount'],
            'total_pembayaran' => $validatedData['gross_amount'],
            'kembalian' => $validatedData['change'],
            'tanggal_transaksi' => $validatedData['transaction_time'],
            'metode_pembayaran' => $validatedData['metode_pembayaran'],
            'nama_bank' => $validatedData['nama_bank'],
            'status_pembayaran' => $validatedData['status_pembayaran'],
        ]);
    
        // Respond with HTTP 200 OK
        return response()->json(['status' => 'success']);
    }

  
    public function generateSnapToken(Request $request)
    {
        $validatedData = $request->validate([
            'order_id' => 'required',
            'gross_amount' => 'required',
            'customer_details' => 'required',
            'customer_details.first_name' => 'required',
            'customer_details.last_name' => 'nullable',
            'customer_details.email' => 'required',
            'customer_details.phone' => 'required',
            'items' => 'required|array',
            'items.*.id' => 'required',
            'items.*.price' => 'required',
            'items.*.quantity' => 'required',
            'items.*.name' => 'required',
        ]);
        
        // Set Midtrans configuration
        \Midtrans\Config::$serverKey = config('midtrans.server_key');
        \Midtrans\Config::$isProduction = false; // Set to true for Production environment
        \Midtrans\Config::$isSanitized = true; // Set sanitization on
        \Midtrans\Config::$is3ds = true; // Set 3DS for credit card

        // Prepare transaction parameters
        $params = [
            'transaction_details' => [
                'order_id' => $validatedData['order_id'], // ID order dari frontend
                'gross_amount' => $validatedData['gross_amount'], // Jumlah total dari frontend
            ],
            'customer_details' => $validatedData['customer_details'],
            'item_details' => array_map(function($item) {
                return [
                    'id' => $item['id'],
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                    'name' => $item['name']
                ];
            }, $validatedData['items']),
            'credit_card' => [
                'secure' => true, // Enable 3DS for credit card transactions
            ],
        ];

        $snapToken = \Midtrans\Snap::createTransaction($params)->token;
        return response()->json(['snapToken' => $snapToken]);
    }



    public function callback(Request $request)
    {
        $serverKey = config('midtrans.server_key');
        $hashed = hash("sha512", $request->order_id.$request->status_code.$request->gross_amount.$serverKey);

        if ($hashed == $request->signature_key) {
            // Cari transaksi berdasarkan order_id
            $transaksi = Kasir::where('order_id', $request->order_id)->first();

            if ($transaksi) {
                // Mapping metode pembayaran dari Midtrans ke opsi enum di database
            
                
                $metodePembayaranMapping = [
                    'bank_transfer' => 'bank_transfer',
                    'credit_card'   => 'credit_card',
                    'gopay'         => 'gopay',
                    'shopeepay'     => 'shopeepay',
                    'qris'          => 'qris',
                    // Tambahkan mapping lain jika diperlukan
                ];

                // Ambil metode pembayaran dari request
                $metodePembayaran = $metodePembayaranMapping[$request->payment_type] ?? 'other';

                // Ambil nama bank jika tersedia di va_numbers
                $namaBank = null;
                if ($request->payment_type == 'bank_transfer' && isset($request->va_numbers[0]['bank'])) {
                    $namaBank = $request->va_numbers[0]['bank'];
                }

                if ($request->payment_type == 'credit_card' && isset($request->fraud_status) && $request->fraud_status == 'accept') {
                    // Example of extracting bank name from credit card transactions
                    // Note: Adjust this according to the actual response structure from Midtrans
                    $namaBank = $request->credit_card['bank'] ?? 'Unknown';  
                }

            
                if ($request->transaction_status == 'capture' || $request->transaction_status == 'settlement') {
                    // Jika transaksi berhasil, ubah status pembayaran menjadi "Paid"
                    $transaksi->update([
                        'status_pembayaran' => 'Paid',
                        'nama_bank' => $namaBank,
                        'metode_pembayaran' => $metodePembayaran,
                    ]);
                } elseif ($request->transaction_status == 'pending') {
                    // Jika transaksi pending, ubah status pembayaran menjadi "Pending"
                    $transaksi->update([
                        'status_pembayaran' => 'Pending',
                        'nama_bank' => $namaBank,
                        'metode_pembayaran' => $metodePembayaran,
                    ]);
                } elseif (in_array($request->transaction_status, ['deny', 'expire', 'cancel'])) {
                    // Jika transaksi ditolak atau gagal, ubah status pembayaran menjadi "Failed"
                    $transaksi->update([
                        'status_pembayaran' => 'Failed',
                        'nama_bank' => $namaBank,
                        'metode_pembayaran' => $metodePembayaran,
                    ]);
                }
            }
        }

        // Kembalikan response yang sesuai kepada Midtrans
        return response()->json(['message' => 'Payment status updated successfully']);
    }









   
}
