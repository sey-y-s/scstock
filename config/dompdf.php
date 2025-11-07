<?php

return [
    'mode' => 'utf-8',
    'format' => 'A4',
    'default_font' => 'dejavu sans',
    'font_dir' => storage_path('fonts/'),
    'font_cache' => storage_path('fonts/'),
    'temp_dir' => storage_path('app/dompdf/temp/'),
    'chroot' => realpath(base_path()),
    'allowed_protocols' => ['file://', 'http://', 'https://'],
    'enable_font_subsetting' => false,
    'pdf_backend' => 'CPDF',
    'dpi' => 96,
    'enable_php' => false,
    'enable_javascript' => true,
    'enable_remote' => true,
    'log_output_file' => null,
    'font_height_ratio' => 1.1,
    'isHtml5ParserEnabled' => true,
    'isFontSubsettingEnabled' => false,
];
