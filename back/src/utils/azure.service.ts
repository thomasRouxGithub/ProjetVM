/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-lines */
import { CachingTypes, ComputeManagementClient } from '@azure/arm-compute';
import { NetworkManagementClient } from '@azure/arm-network';
import { ResourceManagementClient } from '@azure/arm-resources';
import { StorageManagementClient } from '@azure/arm-storage';
import { DefaultAzureCredential } from '@azure/identity';
import { Injectable } from '@nestjs/common';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as dotenv from 'dotenv';
import * as util from 'util';

@Injectable()
export class AzureService {
  static async startAzure(): Promise<string> {
    try {
      await createResources();
      await manageResources();
      return testResult;
    } catch (err) {
      console.log(err);
    }
  }
}
let testResult: string = '';
dotenv.config();
// Store function output to be used elsewhere
const randomIds: any = {};
let subnetInfo: any = null;
let publicIPInfo: any = null;
let vmImageInfo: any = null;
let nicInfo: any = null;

//Random number generator for service names and settings
const resourceGroupName = _generateRandomId('diberry-testrg', randomIds);
const vmName = _generateRandomId('testvm', randomIds);
const storageAccountName = _generateRandomId('testac', randomIds);
const vnetName = _generateRandomId('testvnet', randomIds);
const subnetName = _generateRandomId('testsubnet', randomIds);
const publicIPName = _generateRandomId('testpip', randomIds);
const networkInterfaceName = _generateRandomId('testnic', randomIds);
const ipConfigName = _generateRandomId('testcrpip', randomIds);
const domainNameLabel = _generateRandomId('testdomainname', randomIds);
const osDiskName = _generateRandomId('testosdisk', randomIds);

// Resource configs
const location = 'eastus';
const accType = 'Standard_LRS';

// Ubuntu config for VM
const publisher = 'Canonical';
const offer = 'UbuntuServer';
const sku = '14.04.3-LTS';
const adminUsername = 'notadmin';
const adminPassword = 'Pa$$w0rd92';

// Azure platform authentication
const clientId = process.env.AZURE_CLIENT_ID;
const domain = process.env.AZURE_TENANT_ID;
const secret = process.env.AZURE_CLIENT_SECRET;
const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;

const credentials = new DefaultAzureCredential();

// Azure services
const resourceClient = new ResourceManagementClient(
  credentials,
  subscriptionId,
);
const computeClient = new ComputeManagementClient(credentials, subscriptionId);
const storageClient = new StorageManagementClient(credentials, subscriptionId);
const networkClient = new NetworkManagementClient(credentials, subscriptionId);

function _generateRandomId(prefix: string, existIds: any) {
  let newNumber;
  while (true) {
    newNumber = prefix + Math.floor(Math.random() * 10000);
    if (!existIds || !(newNumber in existIds)) {
      break;
    }
  }
  return newNumber;
}
async function createResources() {
  try {
    await createResourceGroup();
    await createStorageAccount();
    await createVnet();
    subnetInfo = await getSubnetInfo();
    publicIPInfo = await createPublicIP();
    nicInfo = await createNIC(subnetInfo, publicIPInfo);
    vmImageInfo = await findVMImage();
    await getNICInfo();
    await createVirtualMachine(nicInfo.id, vmImageInfo[0].name);
    return;
  } catch (err) {
    console.log(err);
  }
}
async function createResourceGroup() {
  const groupParameters = {
    location: location,
    tags: { sampletag: 'sampleValue' },
  };
  console.log('\n1.Creating resource group: ' + resourceGroupName);
  return await resourceClient.resourceGroups.createOrUpdate(
    resourceGroupName,
    groupParameters,
  );
}
async function createStorageAccount() {
  console.log('\n2.Creating storage account: ' + storageAccountName);
  const createParameters = {
    location: location,
    sku: {
      name: accType,
    },
    kind: 'Storage',
    tags: {
      tag1: 'val1',
      tag2: 'val2',
    },
  };
  return await storageClient.storageAccounts.beginCreateAndWait(
    resourceGroupName,
    storageAccountName,
    createParameters,
  );
}
async function createVnet() {
  const vnetParameters = {
    location: location,
    addressSpace: {
      addressPrefixes: ['10.0.0.0/16'],
    },
    dhcpOptions: {
      dnsServers: ['10.1.1.1', '10.1.2.4'],
    },
    subnets: [{ name: subnetName, addressPrefix: '10.0.0.0/24' }],
  };
  console.log('\n3.Creating vnet: ' + vnetName);
  return await networkClient.virtualNetworks.beginCreateOrUpdateAndWait(
    resourceGroupName,
    vnetName,
    vnetParameters,
  );
}
async function getSubnetInfo() {
  console.log('\nGetting subnet info for: ' + subnetName);
  return await networkClient.subnets.get(
    resourceGroupName,
    vnetName,
    subnetName,
  );
}

