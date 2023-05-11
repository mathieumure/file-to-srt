# File to SRT

This tool aims to convert your script into srt file.

## Getting started

- Clone this repository and install the dependencies

```
pnpm install
```

- Create an input file, e.g. `input.txt` a add your video script inside it.
- Make sure to create a line per subtitle
- Edit the `index.ts` file and set your video duration in ms in the `DURATION_IN_MS` variable (it will be more user friendly in the futur)
- Start the conversion

```
pnpm start
```

- Your srt file is generated as `output.srt`
