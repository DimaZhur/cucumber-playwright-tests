
# Автоматический запуск тестов с WireGuard, ретраями и отчётами (Telegram + Email)
# Поддерживает режим проверки уведомлений: -CheckNotification


param (
    [switch]$CheckNotification  # если указан — запускаем только проверку Telegram и Email
)

# Общие настройки 
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
$global:ErrorActionPreference = "Stop"

$wgExe = "C:\Program Files\WireGuard\wireguard.exe"
$wgConfig = "C:\Program Files\WireGuard\Data\Configurations\dimaspc.conf.dpapi"
$projectPath = "D:\Work\cucumber-playwright-tests"

Set-Location $projectPath

# Telegram 
$global:telegramToken = "8361825268:AAHIWmXE5eGG4b_x2ITivXXlZpHND0wi5lk"
$global:chatId = @("-1003234326791")

#  Email 
$global:smtpServer = "smtp.gmail.com"
$global:smtpPort = 587
$global:smtpUser = "qa.zhurauleu@gmail.com"
$global:smtpPass = "lxqywvkoifwbztiy"  # пароль приложения Gmail
$global:mailTo = "d.zhurauleu@finsei.com, dina.osipova@finsei.com"

#  Функции 
function global:Send-EmailReport($subject, $bodyText, $attachmentPath) {
    try {
        $cred = New-Object System.Net.NetworkCredential($smtpUser, $smtpPass)

        $msg = New-Object System.Net.Mail.MailMessage
        $msg.From = $smtpUser
        $msg.To.Add($mailTo)
        $msg.Subject = $subject
        $msg.IsBodyHtml = $true  # ВАЖНО: теперь письмо HTML
        $msg.Body = $bodyText
        $msg.BodyEncoding = [System.Text.Encoding]::UTF8
        $msg.SubjectEncoding = [System.Text.Encoding]::UTF8

        if ($attachmentPath -and (Test-Path $attachmentPath)) {
            $msg.Attachments.Add((New-Object System.Net.Mail.Attachment($attachmentPath)))
        }

        $smtp = New-Object Net.Mail.SmtpClient($smtpServer, $smtpPort)
        $smtp.EnableSsl = $true
        $smtp.Credentials = $cred
        $smtp.Send($msg)

        Write-Host "✅ Email sent to $mailTo"
    }
    catch {
        Write-Host "❌ Email send error: $($_.Exception.Message)"
        if ($_.ErrorDetails.Message) { Write-Host "⚠️ Details: $($_.ErrorDetails.Message)" }
    }
}


function global:Send-TelegramMessage($text) {
    foreach ($id in @($chatId)) {  # гарантируем перечисление
        try {
            $url = "https://api.telegram.org/bot$telegramToken/sendMessage"
            $body = @{
                chat_id   = $id
                text      = $text
                parse_mode = "HTML"
            }
            Invoke-RestMethod -Uri $url -Method POST -Body $body | Out-Null
            Write-Host "💬 Telegram message sent to $id"
        } catch {
            Write-Host ("❌ Telegram message send error to {0}: {1}" -f $id, $_.Exception.Message)
            if ($_.ErrorDetails.Message) { Write-Host "⚠️ Details: $($_.ErrorDetails.Message)" }
        }
    }
}

function global:Send-TelegramReportFile($filePath, $caption) {
    foreach ($id in @($chatId)) {
        try {
            $url = "https://api.telegram.org/bot$telegramToken/sendDocument"
            $form = @{
                chat_id  = $id
                caption  = $caption
                document = Get-Item -Path $filePath
            }
            Invoke-RestMethod -Uri $url -Method POST -Form $form | Out-Null
            Write-Host "📎 HTML report sent to $id"
        } catch {
            Write-Host ("❌ Telegram file send error to {0}: {1}" -f $id, $_.Exception.Message)
            if ($_.ErrorDetails.Message) { Write-Host "⚠️ Details: $($_.ErrorDetails.Message)" }
        }
    }
}



function global:Send-EmailReport($subject, $bodyText, $attachmentPath) {
    try {
        $cred = New-Object System.Net.NetworkCredential($smtpUser, $smtpPass)

        $msg = New-Object System.Net.Mail.MailMessage
        $msg.From = $smtpUser
        $msg.To.Add($mailTo)
        $msg.Subject = $subject
        $msg.Body = $bodyText
        $msg.BodyEncoding = [System.Text.Encoding]::UTF8
        $msg.SubjectEncoding = [System.Text.Encoding]::UTF8

        if ($attachmentPath -and (Test-Path $attachmentPath)) {
            $msg.Attachments.Add((New-Object System.Net.Mail.Attachment($attachmentPath)))
        }

        $smtp = New-Object Net.Mail.SmtpClient($smtpServer, $smtpPort)
        $smtp.EnableSsl = $true
        $smtp.Credentials = $cred
        $smtp.Send($msg)

        Write-Host "✅ Email sent to $mailTo"
    }
    catch {
        Write-Host "❌ Email send error: $($_.Exception.Message)"
        if ($_.ErrorDetails.Message) { Write-Host "⚠️ Details: $($_.ErrorDetails.Message)" }
    }
}

