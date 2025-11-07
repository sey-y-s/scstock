<?php

namespace App\Http\Controllers;

use App\Models\StockMovement;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class PdfExportController extends Controller
{
    public function stockMovementInvoice(StockMovement $stockMovement)
    {
        $stockMovement->load([
            'items.product',
            'supplier',
            'customer'
        ]);

        $name = $stockMovement->type === 'in'
            ? ($stockMovement->supplier->name ?? 'N/A')
            : ($stockMovement->customer->name ?? 'N/A');

        $data = [
            'movement' => $stockMovement,
            'name'=> $name,
            'company' => $this->getCompanyInfo(),
            'invoice' => $this->getInvoiceInfo($stockMovement),
        ];

        $pdf = Pdf::loadView('pdf.stock-movement-invoice', $data);
        $fileName = 'Facture-' . $stockMovement->reference . '-' . now()->format('d-m-Y') . '.pdf';

        return $pdf->stream($fileName);
        // return $pdf->download($fileName);
    }

    public function stockMovementPreview(StockMovement $stockMovement)
    {
        return view('pdf.preview', compact('stockMovement'));
    }


    private function getCompanyInfo()
    {
        return [
            'name' => config('app.company.name', 'Samadiare Cosmetics'),
            'address' => config('app.company.address', 'Annexe grande mosquée de Bamako'),
            'city' => config('app.company.city', 'Bamako'),
            'email' => config('app.company.email', '79150509 - 66129199 - 75559096'),
            'logo' => config('app.company.logo', '/storage/logo.png'),
        ];
    }

    private function getInvoiceInfo(StockMovement $stockMovement)
    {
        $typeLabels = [
            'in' => 'APPROVISIONNEMENT',
            'out' => 'FACTURE DE VENTE',
            'transfer' => 'BON DE TRANSFERT'
        ];

        return [
            'title' => $typeLabels[$stockMovement->type] ?? 'DOCUMENT',
            'number' => $stockMovement->reference,
            'date' => $stockMovement->created_at->format('d/m/Y'),
        ];
    }
}
