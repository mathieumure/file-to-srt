#!/usr/bin/env ts-node

import { readFile, writeFile } from 'fs/promises';
import { parseArgs } from 'node:util';

const commandLineArgs = parseArgs({
    options: {
        videoDuration: {
            short: 'd',
            type: "string"
        },
        output: {
            short: 'o',
            type: "string",
            default: 'output.srt'
        }
    },
    allowPositionals: true
})

const fileInput = commandLineArgs.positionals[0]
if (!fileInput) {
    throw new Error("You should give a input file\n");
}
const durationInMs = parseInt(commandLineArgs.values.videoDuration as string);
if (!durationInMs) {
    throw new Error("You should give the video duration in ms with option -d\n");
}
const output = commandLineArgs.values.output as string;

const timeFormatted = (amount: number, padLength: number = 2): string => amount.toString().padStart(padLength, "0")
const generateTime = (frequence: number) => (frame: number) => {
    const frameStart = frequence * frame;
    const millisec = frameStart % 1000;
    const sec = Math.floor(frameStart / 1000) % 60;
    const minutes = Math.floor(frameStart / 60_000) % 60;
    const hours = Math.floor(frameStart / (60 * 60_000));
    return `${timeFormatted(hours)}:${timeFormatted(minutes)}:${timeFormatted(sec)},${timeFormatted(millisec, 3)}`
}

const run = async () => {
    const file = await readFile(fileInput);
    const lines = file.toString().split('\n').filter(Boolean);
    const frequence = Math.floor(durationInMs /lines.length);
    const generateTimeForFrequence = generateTime(frequence)

    const srtLines = lines.map((line, index) => {
        return `${index+1}
${generateTimeForFrequence(index)} --> ${generateTimeForFrequence(index+1)}
${line}

`
    })

    await writeFile(output, srtLines.join('\n'));
    console.log("✅ Successfully written to", output, "\n")
}

run().catch(err => console.error(err))