async function createPublicIP(): Promise<any> {
  const publicIPParameters = {
    location: location,
    publicIPAllocationMethod: 'Dynamic',
    dnsSettings: {
      domainNameLabel: domainNameLabel,
    },
  };
  console.log('\n4.Creating public IP: ' + publicIPName);
  testResult += `public IP : ${publicIPName}`;
  return await networkClient.publicIPAddresses.beginCreateOrUpdateAndWait(
    resourceGroupName,
    publicIPName,
    publicIPParameters,
  );
}

async function createNIC(subnetInfo: any, publicIPInfo: any): Promise<any> {
  const nicParameters = {
    location: location,
    ipConfigurations: [
      {
        name: ipConfigName,
        privateIPAllocationMethod: 'Dynamic',
        subnet: subnetInfo,
        publicIPAddress: publicIPInfo,
      },
    ],
  };
  console.log('\n5.Creating Network Interface: ' + networkInterfaceName);
  return await networkClient.networkInterfaces.beginCreateOrUpdateAndWait(
    resourceGroupName,
    networkInterfaceName,
    nicParameters,
  );
}

async function findVMImage(): Promise<any> {
  console.log(
    util.format(
      '\nFinding a VM Image for location %s from ' +
        'publisher %s with offer %s and sku %s',
      location,
      publisher,
      offer,
      sku,
    ),
  );
  return await computeClient.virtualMachineImages.list(
    location,
    publisher,
    offer,
    sku,
    { top: 1 },
  );
}

async function getNICInfo(): Promise<any> {
  return await networkClient.networkInterfaces.get(
    resourceGroupName,
    networkInterfaceName,
  );
}

async function createVirtualMachine(nicId: any, vmImageVersionNumber: any) {
  const vmParameters = {
    location: location,
    osProfile: {
      computerName: vmName,
      adminUsername: adminUsername,
      adminPassword: adminPassword,
    },
    hardwareProfile: {
      vmSize: 'Standard_B1ls',
    },
    storageProfile: {
      imageReference: {
        publisher: publisher,
        offer: offer,
        sku: sku,
        version: vmImageVersionNumber,
      },
      osDisk: {
        name: osDiskName,
        caching: 'None' as CachingTypes, // Convertir en CachingTypes
        createOption: 'fromImage',
        vhd: {
          uri:
            'https://' +
            storageAccountName +
            '.blob.core.windows.net/nodejscontainer/osnodejslinux.vhd',
        },
      },
    },
    networkProfile: {
      networkInterfaces: [
        {
          id: nicId,
          primary: true,
        },
      ],
    },
  };
  console.log('6.Creating Virtual Machine: ' + vmName);
  console.log(
    ' VM create parameters: ' + util.inspect(vmParameters, { depth: null }),
  );
  await computeClient.virtualMachines.beginCreateOrUpdateAndWait(
    resourceGroupName,
    vmName,
    vmParameters,
  );
}
async function manageResources() {
  await getVirtualMachines();
  //   await turnOffVirtualMachines(resourceGroupName, vmName, computeClient);
  await startVirtualMachines(resourceGroupName, vmName, computeClient);

  const resultListVirtualMachines = await listVirtualMachines();
  console.log(
    util.format(
      'List all the vms under the current ' + 'subscription \n%s',
      util.inspect(resultListVirtualMachines, { depth: null }),
    ),
  );
}
async function getVirtualMachines() {
  console.log(`Get VM Info about ${vmName}`);
  return await computeClient.virtualMachines.get(resourceGroupName, vmName);
}
async function turnOffVirtualMachines(
  resourceGroupName: any,
  vmName: any,
  computeClient: any,
) {
  console.log(`Poweroff the VM ${vmName}`);
  return await computeClient.virtualMachines.beginPowerOff(
    resourceGroupName,
    vmName,
  );
}

async function startVirtualMachines(
  resourceGroupName: any,
  vmName: any,
  computeClient: any,
) {
  console.log(`Start the VM ${vmName}`);
  return await computeClient.virtualMachines.beginStart(
    resourceGroupName,
    vmName,
  );
}

async function listVirtualMachines() {
  console.log(`Lists VMs`);
  const result = [];
  for await (const item of computeClient.virtualMachines.listAll()) {
    result.push(item);
  }
  return result;
}
