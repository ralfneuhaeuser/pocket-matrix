# Pocket Matrix

**Mach deinen Bildschirm zur Anzeigetafel.**

Lauftexte, Programme, Angebote und QR-Codes für Veranstaltungen, Schaufenster, Gastronomie oder persönliche Botschaften. Experimentelle Browser-Anwendung in einer einzelnen HTML-Datei; keine Anmeldung, keine externen Bibliotheksdownloads, kein Upload durch die App.

## Schnellstart

1. `index.html` in einem normalen Browser öffnen, nicht nur in einer Dateivorschau.
2. Text ersetzen: eine Zeile pro Anzeige.
3. „Display starten“ antippen. Weitere Optionen sind aufklappbar.
4. Display antippen, um Pause, Vollbild, Darstellung und Einstellungen einzublenden.

Querformat ist für lange Texte meist hilfreicher. Leertaste pausiert, E/Escape führt zur Bearbeitung, F schaltet Vollbild ein oder aus, ohne die Anzeige anzuhalten. TXT-Import ersetzt den bisherigen Text. Einstellungen werden lokal gespeichert; privates Browsen/Browserwechsel kann dies einschränken.

## Funktionsumfang

- Smart-Modus: kurze Texte stehen, lange Texte laufen; alternativ horizontales Laufband.
- Geschwindigkeit, Schrift, LED-Größe, Farbe, Laufrichtung und Übergänge.
- Dunkle LED-/helle Papierdarstellung; Emoji und Symbolkürzel.
- Offline erzeugte QR-Karten, TXT-Import, Deutsch/Englisch/Japanisch.
- Vollbild und Bildschirm-Wachhalten werden angefragt, sind aber nicht garantiert.

## Prüfstand und Grenzen

Version **0.5.0**, erste öffentliche Fassung vom 4. Oktober 2026.

Start/Pause/Wiederstart, Paper-Modus, Rückkehr in die Einstellungen und Vollbildwechsel wurden manuell in Chrome geprüft. Japanische Schriftzeichen benötigen passende Systemschriften; ihre Lesbarkeit im Punktraster muss am Zielgerät geprüft werden. Die japanische Übersetzung wurde noch nicht muttersprachlich gegengelesen.

`node smoke-test.cjs` prüft Anwendungslogik mit simuliertem DOM/Canvas. Dieser Test besteht, ersetzt aber keinen visuellen Browser- oder Gerätetest. Safari/Chrome/Firefox, iPhone/iPad/Android, QR-Decodierung und längerer Betrieb sind noch nicht vollständig geprüft. Die automatische Browserprüfung lokaler Dateien war nicht verfügbar.

Browser-Vollbild benötigt Unterstützung und eine Nutzeraktion. iOS-Dateivorschauen sind kein verlässlicher Betriebsweg. Einstellungen auf einem anderen Gerät sind nicht automatisch verfügbar. Vor einem Event Lesbarkeit, QR-Scan, Stromversorgung und Bildschirmsperre prüfen. Keine sicherheitskritische Anzeige allein auf diese Anwendung stützen.

## Entwicklung

`legacy/` enthält zwei nachträglich importierte, für die Öffentlichkeit neutralisierte Vorstufen. Sie sind historische Beispiele, nicht empfohlene Einsatzversionen. Originale und private Eventkonfigurationen sind nicht Teil dieses Pakets. Änderungen siehe `CHANGELOG.md`.

## Lizenz und Urheberschaft

MIT, siehe `LICENSE`. Kommerzielle Nutzung, Veränderung und Weitergabe sind erlaubt; Copyright-/Lizenzhinweise müssen erhalten bleiben. Eingebetteter QR-Code-Generator: siehe `THIRD_PARTY_NOTICES.md`.

Entwickelt von Ralf Neuhäuser mit KI-Unterstützung. Der Projektname ist vor Veröffentlichung noch auf mögliche Kennzeichenkonflikte zu prüfen; keine Markenfreigabe behauptet.