# Режим проверки уведомлений
if ($CheckNotification) {
    Write-Host "=== РЕЖИМ ПРОВЕРКИ УВЕДОМЛЕНИЙ ===" -ForegroundColor Cyan
    Send-TelegramMessage "🔔 Тестовое сообщение из PowerShell! <b>$(Get-Date -Format 'HH:mm:ss')</b>"
    $testBody = "Это тестовое письмо, отправленное PowerShell-скриптом Finsei UI Tests.`n`n$(Get-Date)"
    Send-EmailReport "📬 Тестовое письмо от Finsei UI Tests" $testBody ""
    Write-Host "✅ Проверка уведомлений завершена." -ForegroundColor Green
    exit 0
}

# Проверяем VPN 
Write-Host "Проверяю статус WireGuard..." -ForegroundColor Cyan

$expectedService = "WireGuardTunnel$((Split-Path $wgConfig -Leaf).Replace('.conf.dpapi',''))"
$wgServices = Get-Service | Where-Object { $_.Name -like "WireGuardTunnel*" }
$running = $wgServices | Where-Object { $_.Status -eq "Running" }

if ($running) {
    Write-Host "✅ WireGuard уже работает: $($running.Name)"
}
else {
    Write-Host "WireGuard не запущен, пробую подключить..." -ForegroundColor Yellow
    try {
        & "$wgExe" /installtunnelservice $wgConfig
        Start-Sleep -Seconds 7

        $wgServices = Get-Service | Where-Object { $_.Name -like "WireGuardTunnel*" }
        $running = $wgServices | Where-Object { $_.Status -eq "Running" }

        if ($running) {
            Write-Host "✅ WireGuard успешно подключён: $($running.Name)"
        }
        else {
            Write-Host "❌ Ошибка: не удалось подключить WireGuard. Останавливаю выполнение."
            exit 1
        }
    }
    catch {
        if ($_.Exception.Message -match "already installed and running") {
            Write-Host "⚙️ Туннель уже запущен, продолжаем выполнение."
        }
        else {
            Write-Host "❌ Ошибка при подключении WireGuard: $($_.Exception.Message)"
            exit 1
        }
    }
}

Write-Host "🔹 Продолжаю выполнение тестов..." -ForegroundColor Cyan

#  Гарантируем, что сеть восстановлена и комп не уснёт во время тестов 
Write-Host "⏳ Жду восстановления сети и блокирую сон..." -ForegroundColor Yellow

Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public class Power {
    [DllImport("kernel32.dll", SetLastError = true)]
    public static extern uint SetThreadExecutionState(uint esFlags);
}
"@
[Power]::SetThreadExecutionState(2147483648 + 1) | Out-Null


$maxWait = 60
$elapsed = 0
while ($elapsed -lt $maxWait) {
    try {
        if (Test-Connection -ComputerName "8.8.8.8" -Count 1 -Quiet -ErrorAction Stop) {
            Write-Host "✅ Сеть доступна, продолжаю выполнение." -ForegroundColor Green
            break
        }
    } catch {}
    Start-Sleep -Seconds 5
    $elapsed += 5
}
if ($elapsed -ge $maxWait) {
    Write-Host "⚠️ Интернет так и не появился за $maxWait секунд, продолжаю с риском." -ForegroundColor Yellow
}

# Контексты тестов
cd $projectPath
$contexts = @(
    "test:report:individual",
    "test:report:business",
    "test:report:sandbox:individual",
    "test:report:sandbox:business"
)


# Контексты тестов
cd $projectPath
$contexts = @(
    "test:report:individual",
    "test:report:business",
    "test:report:sandbox:individual",
    "test:report:sandbox:business"
)

