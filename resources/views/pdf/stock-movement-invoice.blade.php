<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Facture #{{ $invoice['number'] }}</title>
    <style>
        @page { size: A4; margin: 25mm 20mm 30mm 20mm; }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            color: #333;
            font-size: 12px;
            line-height: 1.4;
            margin: 0;
            position: relative;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
        }

        .company {
            display: flex;
            align-items: center;
            font-size: 14px;
            font-weight: bold;
        }

        .company-logo {
            max-width: 120px;
            max-height: 120px;
            margin-right: 10px;
        }

        .company-info div {
            margin-bottom: 2px;
            font-weight: normal;
            font-size: 11px;
        }

        .client {
            margin-top: 6px;
            font-size: 12px;
            font-weight: bold;
        }

        .invoice-info {
            text-align: right;
            font-size: 12px;
        }

        .invoice-title {
            font-size: 18px;
            font-weight: bold;
            color: #222;
            margin-bottom: 3px;
        }

        .section-title {
            font-size: 13px;
            font-weight: bold;
            margin-top: 15px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 3px;
            color: #444;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            table-layout: fixed;
        }

        th, td {
            padding: 6px 4px;
            border-bottom: 1px solid #eee;
        }

        th {
            background: #f5f5f5;
            font-weight: bold;
            text-align: left;
        }

        .text-right { text-align: right; }

        th:first-child, td:first-child { width: 60px; } /* Réf */
        th:nth-child(2), td:nth-child(2) { width: 45%; } /* Désignation */
        th:nth-child(3), td:nth-child(3),
        th:nth-child(4), td:nth-child(4),
        th:nth-child(5), td:nth-child(5) { width: 15%; }

        .truncate {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .total {
            margin-top: 15px;
            border-top: 2px solid #000;
            padding-top: 8px;
            width: 100%;
        }

        .footer {
            position: fixed;
            bottom: 10mm;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 10px;
            color: #888;
            border-top: 1px solid #eee;
            padding-top: 5px;
        }

        .highlight { color: #2e4863; }

        table, tr, td, th, p, div { page-break-inside: avoid; }
    </style>
</head>
<body>


    <div class="header">
        <div class="company">
            @if($company['logo'])
                <img src="{{ public_path($company['logo']) }}" class="company-logo" alt="Logo">
            @endif
            <div class="company-info">
                <div><strong>{{ $company['name'] }}</strong></div>
                <div>{{ $company['address'] }}</div>
                <div>{{ $company['email'] }}</div>
            </div>
        </div>

        <div class="invoice-info">
            <div class="invoice-title">{{ $invoice['title'] ?? 'Facture' }}</div>
            <div>N° {{ $invoice['number'] }}</div>
            <div>Date : {{ $invoice['date'] }}</div>
        </div>
        <div class="client">
            Client : {{ $name }}
        </div>
    </div>

    <div>
        <div class="section-title">Détails</div>
        <table>
            <thead>
            <tr>
                <th>Réf</th>
                <th>Désignation</th>
                <th class="text-right">Qté</th>
                <th class="text-right">PU</th>
                <th class="text-right">Total</th>
            </tr>
            </thead>
            <tbody>
            @php
                $subTotal = 0;
            @endphp
            @foreach($movement->items as $item)
            @php
                $itemTotal = $item->quantity * $item->unit_price;
                $subTotal += $itemTotal;
            @endphp
                <tr>
                    <td>{{ $item->product->reference ?? '' }}</td>
                    <td class="truncate">{{ $item->product->name ?? '' }}</td>
                    <td class="text-right">{{ $item->quantity }}</td>
                    <td class="text-right">{{ number_format($item->unit_price, 0, ',', ' ') }} F</td>
                    <td class="text-right">{{ number_format($itemTotal, 0, ',', ' ') }} F</td>
                </tr>
            @endforeach
            </tbody>
        </table>

        <table class="total">
            {{-- <tr>
                <td class="text-right" style="width: 80%">Sous-total :</td>
                <td class="text-right">{{ number_format($subTotal, 2, ',', ' ') }} F</td>
            </tr> --}}
            {{-- <tr>
                <td class="text-right">TVA ({{ $movement->tax_rate ?? 0 }}%) :</td>
                <td class="text-right">{{ number_format($movement->tax_amount ?? 0, 0, ',', ' ') }} F</td>
            </tr> --}}
            <tr>
                <td class="text-right" style="font-weight: bold;">
                    Total :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style="color:#003e7d;">{{ number_format($subTotal, 0, ',', ' ') }} F</span>
                </td>
            </tr>
        </table>
    </div>

    <div class="footer">
        <span class="highlight">{{ $company['name'] }}</span> vous remercie pour votre confiance.
    </div>
</body>
</html>
