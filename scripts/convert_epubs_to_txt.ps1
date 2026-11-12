# scripts/convert_epubs_to_txt.ps1
# Convierte todos los libros .epub en Plan AI Studio/Bibliografia a texto plano (.txt) en Plan AI Studio/Bibliografia_TXT
# Conserva orden del spine (capitulos), decodifica entidades HTML y limpia etiquetas sin perdida de contenido.

Add-Type -AssemblyName System.IO.Compression.FileSystem

$sourceDir = Join-Path $PSScriptRoot "..\Plan AI Studio\Bibliografia"
$targetDir = Join-Path $PSScriptRoot "..\Plan AI Studio\Bibliografia_TXT"

if (-not (Test-Path -Path $sourceDir)) {
    Write-Error "No se encontro el directorio origen: $sourceDir"
    exit 1
}

if (-not (Test-Path -Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    Write-Host "[CREADO] Directorio de salida: $targetDir"
}

function Clean-HtmlContent {
    param ([string]$html)

    if ([string]::IsNullOrWhiteSpace($html)) {
        return ""
    }

    # 1. Eliminar bloques no textuales (<style>, <script>, <head>)
    $cleaned = [System.Text.RegularExpressions.Regex]::Replace($html, '(?s)<(script|style|head)[^>]*>.*?</\1>', '', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

    # 2. Reemplazar encabezados y saltos de bloque
    $cleaned = [System.Text.RegularExpressions.Regex]::Replace($cleaned, '(?i)</?(h[1-6]|p|div|tr|blockquote)[^>]*>', "`r`n`r`n")
    $cleaned = [System.Text.RegularExpressions.Regex]::Replace($cleaned, '(?i)<br\s*/?>', "`r`n")
    $cleaned = [System.Text.RegularExpressions.Regex]::Replace($cleaned, '(?i)<li[^>]*>', "`r`n• ")
    $cleaned = [System.Text.RegularExpressions.Regex]::Replace($cleaned, '(?i)</li>', "")

    # 3. Eliminar todas las etiquetas HTML restantes
    $cleaned = [System.Text.RegularExpressions.Regex]::Replace($cleaned, '<[^>]+>', '')

    # 4. Decodificar entidades HTML (&nbsp;, &aacute;, &#8220;, etc.)
    $cleaned = [System.Net.WebUtility]::HtmlDecode($cleaned)

    # 5. Normalizar espacios inseparables y caracteres especiales
    $cleaned = $cleaned.Replace("$([char]0x00A0)", " ") # non-breaking space
    $cleaned = $cleaned.Replace("$([char]0x200B)", "")  # zero-width space

    # 6. Normalizar saltos de linea excesivos (mas de dos seguidos -> dos)
    $cleaned = [System.Text.RegularExpressions.Regex]::Replace($cleaned, '(\r?\n[ \t]*){3,}', "`r`n`r`n")

    return $cleaned.Trim()
}

function Convert-SingleEpub {
    param (
        [string]$epubFile,
        [string]$outputDir
    )

    $fileName = [System.IO.Path]::GetFileNameWithoutExtension($epubFile)
    # Limpiar nombre de archivo para simplificar el uso en AI Studio
    $safeName = $fileName -replace '\s+', ' ' -replace '\(z-library\.sk.*?\)', ''
    $safeName = $safeName.Trim()
    $targetFile = Join-Path $outputDir "$safeName.txt"

    Write-Host "=================================================="
    Write-Host "Procesando: $fileName"

    $zip = $null
    try {
        $zip = [System.IO.Compression.ZipFile]::OpenRead($epubFile)
        
        # 1. Localizar el archivo OPF (Package Document)
        $opfPath = $null
        $containerEntry = $zip.Entries | Where-Object { $_.FullName -eq "META-INF/container.xml" }
        if ($containerEntry) {
            $stream = $containerEntry.Open()
            $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
            $containerContent = $reader.ReadToEnd()
            $reader.Close()
            $stream.Close()

            if ($containerContent -match 'full-path="([^"]+)"') {
                $opfPath = $matches[1]
            }
        }

        # Fallback: buscar cualquier archivo .opf en el zip
        if (-not $opfPath) {
            $opfEntry = $zip.Entries | Where-Object { $_.FullName -like "*.opf" } | Select-Object -First 1
            if ($opfEntry) {
                $opfPath = $opfEntry.FullName
            }
        }

        if (-not $opfPath) {
            Write-Warning "No se encontro archivo OPF en $fileName. Procesando archivos HTML directamente por nombre..."
            $htmlEntries = $zip.Entries | Where-Object { $_.FullName -match '\.(x?html?)$' } | Sort-Object FullName
            $allText = @()
            foreach ($entry in $htmlEntries) {
                $s = $entry.Open()
                $r = New-Object System.IO.StreamReader($s, [System.Text.Encoding]::UTF8)
                $content = $r.ReadToEnd()
                $r.Close()
                $s.Close()
                $txt = Clean-HtmlContent -html $content
                if (-not [string]::IsNullOrWhiteSpace($txt)) {
                    $allText += $txt
                }
            }
            $finalContent = $allText -join "`r`n`r`n---`r`n`r`n"
            [System.IO.File]::WriteAllText($targetFile, $finalContent, [System.Text.Encoding]::UTF8)
            Write-Host "[OK] Guardado: $targetFile ($([Math]::Round($finalContent.Length / 1024, 2)) KB)"
            return
        }

        # 2. Leer archivo OPF
        $opfEntry = $zip.Entries | Where-Object { $_.FullName -eq $opfPath }
        if (-not $opfEntry) {
            # Quitar posibles barras iniciales
            $normalizedOpf = $opfPath.TrimStart('/')
            $opfEntry = $zip.Entries | Where-Object { $_.FullName -eq $normalizedOpf }
        }

        $opfStream = $opfEntry.Open()
        $opfReader = New-Object System.IO.StreamReader($opfStream, [System.Text.Encoding]::UTF8)
        $opfContent = $opfReader.ReadToEnd()
        $opfReader.Close()
        $opfStream.Close()

        $opfDir = [System.IO.Path]::GetDirectoryName($opfPath).Replace('\', '/')
        if ($opfDir -eq ".") { $opfDir = "" }

        # 3. Extraer manifest items (id -> href)
        $manifest = @{}
        $itemRegex = [System.Text.RegularExpressions.Regex]::Matches($opfContent, '<item\b([^>]+)>', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        foreach ($match in $itemRegex) {
            $tag = $match.Groups[1].Value
            $id = $null
            $href = $null
            if ($tag -match 'id="([^"]+)"') { $id = $matches[1] }
            if ($tag -match 'href="([^"]+)"') { $href = $matches[1] }
            if ($id -and $href) {
                # Decodificar URL href si tiene %20
                $manifest[$id] = [System.Uri]::UnescapeDataString($href)
            }
        }

        # 4. Extraer spine (orden de lectura de idrefs)
        $spineItems = @()
        $spineMatches = [System.Text.RegularExpressions.Regex]::Matches($opfContent, '<itemref\b([^>]+)>', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
        foreach ($sMatch in $spineMatches) {
            $tag = $sMatch.Groups[1].Value
            if ($tag -match 'idref="([^"]+)"') {
                $spineItems += $matches[1]
            }
        }

        # 5. Iterar en orden del spine y extraer texto
        $chapterTexts = @()
        $processedCount = 0

        foreach ($idref in $spineItems) {
            if ($manifest.ContainsKey($idref)) {
                $relHref = $manifest[$idref]
                
                # Quitar posibles anclas (#anchor)
                if ($relHref.Contains('#')) {
                    $relHref = $relHref.Substring(0, $relHref.IndexOf('#'))
                }

                # Construir ruta completa dentro del zip
                $fullEntryPath = if ([string]::IsNullOrEmpty($opfDir)) { $relHref } else { "$opfDir/$relHref" }
                # Normalizar barras
                $fullEntryPath = $fullEntryPath -replace '\\', '/'
                # Resolver ../ si existen
                $parts = $fullEntryPath.Split('/')
                $stack = New-Object System.Collections.Generic.List[string]
                foreach ($p in $parts) {
                    if ($p -eq "..") {
                        if ($stack.Count -gt 0) { $stack.RemoveAt($stack.Count - 1) }
                    } elseif ($p -ne "." -and $p -ne "") {
                        $stack.Add($p)
                    }
                }
                $normalizedPath = $stack -join '/'

                $entry = $zip.Entries | Where-Object { $_.FullName -eq $normalizedPath }
                if (-not $entry) {
                    # Busqueda insensible a mayusculas o coincidencia final
                    $entry = $zip.Entries | Where-Object { $_.FullName -like "*$relHref" } | Select-Object -First 1
                }

                if ($entry) {
                    $entryStream = $entry.Open()
                    $entryReader = New-Object System.IO.StreamReader($entryStream, [System.Text.Encoding]::UTF8)
                    $rawHtml = $entryReader.ReadToEnd()
                    $entryReader.Close()
                    $entryStream.Close()

                    $cleaned = Clean-HtmlContent -html $rawHtml
                    if (-not [string]::IsNullOrWhiteSpace($cleaned)) {
                        $chapterTexts += $cleaned
                        $processedCount++
                    }
                }
            }
        }

        if ($chapterTexts.Count -eq 0) {
            Write-Warning "El spine no extrajo texto. Intentando fallback por entradas xhtml/html..."
            $htmlEntries = $zip.Entries | Where-Object { $_.FullName -match '\.(x?html?)$' } | Sort-Object FullName
            foreach ($entry in $htmlEntries) {
                $s = $entry.Open()
                $r = New-Object System.IO.StreamReader($s, [System.Text.Encoding]::UTF8)
                $content = $r.ReadToEnd()
                $r.Close()
                $s.Close()
                $txt = Clean-HtmlContent -html $content
                if (-not [string]::IsNullOrWhiteSpace($txt)) {
                    $chapterTexts += $txt
                    $processedCount++
                }
            }
        }

        $fullBookText = $chapterTexts -join "`r`n`r`n=== SECCION ===`r`n`r`n"
        [System.IO.File]::WriteAllText($targetFile, $fullBookText, [System.Text.Encoding]::UTF8)

        $sizeKb = [Math]::Round((Get-Item $targetFile).Length / 1KB, 1)
        $words = ($fullBookText -split '\s+').Count
        Write-Host "[EXITO] Extraidos $processedCount capitulos/secciones."
        Write-Host "        Archivo: $([System.IO.Path]::GetFileName($targetFile))"
        Write-Host "        Tamano: $sizeKb KB | Palabras aprox: $words"

    } catch {
        Write-Error "Error procesando $fileName : $_"
    } finally {
        if ($zip) { $zip.Dispose() }
    }
}

$epubFiles = Get-ChildItem -Path $sourceDir -Filter "*.epub"
Write-Host "Encontrados $($epubFiles.Count) archivos .epub para convertir..."

foreach ($epub in $epubFiles) {
    Convert-SingleEpub -epubFile $epub.FullName -outputDir $targetDir
}

Write-Host "=================================================="
Write-Host "CONVERSION FINALIZADA. Archivos guardados en:"
Write-Host $targetDir
