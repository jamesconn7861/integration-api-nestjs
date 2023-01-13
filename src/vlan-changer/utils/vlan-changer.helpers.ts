import { ChangeParams } from '../types';

async function createRangeString(changeParams: ChangeParams) {
  let baseString: string = `eth${changeParams.benchId}/1`;

  if (changeParams.lockedPorts == undefined) {
    return `${baseString}/${changeParams.reqRange[0]}-${changeParams.reqRange[1]}`;
  } else {
    let ranges: string[] = [];
    let startPort: number = null;
    let skippedPorts = [];

    for (
      let i: number = changeParams.reqRange[0];
      i <= changeParams.reqRange[1];
      i++
    ) {
      if (!changeParams.lockedPorts.includes(i) && startPort == null)
        startPort = i;
      if (changeParams.lockedPorts.includes(i)) skippedPorts.push(i);
      if (changeParams.lockedPorts.includes(i) && startPort != null) {
        if (i - 1 != startPort) {
          ranges.push(`${baseString}/${startPort}-${i - 1}`);
        } else if (i - 1 == startPort) {
          ranges.push(`${baseString}/${i - 1}`);
        }
        startPort = null;
      }

      if (
        i == changeParams.reqRange[1] &&
        !changeParams.lockedPorts.includes(i) &&
        startPort == i
      ) {
        ranges.push(`${baseString}/${i}`);
      } else if (
        i == changeParams.reqRange[1] &&
        !changeParams.lockedPorts.includes(i)
      ) {
        ranges.push(`${baseString}/${startPort}-${i}`);
      }
    }

    return {
      rangeString: ranges.join(', ') as string,
      skippedPorts: skippedPorts as number[],
    };
  }
}

async function parseSwitchStatus(
  swtichStatusString: string,
  rangeFilter?: string[],
) {
  const parsedData: {
    port: number;
    description: string;
    status: string;
    vlan: string;
  }[] = [];
  const switchPorts: string[] = swtichStatusString.split(/\r?\n/);

  switchPorts.forEach((port: string) => {
    let portNumber = +port.slice(0, 14).trim().split('/').pop();
    if (isNaN(portNumber)) return;
    if (
      (rangeFilter && portNumber < +rangeFilter[0]) ||
      portNumber > +rangeFilter[1]
    ) {
      return;
    }
    parsedData.push({
      port: portNumber,
      description: port.slice(14, 33).trim(),
      status: port.slice(33, 43).trim(),
      vlan: port.slice(43, 53).trim(),
    });
  });

  return parsedData;
}

export { createRangeString, parseSwitchStatus };
