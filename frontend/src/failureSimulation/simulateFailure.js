const SCENARIOS = {
  ec2InstanceFailure: {
    id: 'ec2InstanceFailure',
    relevantServices: ['ec2'],
  },
  ecsTaskFailure: {
    id: 'ecsTaskFailure',
    relevantServices: ['ecsFargate'],
  },
  rdsFailure: {
    id: 'rdsFailure',
    relevantServices: ['rdsPostgres'],
  },
  azOutage: {
    id: 'azOutage',
    relevantServices: ['ec2', 'ecsFargate', 'rdsPostgres'],
  },
};

export const FAILURE_SCENARIO_IDS = Object.keys(SCENARIOS);

export function simulateFailure({
  scenarioId,
  selectedServices,
  architectureConfig,
}) {
  const selected = new Set(selectedServices);

  if (!SCENARIOS[scenarioId]) {
    throw new Error(`Unknown failure scenario: ${scenarioId}`);
  }

  const affectedServices = [];
  let severity = 'low';
  let impactKey = `failureSimulator.results.${scenarioId}.impactDefault`;
  let resilienceKey = `failureSimulator.results.${scenarioId}.resilienceDefault`;

  if (scenarioId === 'ec2InstanceFailure' && selected.has('ec2')) {
    affectedServices.push('ec2');

    const count = Number(architectureConfig.ec2?.instanceCount ?? 1);
    const autoScaling = architectureConfig.ec2?.autoScalingEnabled === true;

    if (count <= 1 && !autoScaling) {
      severity = 'high';
      impactKey = 'failureSimulator.results.ec2InstanceFailure.impactHigh';
      resilienceKey = 'failureSimulator.results.ec2InstanceFailure.resilienceHigh';
    } else {
      severity = 'medium';
      impactKey = 'failureSimulator.results.ec2InstanceFailure.impactMedium';
      resilienceKey = 'failureSimulator.results.ec2InstanceFailure.resilienceMedium';
    }
  }

  if (scenarioId === 'ecsTaskFailure' && selected.has('ecsFargate')) {
    affectedServices.push('ecsFargate');

    const taskCount = Number(architectureConfig.ecsFargate?.taskCount ?? 1);
    const autoScaling = architectureConfig.ecsFargate?.autoScalingEnabled === true;

    if (taskCount <= 1 && !autoScaling) {
      severity = 'high';
      impactKey = 'failureSimulator.results.ecsTaskFailure.impactHigh';
      resilienceKey = 'failureSimulator.results.ecsTaskFailure.resilienceHigh';
    } else {
      severity = 'medium';
      impactKey = 'failureSimulator.results.ecsTaskFailure.impactMedium';
      resilienceKey = 'failureSimulator.results.ecsTaskFailure.resilienceMedium';
    }
  }

  if (scenarioId === 'rdsFailure' && selected.has('rdsPostgres')) {
    affectedServices.push('rdsPostgres');

    const multiAZ = architectureConfig.rdsPostgres?.multiAZ === true;
    const backups = architectureConfig.rdsPostgres?.backupsEnabled === true;

    if (!multiAZ) {
      severity = 'high';
      impactKey = 'failureSimulator.results.rdsFailure.impactHigh';
      resilienceKey = backups
        ? 'failureSimulator.results.rdsFailure.resilienceBackupsOnly'
        : 'failureSimulator.results.rdsFailure.resilienceHigh';
    } else {
      severity = 'medium';
      impactKey = 'failureSimulator.results.rdsFailure.impactMedium';
      resilienceKey = 'failureSimulator.results.rdsFailure.resilienceMedium';
    }
  }

  if (scenarioId === 'azOutage') {
    const candidates = ['ec2', 'ecsFargate', 'rdsPostgres'];

    for (const serviceId of candidates) {
      if (selected.has(serviceId)) affectedServices.push(serviceId);
    }

    const ec2Resilient =
      !selected.has('ec2') || architectureConfig.ec2?.multiAZ === true;

    const ecsResilient =
      !selected.has('ecsFargate') ||
      architectureConfig.ecsFargate?.multiAZ === true;

    const rdsResilient =
      !selected.has('rdsPostgres') ||
      architectureConfig.rdsPostgres?.multiAZ === true;

    if (!ec2Resilient || !ecsResilient || !rdsResilient) {
      severity = 'critical';
      impactKey = 'failureSimulator.results.azOutage.impactCritical';
      resilienceKey = 'failureSimulator.results.azOutage.resilienceCritical';
    } else {
      severity = 'medium';
      impactKey = 'failureSimulator.results.azOutage.impactMedium';
      resilienceKey = 'failureSimulator.results.azOutage.resilienceMedium';
    }
  }

  return {
    scenarioId,
    severity,
    affectedServices,
    impactKey,
    resilienceKey,
  };
}
