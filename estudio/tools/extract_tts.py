import json, sys, re, shutil
p, outdir = sys.argv[1], sys.argv[2]
arr = json.load(open(p))
blob = re.search(r"saved to (\S+\.wav)", arr[0]["text"]).group(1)
shutil.copy(blob, outdir + "/raw.wav")
d = json.loads(arr[1]["text"])
open(outdir + "/raw.url", "w").write(d["url"])
print({k: (v if not isinstance(v, str) or len(v) < 200 else len(v)) for k, v in d.items()})
