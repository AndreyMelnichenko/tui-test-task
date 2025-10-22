import * as fs from 'fs';

function globalSetup() {
    fs.readFileSync(`logo`, 'utf-8')
        .split(/\r?\n/)
        .forEach(function (line: string) {
            // eslint-disable-next-line no-console -- Log PX project logo
            console.log(line);
        });
}

export default globalSetup;