# Запуск тестов
foreach ($context in $contexts) {
    Write-Host "`n🚀 Запуск контекста $context..." -ForegroundColor Cyan

    $maxAttempts = 3
    $attempt = 1
    $success = $false
    $failedCount = 0
    $passedCount = 0
    $skippedCount = 0

    while ($attempt -le $maxAttempts -and -not $success) {
        Write-Host "Попытка $attempt из $maxAttempts..." -ForegroundColor Yellow
        npm run $context

        $reportFile = Get-ChildItem "$projectPath\reports" -Filter "*.json" |
            Sort-Object LastWriteTime -Descending | Select-Object -First 1

        if ($null -ne $reportFile) {
            try {
                $json = Get-Content $reportFile.FullName -Raw | ConvertFrom-Json -ErrorAction Stop
            }
            catch {
                Write-Host "⚠️ Ошибка при парсинге отчёта JSON — считаю прогон неуспешным."
                $attempt++
                continue
            }

            $allSteps = $json | ForEach-Object { $_.elements | ForEach-Object { $_.steps } } | Where-Object { $_.result }
            $passedCount  = ($allSteps | Where-Object { $_.result.status -eq "passed" }).Count
            $skippedCount = ($allSteps | Where-Object { $_.result.status -eq "skipped" }).Count
            $failedCount  = ($allSteps | Where-Object { $_.result.status -notin @("passed","skipped") }).Count

            if ($failedCount -eq 0) {
                Write-Host "✅ Контекст $context прошёл успешно." -ForegroundColor Green
                $success = $true
            }
            else {
                Write-Host "❌ $failedCount упавших шагов. Повтор через 10 секунд..." -ForegroundColor Red
                Start-Sleep -Seconds 10
                $attempt++
            }
        }
        else {
            Write-Host "⚠️ Отчёт не найден - считаю прогон неуспешным." -ForegroundColor Yellow
            $attempt++
        }
    }


# Ждём появления лога (до 10 секунд)
$sanitizedContext = $context -replace ':', '.'
$sanitizedContext = $sanitizedContext -replace 'test.report.', 'test.' -replace 'report.', ''

# Исправляем sandbox-контексты, чтобы не было префикса test.
if ($sanitizedContext -match '^test\.sandbox') {
    $sanitizedContext = $sanitizedContext -replace '^test\.', ''
}

$expectedLog = Join-Path "$projectPath\logs" "test-runs-$sanitizedContext.log"

$maxWait = 10
$elapsed = 0
while (-not (Test-Path $expectedLog) -and $elapsed -lt $maxWait) {
    Start-Sleep -Seconds 1
    $elapsed++
}

if (-not (Test-Path $expectedLog)) {
    Write-Host "⚠️ Лог для контекста '$context' не найден (ожидался $expectedLog)!"
    continue
}

$logFile = Get-Item $expectedLog
Write-Host "✅ Найден лог-файл: $($logFile.Name)"

    $lastLine = Get-Content $logFile.FullName | Select-Object -Last 1
    if ($lastLine -match '\[(?<timestamp>[^\]]+)\]\s+Features:\s+(?<features>\d+),\s+Scenarios:\s+(?<scenarios>\d+),\s+Passed:\s+(?<passed>\d+),\s+Failed:\s+(?<failed>\d+),\s+Skipped:\s+(?<skipped>\d+),\s+Duration:\s+(?<duration>[\d\.]+)s') {
        $featuresTotal    = [int]$matches['features']
        $scenariosTotal   = [int]$matches['scenarios']
        $passedScenarios  = [int]$matches['passed']
        $failedScenarios  = [int]$matches['failed']
        $skippedScenarios = [int]$matches['skipped']
        $duration         = [decimal]$matches['duration']
        $timestamp        = $matches['timestamp']
    } else {
        Write-Host "⚠️ Не удалось распарсить логовую строку!"
        Write-Host "RAW LINE: $lastLine"
        continue
    }

# Нормализуем статус для контекстов, где 1 пропуск — допустим 
$allowedSkipContexts = @(
    "test:report:business",
    "test:report:sandbox:individual",
    "test:report:sandbox:business"
)

$skipIsAllowed = $false
if ($allowedSkipContexts -contains $context -and $failedScenarios -eq 0 -and $skippedScenarios -le 1) {
    $skipIsAllowed = $true
    Write-Host "📘 Для $context один пропущенный сценарий считается нормой — считаем прогон успешным."
}

# === Формируем сообщение ===
if ($failedScenarios -gt 0) {
    $statusText = "❌ Failed $failedScenarios scenario(s)!"
}
elseif ($skippedScenarios -gt 0 -and -not $skipIsAllowed) {
    $statusText = "⚠️ Skipped $skippedScenarios scenario(s)!"
}
else {
    $statusText = "✅ All tests passed successfully!"
}

# Формируем итоговое сообщение для Telegram 
$summary = @"
Context: $context
Status: $statusText
Scenarios total: $scenariosTotal
Passed: $passedScenarios
Skipped: $skippedScenarios
Failed: $failedScenarios
Duration: ${duration}s
Time: $timestamp
"@


    Write-Host "⚙️ DEBUG: ВЫХОД НА ОТПРАВКУ УВЕДОМЛЕНИЙ ($context)" -ForegroundColor Yellow
    Write-Host "⚙️ DEBUG SUMMARY:`n$summary" -ForegroundColor Cyan

    Write-Host "DEBUG: Отправляем уведомления ($context)" -ForegroundColor Cyan
    Send-TelegramMessage $summary

    # HTML-отчёт
    $htmlReport = Get-ChildItem "$projectPath\reports" -Filter "*.html" -ErrorAction SilentlyContinue |
        Sort-Object LastWriteTime -Descending | Select-Object -First 1

    if ($htmlReport) {
        Write-Host "📎 Прикладываем HTML-отчёт: $($htmlReport.Name)"
        Send-TelegramReportFile $htmlReport.FullName "Отчёт: $context"
        Send-EmailReport "Finsei UI Tests — $context" $summary $htmlReport.FullName
    } else {
        Write-Host "⚠️ HTML-отчёт не найден, письмо отправлено без вложения."
        Send-EmailReport "Finsei UI Tests — $context" $summary ""
    }
}

# === Разрешаем системе снова засыпать ===
[Power]::SetThreadExecutionState(2147483648) | Out-Null

Write-Host "💤 Тесты завершены, блокировка сна снята." -ForegroundColor Gray

