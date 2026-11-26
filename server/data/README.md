# Locality directory

`localities.json.gz` is an offline, filtered GeoNames directory built on 26 November 2026.
It combines `cities1000.zip` (international populated places) and current Spanish
populated places from `ES.zip`, with administrative names from `admin1CodesASCII.txt`
and `admin2Codes.txt`. Neighbourhoods, historical and abandoned places are excluded.

Source and attribution: **GeoNames**, https://www.geonames.org/ —
https://download.geonames.org/export/dump/ — licensed under
[Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/).
The source data has been filtered, combined and compressed. It is supplied without
a guarantee of completeness or accuracy. Source hashes are in `localities-manifest.json`.

Rebuild: `python scripts/build-geography.py --cache /tmp/bebepunt-geography`.
Remove/re-download the cache first when intentionally updating the source snapshot.

This directory contains public place coordinates, never visitor positions.
Lookup runs inside BEBEPUNT's server; visitor data is not sent to GeoNames or an
external geocoding API. Nearest-place suggestions do not establish municipal
boundaries. The visitor must confirm the locality before its daily total increases.
