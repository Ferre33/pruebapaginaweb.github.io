#!/usr/bin/env python3
"""Build an offline locality index. Downloads contain public place names, not visitor data."""
import argparse
import gzip
import hashlib
import json
import re
from pathlib import Path
import urllib.request
import zipfile

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://download.geonames.org/export/dump/'
FILES = ['cities1000.zip', 'ES.zip', 'admin1CodesASCII.txt', 'admin2Codes.txt']

def build(cache):
    cache.mkdir(parents=True, exist_ok=True)
    for name in FILES:
        dest = cache / name
        if not dest.exists():
            with urllib.request.urlopen(BASE + name, timeout=120) as response:
                dest.write_bytes(response.read())
    regions = {}
    provinces = {}
    for name, target in [('admin1CodesASCII.txt', regions), ('admin2Codes.txt', provinces)]:
        for line in (cache / name).read_text().splitlines():
            fields = line.split('\t')
            target[fields[0]] = fields[1]
    spanish_regions = {'07':'Illes Balears','51':'Andalucía','53':'Canarias','54':'Castilla-La Mancha','60':'Comunitat Valenciana','32':'Navarra','52':'Aragón','55':'Castilla y León','56':'Cataluña','59':'País Vasco'}
    for code, name in spanish_regions.items():
        regions['ES.'+code] = name
    for code, name in list(provinces.items()):
        if code.startswith('ES.'):
            provinces[code] = re.sub(r'^(?:Provincia de |Província de |Provincia da |Province of )', '', name)
    provinces.update({'ES.60.V':'Valencia','ES.60.CS':'Castellón','ES.58.C':'A Coruña'})
    # Include smaller Spanish villages; exclude neighbourhoods, abandoned and historical places.
    places = {}
    allowed = {'PPL', 'PPLA', 'PPLA2', 'PPLA3', 'PPLA4', 'PPLC'}
    for archive, member in [('cities1000.zip', 'cities1000.txt'), ('ES.zip', 'ES.txt')]:
        with zipfile.ZipFile(cache / archive) as z:
            for line in z.read(member).decode('utf-8').splitlines():
                f = line.split('\t')
                if f[7] not in allowed or len(f[1]) > 150:
                    continue
                region = regions.get(f'{f[8]}.{f[10]}', '')
                province = provinces.get(f'{f[8]}.{f[10]}.{f[11]}', '')
                places[int(f[0])] = [int(f[0]), f[1], f[8], region[:150], province[:150], float(f[4]), float(f[5]), int(f[14] or 0)]
    document = {'columns': ['id', 'city', 'country', 'region', 'province', 'lat', 'lon', 'population'], 'places': sorted(places.values())}
    raw = json.dumps(document, ensure_ascii=False, separators=(',', ':')).encode()
    dest = ROOT / 'server/data/localities.json.gz'
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(gzip.compress(raw, compresslevel=9, mtime=0))
    manifest = {'source': BASE, 'license': 'CC BY 4.0', 'files': {n: hashlib.sha256((cache / n).read_bytes()).hexdigest() for n in FILES}, 'places': len(places), 'spain_places': sum(p[2] == 'ES' for p in places.values()), 'sha256': hashlib.sha256(dest.read_bytes()).hexdigest()}
    (dest.parent / 'localities-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    print(json.dumps({'places': len(places), 'bytes_gzip': dest.stat().st_size, 'spain_places': manifest['spain_places']}))

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--cache', type=Path, default=Path('/tmp/bebepunt-geography'))
    build(parser.parse_args().cache)
