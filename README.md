![Logo](admin/smgd.png)
# ioBroker.smgd

[![NPM version](http://img.shields.io/npm/v/iobroker.smgd.svg)](https://www.npmjs.com/package/iobroker.smgd)
[![Downloads](https://img.shields.io/npm/dm/iobroker.smgd.svg)](https://www.npmjs.com/package/iobroker.smgd)
![Number of Installations (latest)](http://iobroker.live/badges/smgd-installed.svg)
![Number of Installations (stable)](http://iobroker.live/badges/smgd-stable.svg)
[![Dependency Status](https://img.shields.io/david/rrongit/iobroker.smgd.svg)](https://david-dm.org/rrongit/iobroker.smgd)
[![Known Vulnerabilities](https://snyk.io/test/github/rrongit/ioBroker.smgd/badge.svg)](https://snyk.io/test/github/rrongit/ioBroker.smgd)

[![NPM](https://nodei.co/npm/iobroker.smgd.png?downloads=true)](https://nodei.co/npm/iobroker.smgd/)

**Tests:** ![Test and Release](https://github.com/rrongit/ioBroker.smgd/workflows/Test%20and%20Release/badge.svg)

## smgd adapter for ioBroker

###### smgd seht für "smart-me get devices"

Der smgd Adapter kann Gerätedaten, inkl. der entsprechende Werte, von der web.smart-me.com Plattform lesen.
[smart-me](https://web.smart-me.com/)

Der Adapter erstellt die States im ioBroker und schreibt die Werte der Geräte in die entsprechende States.

Die Daten werden über eine API Schnittstelle gelesen.
[API smart-me](https://smart-me.com/swagger/ui/index)

## Settings die im Adapter gemacht werden müssen:

- "username" Benutzername von der web.smart-me.com Plattform. Es kann der Benutzername oder die Emailadresse verwendet werden.
- "password" Passwort von der web.smart-me.com Plattform.
- "Leseintervall der Geräte" Der Leseintervall wird in ms eingestellt und kann frei gewählt werden, Werte kleiner als 60000ms (1 Minute) werden nicht akzeptiert. Gibt man einen kleineren Wert als 60000ms ein, stellt der Adapter den Intervall auf 60000ms ein.

## getestete Geräte:

###### Typ und Anzahl der Geräte, die erfolgreich von der web.smart-me.com Plattform gelesen werden konnten:

Typ:    Kamstrup Modul
Anzahl: 1 oder 2
[Kamstrup Modul](https://web.smart-me.com/project/kamstrup-modul/)

## Changelog

### 0.0.2 (03.03.2021)
* (reto) Intervall nicht unter 1 Minute möglich, README.md, Sprachfiles und Adaptersettingspage angepasst

### 0.0.1 (01.03.2021)
* (reto) initial release

## License
MIT License

Copyright (c) 2021 reto <reto@infinityflow.ch>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.