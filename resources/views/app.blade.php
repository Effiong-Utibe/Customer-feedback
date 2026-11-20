<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/png" href="{{ asset('images/ui.png') }}" />
    <link rel="apple-touch-icon" href="{{ asset('images/ui.png') }}" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <title inertia>{{ config('app.name', 'UI Ventures Feedback') }}</title>
    @viteReactRefresh
    @vite (['resources/js/app.tsx', 'resources/css/app.css'])
    @inertiaHead
</head>
<body class="font-sans antialiased">
    @inertia
</body>
</html>
