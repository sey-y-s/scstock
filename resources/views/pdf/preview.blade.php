<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Prévisualisation Facture</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: sans-serif;
        }
        iframe {
            width: 100%;
            height: 100vh;
            border: none;
        }
    </style>
</head>
<body>

    <iframe id="pdfFrame" src="{{ route('pdf.operation.invoice', $stockMovement) }}"></iframe>

</body>
</html>
