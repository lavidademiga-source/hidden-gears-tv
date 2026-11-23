# Hidden Gears · publication repo

Videos for the YouTube channel **Hidden Gears** (@HiddenGearsTV).
The owner's scheduler reads this repo and schedules each video on YouTube.

## Structure

One folder per publication day, at the repo root:

```
YYYY-MM-DD/
  YYYY-MM-DD_1_topic.mp4
  YYYY-MM-DD_2_topic.mp4   (only if there is a second video that day)
  manifest.json
```

- Videos: MP4 (H.264 + AAC), 1080x1920, under 3 minutes and under 100 MB.
- `manifest.json`: `canal` is always exactly `Hidden Gears`; `publicar_en` uses the Europe/Madrid offset of that date.
- Folders already uploaded are never modified, renamed or deleted.
