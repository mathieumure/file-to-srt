import { readFile, writeFile } from 'fs/promises';

const fileInput = process.argv[2]
const DURATION_IN_MS = 47_000;

const timeFormatted = (amount: number, padLength: number = 2): string => amount.toString().padStart(padLength, "0")
const generateTime = (frequence: number) => (frame: number) => {
    const frameStart = frequence * frame;
    const millisec = frameStart % 1000;
    const sec = Math.floor(frameStart / 1000) % 60;
    const minutes = Math.floor(frameStart / 60_000) % 60;
    const hours = Math.floor(frameStart / (60 * 60_000));
    // 00:05:00,400
    return `${timeFormatted(hours)}:${timeFormatted(minutes)}:${timeFormatted(sec)},${timeFormatted(millisec, 3)}`
}

const run = async () => {
    const file = await readFile(fileInput);
    const lines = file.toString().split('\n').filter(Boolean);
    const frequence = Math.floor(DURATION_IN_MS /lines.length);
    const generateTimeForFrequence = generateTime(frequence)

    const srtLines = lines.map((line, index) => {
        return `${index+1}
${generateTimeForFrequence(index)} --> ${generateTimeForFrequence(index+1)}
${line}

`
    })

    await writeFile('output.srt', srtLines.join('\n'))
}

run().catch(err => console.error(err))
