// Educational sample rates only.
// These values are intentionally NOT presented as current AWS prices.

export const SAMPLE_RATES_JPY = {
  ec2InstanceMonth: 4200,
  rdsInstanceMonth: 7800,
  s3StorageGbMonth: 3,
  cloudfrontTransferGb: 15,
};

function numberOrZero(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export function calculateSampleCost(input) {
  const quantities = {
    ec2Instances: numberOrZero(input.ec2Instances),
    rdsInstances: numberOrZero(input.rdsInstances),
    s3StorageGb: numberOrZero(input.s3StorageGb),
    cloudfrontTransferGb: numberOrZero(input.cloudfrontTransferGb),
  };

  const breakdown = {
    ec2:
      quantities.ec2Instances *
      SAMPLE_RATES_JPY.ec2InstanceMonth,

    rds:
      quantities.rdsInstances *
      SAMPLE_RATES_JPY.rdsInstanceMonth,

    s3:
      quantities.s3StorageGb *
      SAMPLE_RATES_JPY.s3StorageGbMonth,

    cloudfront:
      quantities.cloudfrontTransferGb *
      SAMPLE_RATES_JPY.cloudfrontTransferGb,
  };

  const total = Object.values(breakdown).reduce(
    (sum, value) => sum + value,
    0
  );

  return {
    quantities,
    breakdown,
    total,
  };
}
