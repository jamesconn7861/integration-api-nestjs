import { ChangeParams } from '../types';

/*
  Moved these out of the main service. They have
  no dependencies and makes the main service
  much more readable.
*/

async function createRangeString(
  changeParams: ChangeParams,
): Promise<rangeResults> {
  const baseString = `eth${changeParams.benchId}/1`;

  if (changeParams.lockedPorts == undefined) {
    return {
      rangeString: `${baseString}/${changeParams.reqRange[0]}-${changeParams.reqRange[1]}`,
    } as rangeResults;
  } else {
    const ranges: string[] = [];
    let startPort: number = null;
    const skippedPorts = [];

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

interface rangeResults {
  rangeString: string;
  skippedPorts: number[];
}

/*
  This function is a little messy, but I wanted to keep it short. 
  The data from the switch comes back and is parsed into individual 
  strings in the following format:
  Eth108/1/1    --                 notconnec 103       auto    auto    10/100/1000BaseT
  Each line is then broken down into individual componets (port, status, description and vlan).
  This will change when switching over to https requests instead of SSH.
*/
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
    const portNumber = +port.slice(0, 14).trim().split('/').pop();
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
