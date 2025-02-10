from flask import Flask, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

def get_current_song():
    url = "http://cc112sumenep.com:8000/ilm"
    headers = {"Icy-MetaData": "1"}

    response = requests.get(url, headers=headers, stream=True)
    metaint = int(response.headers.get("icy-metaint", 0))

    if metaint:
        response.raw.read(metaint)
        metadata = response.raw.read(160).decode(errors="ignore")
        raw_song = metadata.split("StreamTitle='")[-1].split("';")[0]

        if raw_song and "-" in raw_song:
            artist, title = map(str.strip, raw_song.split("-", 1))
        else:
            artist, title = "Tidak diketahui", raw_song

        return {"song": title, "artist": artist}

    return {"song": "Tidak ada lagu yang sedang diputar", "artist": "Tidak diketahui"}

@app.route('/current-song', methods=['GET'])
def current_song():
    return jsonify(get_current_song())

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
